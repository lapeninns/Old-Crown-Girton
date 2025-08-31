#!/usr/bin/env node
/*
 Generate responsive AVIF variants and blur placeholders for raster images.
 Usage:
   node scripts/generate-responsive.js [baseDir]
 Defaults:
   baseDir = 'src/assets/images'
 Outputs:
   - ${baseDir}/generated/responsive/<path>/<name>-<w>.avif
   - ${baseDir}/generated/blur/<path>/<name>.txt (base64 data URI)
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function ensureSharp() {
  try { return require('sharp'); } catch (e) { console.error('sharp is required. Install with: npm i -D sharp'); process.exit(1); }
}

const widths = [320, 480, 768, 1024, 1280, 1440, 1920, 2560];

async function main() {
  const sharp = await ensureSharp();
  const baseDir = process.argv[2] || 'src/assets/images';
  const outResponsive = path.join(baseDir, 'generated', 'responsive');
  const outBlur = path.join(baseDir, 'generated', 'blur');
  fs.mkdirSync(outResponsive, { recursive: true });
  fs.mkdirSync(outBlur, { recursive: true });

  const files = glob.sync(`${baseDir}/**/*.{jpg,jpeg,png}`, { ignore: [`${baseDir}/generated/**`, `${baseDir}/_optimized/**`] });
  let created = 0;
  for (const file of files) {
    const rel = path.relative(baseDir, file);
    const baseName = path.basename(rel).replace(/\.(jpe?g|png)$/i, '');
    const dir = path.dirname(rel);

    // Responsive variants
    for (const w of widths) {
      const outDir = path.join(outResponsive, dir);
      const outPath = path.join(outDir, `${baseName}-${w}.avif`);
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outDir, { recursive: true });
        await sharp(file)
          .resize({ width: w })
          .avif({ quality: 50 })
          .toFile(outPath);
        created++;
      }
    }

    // Blur placeholder (base64 JPEG @ 24px width)
    const blurDir = path.join(outBlur, dir);
    const blurPath = path.join(blurDir, `${baseName}.txt`);
    if (!fs.existsSync(blurPath)) {
      fs.mkdirSync(blurDir, { recursive: true });
      const buf = await sharp(file).resize({ width: 24 }).jpeg({ quality: 40 }).toBuffer();
      fs.writeFileSync(blurPath, `data:image/jpeg;base64,${buf.toString('base64')}`);
      created++;
    }
  }
  console.log(`Generated ${created} outputs under ${path.join(baseDir, 'generated')}`);
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

