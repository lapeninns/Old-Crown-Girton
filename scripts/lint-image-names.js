#!/usr/bin/env node
/*
 Lint image filenames against naming conventions.
 Checks files under:
   - src/assets/images/**
   - public/images/**
   - public/logos/**
 Excludes generated/_optimized/raw.
*/
const glob = require('glob');
const path = require('path');

const PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.(light|dark))?(?:\.[a-z0-9-]+)?(?:\.[a-z]{2})?(?:\.(rtl|ltr))?(?:\.(hover|active))?(?:@([123]x))?\.(avif|webp|jpe?g|png|svg)$/;

function main() {
  const strict = process.argv.includes('--strict');
  const files = [
    ...glob.sync('src/assets/images/**/*.{png,jpg,jpeg,webp,avif,svg}'),
    ...glob.sync('public/images/**/*.{png,jpg,jpeg,webp,avif,svg}'),
    ...glob.sync('public/logos/**/*.{png,jpg,jpeg,webp,avif,svg}'),
  ].filter((p) => !/\b(generated|_optimized|raw)\b/.test(p));

  const failures = [];
  for (const f of files) {
    const base = path.basename(f);
    if (!PATTERN.test(base)) failures.push(f);
  }

  if (failures.length) {
    const heading = strict ? '❌' : '⚠️';
    console.error(`${heading} Image naming violations:`);
    for (const f of failures) console.error(' -', f);
    console.error(`\nRule: ${PATTERN}`);
    if (strict) process.exit(1);
  } else {
    console.log(`✅ Image naming OK (${files.length} files checked)`);
  }
}

if (require.main === module) main();
