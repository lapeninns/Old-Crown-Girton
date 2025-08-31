#!/usr/bin/env node
/*
 Verify that used image paths resolve to files and optionally return HTTP 200.
 - Reads src/lib/images.ts and extracts '/images/...' paths.
 - Optionally also tests logo paths in nav components.
 - If VERIFY_BASE_URL env is set (e.g., http://localhost:3000), performs HTTP HEAD checks.
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractPathsFromFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const regex = /['\"](\/images\/[A-Za-z0-9_\-\/\.]+)['\"]/g;
  const set = new Set();
  let m;
  while ((m = regex.exec(text))) set.add(m[1]);
  return Array.from(set);
}

function toPublicPath(p) {
  return path.join(process.cwd(), 'public', p);
}

async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

async function main() {
  const files = [
    path.join(process.cwd(), 'src', 'lib', 'images.ts'),
    path.join(process.cwd(), 'components', 'seo', 'RestaurantSchema.tsx'),
    path.join(process.cwd(), 'components', 'restaurant', 'Navbar.tsx'),
  ].filter(fs.existsSync);

  const pathsSet = new Set();
  for (const f of files) extractPathsFromFile(f).forEach((p) => pathsSet.add(p));
  const pathsArr = Array.from(pathsSet).sort();

  const missing = [];
  const present = [];
  for (const p of pathsArr) {
    const pub = toPublicPath(p);
    if (fs.existsSync(pub)) present.push(p); else missing.push(p);
  }

  console.log(`Found ${pathsArr.length} unique image paths. Present: ${present.length}, Missing: ${missing.length}`);
  if (missing.length) {
    console.log('Missing files:');
    missing.forEach((m) => console.log(' -', m));
  }

  const base = process.env.VERIFY_BASE_URL;
  if (base) {
    console.log(`\nHTTP HEAD verification against ${base}`);
    for (const p of present) {
      const url = new URL(p, base).toString();
      const res = await head(url);
      if (!res.ok) {
        console.log(`❌ ${p} -> ${res.status} ${res.error || ''}`);
      } else {
        console.log(`✅ ${p} -> ${res.status} ${res.contentType || ''}`);
      }
    }
  }
}

// Execute when run directly
// Node <18 lacks global fetch; attempt to polyfill from undici if available
(async () => {
  if (typeof fetch === 'undefined') {
    try {
      const { fetch: undiciFetch } = await import('undici');
      global.fetch = undiciFetch;
    } catch {}
  }
  await main().catch((e) => { console.error(e); process.exit(1); });
})();
