#!/usr/bin/env node
/*
 Create component image structure for known components.
 Usage: node scripts/create-component-image-structure.js [ComponentName[:sub1,sub2,...]] [...]
 If no args provided, seeds a few common components.
*/
const fs = require('fs');
const path = require('path');

const seed = {
  Header: ['logo', 'navigation', 'backgrounds'],
  Hero: ['backgrounds', 'overlays'],
  Slideshow: ['slides', 'indicators', 'arrows'],
  Footer: ['social-icons', 'backgrounds'],
};

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }

function makeFor(component, folders) {
  const base = path.join('src/assets/images/components', component);
  mkdirp(base);
  for (const f of folders) mkdirp(path.join(base, f));
}

function parseArg(arg) {
  // Component:sub1,sub2
  const [comp, subs] = arg.split(':');
  const list = subs ? subs.split(',').filter(Boolean) : ['misc'];
  return { comp, list };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    Object.entries(seed).forEach(([c, f]) => makeFor(c, f));
    console.log('Seed structure created under src/assets/images/components');
  } else {
    for (const a of args) {
      const { comp, list } = parseArg(a);
      makeFor(comp, list);
      console.log(`Created ${comp}: [${list.join(', ')}]`);
    }
  }
}

if (require.main === module) main();

