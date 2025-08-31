#!/usr/bin/env node
/*
 Identify unused images and optionally move them to backup.
 Usage: node scripts/cleanup-unused-images.js [--move]
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const shouldMove = process.argv.includes('--move');

function main() {
  const images = glob.sync('src/assets/images/**/*.{png,jpg,jpeg,svg,webp,gif,avif}');
  const publicImages = glob.sync('public/**/*.{png,jpg,jpeg,svg,webp,gif,avif}');
  const all = [...images, ...publicImages];
  const sources = glob.sync('{components,app,src}/**/*.{ts,tsx,js,jsx,mdx,css,scss}');

  const used = new Set();
  for (const f of sources) {
    const content = fs.readFileSync(f, 'utf8');
    for (const img of all) {
      const base = path.basename(img);
      if (content.includes(base) || content.includes(img) || content.includes('/' + img.replace(/^public\//, ''))) {
        used.add(img);
      }
    }
  }

  const unused = all.filter((img) => !used.has(img));
  let space = 0;
  for (const img of unused) {
    try { space += fs.statSync(img).size; } catch {}
  }

  const report = { totalImages: all.length, unusedCount: unused.length, spaceBytes: space, spaceMB: +(space / 1024 / 1024).toFixed(2), unused };
  fs.writeFileSync('unused-images-report.json', JSON.stringify(report, null, 2));
  console.log(`Unused images: ${report.unusedCount}, potential savings: ${report.spaceMB} MB`);

  if (shouldMove && unused.length) {
    const backupDir = 'src/assets/images/_unused_backup';
    fs.mkdirSync(backupDir, { recursive: true });
    for (const img of unused) {
      try {
        const dest = path.join(backupDir, path.basename(img));
        fs.renameSync(img, dest);
        console.log(`Moved ${img} -> ${dest}`);
      } catch (e) {
        console.warn(`Failed to move ${img}:`, e.message);
      }
    }
  }
}

if (require.main === module) main();

