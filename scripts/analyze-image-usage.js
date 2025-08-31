#!/usr/bin/env node
/*
 Analyze image usage across components and pages.
 - Scans TS/TSX/JS/JSX in `components/`, `app/`, and `src/`
 - Scans CSS files for url(...) references
 - Outputs JSON report: image-usage-report.json
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function main() {
  const imageFiles = glob.sync('**/*.{png,jpg,jpeg,svg,webp,gif,avif}', {
    ignore: ['node_modules/**', '.next/**', 'coverage/**', 'dist/**']
  });

  const sourceFiles = glob.sync('{components,app,src,hooks}/**/*.{ts,tsx,js,jsx,mdx,css,scss}', {
    ignore: ['node_modules/**', '.next/**', 'coverage/**', 'dist/**']
  });

  const usage = {};
  for (const img of imageFiles) {
    usage[img] = [];
  }

  for (const file of sourceFiles) {
    const content = read(file);
    if (!content) continue;
    for (const img of imageFiles) {
      const base = path.basename(img);
      // Check for direct filename, import path, or public path usage
      if (
        content.includes(base) ||
        content.includes(img) ||
        content.includes('/' + img.replace(/^public\//, ''))
      ) {
        usage[img].push(file);
      }
    }
  }

  const report = {
    totalImages: imageFiles.length,
    usedImages: Object.values(usage).filter((arr) => arr.length > 0).length,
    unusedImages: Object.entries(usage).filter(([, arr]) => arr.length === 0).map(([k]) => k),
    multipleUsageImages: Object.entries(usage).filter(([, arr]) => arr.length > 1).map(([k, v]) => ({ path: k, refs: v.length })),
    detailed: usage,
  };
  fs.writeFileSync('image-usage-report.json', JSON.stringify(report, null, 2));
  console.log(`Report generated: ${report.usedImages}/${report.totalImages} images in use`);
}

if (require.main === module) main();

