/*
  Simple contrast checker for button foreground/background pairs using WCAG ratio formula.
  Requires node >= 14.
  Usage: `node scripts/button-contrast-check.js`
*/

const fs = require('fs');
const path = require('path');

// tiny sRGB luminance helper
function hexToRgb(hex) {
  const h = hex.replace('#','');
  return {
    r: parseInt(h.substring(0,2),16),
    g: parseInt(h.substring(2,4),16),
    b: parseInt(h.substring(4,6),16)
  };
}

function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const {r,g,b} = hexToRgb(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1, hex2) {
  const L1 = luminance(hex1);
  const L2 = luminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Load theme colors from theme/colors.js by requiring it
const theme = require('../theme/colors');

const light = theme.themes.light.colors;
const dark = theme.themes.dark.colors;

const report = {};

function checkVariant(name, spec) {
  report[name] = report[name] || {};
  ['light','dark'].forEach(mode => {
    const tokens = spec[mode];
    if (!tokens) return;
    const bgToken = tokens.bg || tokens.background || null;
    const fgToken = tokens.color || '#ffffff';

    // resolve var(--...) tokens when possible using the theme helper mapping
    function resolveToken(val, modeColors) {
      if (!val) return null;
      if (val.startsWith('var(')) {
        const m = val.match(/var\(--color-([a-z0-9-]+)\)/i);
        if (m) {
          const k = m[1];
          // special-case semantic tokens
          if (modeColors[k]) return modeColors[k];
          // fallback: try family-scale pattern like brand-500
          if (k.includes('-')) {
            const [family, step] = k.split('-');
            const v = theme.base[family] && theme.base[family][step];
            if (v) return v;
          }
        }
      }
      // if already literal hex
      if (/^#/.test(val)) return val;
      return null;
    }

    const modeColors = mode === 'light' ? light : dark;
    const bg = resolveToken(bgToken, modeColors) || bgToken;
    const fg = resolveToken(fgToken, modeColors) || fgToken;

    if (!bg || !/^#/.test(bg)) {
      report[name][mode] = { error: 'background token not resolvable', bg: bgToken, fg: fgToken };
      return;
    }

    const ratio = contrastRatio(bg, fg);
    report[name][mode] = { bg, fg, ratio: Math.round(ratio*100)/100, pass_NormalText: ratio >= 4.5, pass_LargeText: ratio >= 3 };
  });
}

const buttonSpec = require('../design-system/tokens/button-tokens.json');
const variants = buttonSpec.tokens.variants;
Object.entries(variants).forEach(([name, spec]) => checkVariant(name, spec));

fs.writeFileSync(path.join(__dirname,'..','design-system','docs','button-accessibility-report.json'), JSON.stringify(report, null, 2));
console.log('Button contrast check complete. Report written to design-system/docs/button-accessibility-report.json');
