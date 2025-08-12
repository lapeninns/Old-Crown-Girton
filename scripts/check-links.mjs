#!/usr/bin/env node
// Simple internal link crawler + validator for Next.js dev server
// Usage: node scripts/check-links.mjs http://localhost:3001

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const ORIGIN = new URL(BASE).origin;
const MAX_PAGES = Number(process.env.MAX_PAGES || 300);
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Extract hrefs with a robust-but-lightweight regex */
function extractHrefs(html) {
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function normalizeUrl(href, from) {
  try {
    if (!href || href.trim() === '' || href === '#' || href.startsWith('javascript:')) return null;
    if (/^(mailto:|tel:|sms:|whatsapp:)/i.test(href)) return { type: 'proto', url: href };
    const abs = href.startsWith('http') ? new URL(href) : new URL(href, from);
    if (abs.origin === ORIGIN) return { type: 'internal', url: abs.href.replace(/#.*$/, '') };
    return { type: 'external', url: abs.href };
  } catch {
    return { type: 'invalid', url: href };
  }
}

const visitedPages = new Set();
const queued = new Set();
const toVisit = [BASE + '/'];
const badLinks = [];
const scannedLinks = new Set();

async function fetchWithStatus(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, ok: res.ok, html: res.headers.get('content-type')?.includes('text/html') ? await res.text() : '' };
}

async function worker(id) {
  while (toVisit.length) {
    const page = toVisit.shift();
    if (!page || visitedPages.has(page)) continue;
    visitedPages.add(page);
    try {
      const { status, ok, html } = await fetchWithStatus(page);
      if (!ok) badLinks.push({ from: page, href: page, url: page, status, context: 'page' });
      if (ok && html) {
        const hrefs = extractHrefs(html);
        for (const href of hrefs) {
          const n = normalizeUrl(href, page);
          if (!n) {
            badLinks.push({ from: page, href, url: href, status: 'EMPTY', context: 'href' });
            continue;
          }
          if (n.type === 'invalid') {
            badLinks.push({ from: page, href, url: href, status: 'INVALID', context: 'href' });
            continue;
          }
          if (scannedLinks.has(`${page}->${n.url}`)) continue;
          scannedLinks.add(`${page}->${n.url}`);
          if (n.type === 'internal') {
            // Queue internal page for crawl (BFS)
            if (!queued.has(n.url) && visitedPages.size + queued.size < MAX_PAGES) {
              toVisit.push(n.url);
              queued.add(n.url);
            }
            // Also verify it responds OK
            try {
              const { ok: ok2, status: s2 } = await fetchWithStatus(n.url);
              if (!ok2) badLinks.push({ from: page, href, url: n.url, status: s2, context: 'internal' });
            } catch (e) {
              badLinks.push({ from: page, href, url: n.url, status: 'ERR', error: String(e) });
            }
          }
          // For external links, we only check emptiness/format; avoid hammering 3rd parties.
        }
      }
    } catch (e) {
      badLinks.push({ from: page, href: page, url: page, status: 'ERR', error: String(e) });
    }
    // small delay to be nice
    await sleep(10);
  }
}

(async function main() {
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  const report = {
    base: BASE,
    pagesScanned: visitedPages.size,
    issues: badLinks,
  };
  console.log(`\nLink Report for ${BASE}`);
  console.log(`Pages scanned: ${visitedPages.size}`);
  if (badLinks.length === 0) {
    console.log('No broken or empty links found.');
  } else {
    console.log(`Problems: ${badLinks.length}`);
    const sample = badLinks.slice(0, 20);
    for (const b of sample) console.log('-', b.status, 'on', b.from, '=>', b.url);
    if (badLinks.length > sample.length) console.log(`... ${badLinks.length - sample.length} more`);
  }
  // write file
  const fs = await import('fs');
  fs.writeFileSync('link-report.json', JSON.stringify(report, null, 2));
})();
