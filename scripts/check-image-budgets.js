#!/usr/bin/env node
/*
 Enforce image budgets.
 Defaults:
   --hero-max-kb=200
   --page-max-kb=700
   --file-max-kb=800
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getArg(name, def) {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? Number(m.split('=')[1]) : def;
}

function sizeKB(file) {
  try { return Math.round(fs.statSync(file).size / 1024); } catch { return 0; }
}

function sumSizes(files) { return files.reduce((a, f) => a + sizeKB(f), 0); }

function main() {
  const heroMax = getArg('hero-max-kb', 200);
  const pageMax = getArg('page-max-kb', 700);
  const fileMax = getArg('file-max-kb', 800);

  const violations = [];

  // Per-file limit
  const allImages = glob.sync('src/assets/images/**/*.{png,jpg,jpeg,webp,avif}', { ignore: ['**/generated/**', '**/_optimized/**'] });
  for (const img of allImages) {
    const kb = sizeKB(img);
    if (kb > fileMax) violations.push({ type: 'file', path: img, kb, limit: fileMax });
  }

  // Hero budget
  const heroFiles = glob.sync('src/assets/images/components/Hero/**/*.{png,jpg,jpeg,webp,avif}');
  if (heroFiles.length) {
    const maxHero = Math.max(...heroFiles.map(sizeKB));
    if (maxHero > heroMax) violations.push({ type: 'hero', path: 'components/Hero', kb: maxHero, limit: heroMax });
  }

  // Per-page budgets under pages/<route>
  const pagesRoot = 'src/assets/images/pages';
  if (fs.existsSync(pagesRoot)) {
    const pageDirs = fs.readdirSync(pagesRoot).map((d) => path.join(pagesRoot, d)).filter((p) => fs.statSync(p).isDirectory());
    for (const dir of pageDirs) {
      const imgs = glob.sync(`${dir}/**/*.{png,jpg,jpeg,webp,avif}`, { ignore: ['**/generated/**', '**/_optimized/**'] });
      const total = sumSizes(imgs);
      if (total > pageMax) violations.push({ type: 'page', path: dir, kb: total, limit: pageMax });
    }
  }

  if (violations.length) {
    console.error('❌ Image budget violations:');
    for (const v of violations) console.error(` - [${v.type}] ${v.path}: ${v.kb} KB > ${v.limit} KB`);
    process.exit(1);
  } else {
    console.log('✅ Image budgets OK');
  }
}

if (require.main === module) main();

