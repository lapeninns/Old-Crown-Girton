#!/usr/bin/env node
/*
 Build reverse index: image -> referencing files
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function main() {
  const imageFiles = glob.sync('src/assets/images/**/*.{png,jpg,jpeg,svg,webp,gif,avif}');
  const publicImages = glob.sync('public/**/*.{png,jpg,jpeg,svg,webp,gif,avif}');
  const allImages = [...imageFiles, ...publicImages];
  const codeFiles = glob.sync('{components,app,src}/**/*.{ts,tsx,js,jsx,mdx,css,scss}');

  const detailed = {};
  for (const img of allImages) {
    detailed[img] = [];
  }
  for (const file of codeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const img of allImages) {
      const base = path.basename(img);
      if (content.includes(base) || content.includes(img) || content.includes('/' + img.replace(/^public\//, ''))) {
        detailed[img].push(file);
      }
    }
  }

  const report = {
    totalImages: allImages.length,
    usedImages: Object.values(detailed).filter((arr) => arr.length > 0).length,
    unusedImagesList: Object.entries(detailed).filter(([, arr]) => arr.length === 0).map(([k]) => k),
    detailed,
  };
  fs.writeFileSync('image-usage-reverse-index.json', JSON.stringify(report, null, 2));
  console.log(`Reverse index created. Used: ${report.usedImages}/${report.totalImages}`);
}

if (require.main === module) main();

