#!/usr/bin/env node
/*
 Generate app icons from a source logo using sharp.
 Usage: node scripts/generate-app-icons.js [--src path/to/logo.png] [--out public]
 Defaults: src tries common paths, out=public
*/
const fs = require('fs');
const path = require('path');

async function ensureSharp() {
  try {
    return require('sharp');
  } catch (e) {
    console.error('sharp is required. Install with: npm i -D sharp');
    process.exit(1);
  }
}

function findDefaultSource() {
  const candidates = [
    'public/images/brand/OldCrownLogo.png',
    'public/images/brand/Oldcrowngirtonlogo.png',
    'public/logos/OldCrownLogo.png',
    'public/images/Oldcrowngirtonlogo.png',
    'Oldcrowngirtonlogo.png',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const srcArgIdx = args.indexOf('--src');
  const outArgIdx = args.indexOf('--out');
  const src = srcArgIdx !== -1 ? args[srcArgIdx + 1] : findDefaultSource();
  const out = outArgIdx !== -1 ? args[outArgIdx + 1] : 'public';
  if (!src || !fs.existsSync(src)) {
    console.error('Source logo not found. Provide with --src path/to/logo.png');
    process.exit(1);
  }
  const sharp = await ensureSharp();

  const sizes = [16, 32, 48, 64, 72, 96, 128, 144, 152, 192, 384, 512];
  fs.mkdirSync(out, { recursive: true });

  for (const size of sizes) {
    const dest = path.join(out, `icon-${size}.png`);
    await sharp(src).resize(size, size).png({ compressionLevel: 9 }).toFile(dest);
    console.log('Wrote', dest);
  }
  // Apple recommended 180x180
  const appleDest = path.join(out, 'apple-icon.png');
  await sharp(src).resize(180, 180).png({ compressionLevel: 9 }).toFile(appleDest);
  console.log('Wrote', appleDest);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
