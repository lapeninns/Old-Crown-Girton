#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');
if (!SITE_URL) {
  console.error('Please set SITE_URL environment variable, e.g. SITE_URL="https://example.com" node scripts/sanitize-sitemap.js');
  process.exit(1);
}

const publicDir = path.resolve(process.cwd(), 'public');
const sitemapFiles = fs.readdirSync(publicDir).filter(f => /^sitemap.*\.xml$/.test(f));
if (!sitemapFiles.length) {
  console.log('No sitemap files found in public/ to sanitize.');
  process.exit(0);
}

const excludePatterns = [
  /\/api\//,
  /\.well-known\//,
  /apple-icon\.png$/,
  /favicon\.ico$/,
  /sitemap(?:-index)?\.xml$/,
  /sitemap-.*\.xml$/,
  /google.*siteverification/i,
];

for (const file of sitemapFiles) {
  const p = path.join(publicDir, file);
  let txt = fs.readFileSync(p, 'utf8');

  // Replace localhost references
  txt = txt.replace(/https?:\/\/localhost:3000/g, SITE_URL);

  // Remove any <url>...</url> blocks that match exclude patterns
  txt = txt.replace(/<url>[\s\S]*?<\/url>/g, (match) => {
    for (const rx of excludePatterns) {
      if (rx.test(match)) return '';
    }
    return match;
  });

  // Clean repeated empty lines
  txt = txt.replace(/\n{2,}/g, '\n');

  fs.writeFileSync(p, txt, 'utf8');
  console.log('Sanitized', file);
}

// Regenerate a simple sitemap index pointing to remaining sitemaps
const remaining = sitemapFiles.filter(f => {
  const p = path.join(publicDir, f);
  const content = fs.readFileSync(p, 'utf8');
  return /<url>/.test(content);
});

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${remaining.map(f=>`  <sitemap><loc>${SITE_URL}/${f}</loc></sitemap>`).join('\n')}\n</sitemapindex>`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');
console.log('Wrote sitemap.xml with', remaining.length, 'entries');
