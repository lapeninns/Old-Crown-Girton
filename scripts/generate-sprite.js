#!/usr/bin/env node
/*
 Build an SVG sprite from a directory of individual SVGs.
 Usage:
   node scripts/generate-sprite.js [inDir] [outFile]
 Defaults:
   inDir  = 'src/assets/images/shared/icons'
   outFile= 'src/assets/images/generated/sprites/icons.svg'
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function ensureSvgo() {
  try { return require('svgo'); } catch (e) { console.error('svgo is required. Install with: npm i -D svgo'); process.exit(1); }
}

function extractViewBox(svg) {
  const m = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
  return m ? m[1] : '0 0 24 24';
}

function extractInner(svg) {
  const start = svg.indexOf('>');
  const end = svg.lastIndexOf('</svg>');
  if (start === -1 || end === -1) return svg;
  return svg.slice(start + 1, end).trim();
}

async function main() {
  const { optimize } = await ensureSvgo();
  const inDir = process.argv[2] || 'src/assets/images/shared/icons';
  const outFile = process.argv[3] || 'src/assets/images/generated/sprites/icons.svg';

  const files = glob.sync(path.join(inDir, '**/*.svg'));
  if (!files.length) {
    console.warn(`No SVGs found in ${inDir}`);
  }

  const symbols = files.map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    const viewBox = extractViewBox(raw);
    const inner = extractInner(raw);
    const id = path.basename(file, '.svg');
    return `<symbol id="${id}" viewBox="${viewBox}">${inner}</symbol>`;
  });

  const sprite = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>\n`;
  const optimized = optimize(sprite, { multipass: true, plugins: [{ name: 'removeDimensions', active: true }] });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, optimized.data, 'utf8');
  console.log(`Sprite written: ${outFile} (${files.length} icons)`);
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

