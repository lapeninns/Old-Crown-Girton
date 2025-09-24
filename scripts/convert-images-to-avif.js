#!/usr/bin/env node

/**
 * Bulk convert raster images to AVIF while keeping originals as fallbacks.
 *
 * Usage: node scripts/convert-images-to-avif.js [globRoots...]
 * Defaults to the entire repository while skipping node_modules, backups, and optimized derivatives.
 */

const path = require('path');
const fs = require('fs/promises');
const { glob } = require('glob');
const sharp = require('sharp');

const ROOT = process.cwd();

const DEFAULT_IGNORE = [
  '**/*.avif',
  'node_modules/**',
  '.next/**',
  'backups/**',
  '.git/**',
  'artifacts/**',
  'public/images/optimized/**'
];

const DEFAULT_PATTERNS = [
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.webp'
];

const QUALITY_PRESETS = {
  avif: { quality: 80, effort: 6 }
};

const log = (msg) => process.stdout.write(`${msg}\n`);

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

async function convertFile(filePath) {
  const relPath = path.relative(ROOT, filePath);
  const targetPath = path.join(path.dirname(filePath), `${path.parse(filePath).name}.avif`);

  if (await fileExists(targetPath)) {
    return { status: 'skipped', path: relPath, reason: 'avif-exists' };
  }

  try {
    const input = sharp(filePath, { failOn: 'none' });
    const metadata = await input.metadata();

    if (metadata.pages && metadata.pages > 1) {
      return { status: 'skipped', path: relPath, reason: 'animated' };
    }

    const buffer = await input.avif(QUALITY_PRESETS.avif).toBuffer();
    await ensureDir(targetPath);
    await fs.writeFile(targetPath, buffer);

    return {
      status: 'converted',
      path: relPath,
      size: buffer.length,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    return { status: 'failed', path: relPath, error: error.message };
  }
}

async function main() {
  const patterns = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PATTERNS;
  const files = await glob(patterns, {
    cwd: ROOT,
    ignore: DEFAULT_IGNORE,
    nodir: true,
    absolute: true
  });

  if (!files.length) {
    log('No matching images found for conversion.');
    return;
  }

  log(`🔍 Found ${files.length} candidate images for AVIF conversion.`);

  const results = {
    converted: 0,
    skipped: 0,
    failed: 0,
    entries: []
  };

  for (const file of files) {
    const result = await convertFile(file);
    results.entries.push(result);
    switch (result.status) {
      case 'converted':
        results.converted += 1;
        log(`✅ Converted: ${result.path}`);
        break;
      case 'skipped':
        results.skipped += 1;
        log(`⏭️  Skipped (${result.reason}): ${result.path}`);
        break;
      case 'failed':
        results.failed += 1;
        log(`❌ Failed: ${result.path} — ${result.error}`);
        break;
      default:
        break;
    }
  }

  log('\nSummary');
  log('=======' );
  log(`Converted: ${results.converted}`);
  log(`Skipped:   ${results.skipped}`);
  log(`Failed:    ${results.failed}`);

  if (results.failed) {
    log('\nFailed files:');
    results.entries
      .filter((entry) => entry.status === 'failed')
      .forEach((entry) => log(` - ${entry.path}: ${entry.error}`));
  }
}

main().catch((error) => {
  console.error('Unexpected error during conversion:', error);
  process.exitCode = 1;
});
