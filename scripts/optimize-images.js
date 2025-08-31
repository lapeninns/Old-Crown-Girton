#!/usr/bin/env node
/*
 Optimize images using sharp (raster) and svgo (svg).
 - Creates WebP copies for JPG/PNG.
 - Writes optimized assets into public/_optimized and src/assets/images/_optimized mirrors.
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function ensureSharp() {
  try { return require('sharp'); } catch (e) { console.error('sharp is required. npm i -D sharp'); process.exit(1); }
}

async function ensureSvgo() {
  try { return require('svgo'); } catch (e) { console.error('svgo is required. npm i -D svgo'); process.exit(1); }
}

function mirrorOut(inPath, base, outBase) {
  const rel = path.relative(base, inPath);
  return path.join(outBase, rel);
}

async function processRaster(sharp, input, outBase, base) {
  const outPath = mirrorOut(input, base, outBase);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  // Convert to webp
  const webpPath = outPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  await sharp(input).webp({ quality: 85 }).toFile(webpPath);
  return [webpPath];
}

async function processSvg(svgo, input, outBase, base) {
  const outPath = mirrorOut(input, base, outBase);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const data = fs.readFileSync(input, 'utf8');
  const { optimize } = svgo;
  const result = optimize(data, {
    path: input,
    multipass: true,
    plugins: [
      { name: 'removeViewBox', active: false },
      { name: 'removeDimensions', active: true },
      { name: 'cleanupIDs', active: true },
    ],
  });
  fs.writeFileSync(outPath, result.data);
  return [outPath];
}

async function main() {
  const sharp = await ensureSharp();
  const svgo = await ensureSvgo();

  const sets = [
    { base: 'public/images', out: 'public/_optimized/images' },
    { base: 'src/assets/images', out: 'src/assets/images/_optimized' },
  ];

  for (const { base, out } of sets) {
    if (!fs.existsSync(base)) continue;
    const files = glob.sync(`${base}/**/*.{png,jpg,jpeg,svg}`, { ignore: ['**/_optimized/**'] });
    let count = 0;
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (ext === '.svg') {
        await processSvg(svgo, f, out, base);
      } else {
        await processRaster(sharp, f, out, base);
      }
      count++;
    }
    console.log(`Optimized ${count} assets from ${base} -> ${out}`);
  }
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

