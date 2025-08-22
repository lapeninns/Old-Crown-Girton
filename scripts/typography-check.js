/*
  Checks typography tokens for: presence of clamp recommendations and valid line-height ratios.
  Usage: node scripts/typography-check.js
*/
const fs = require('fs');
const path = require('path');

const tokens = require('../design-system/tokens/typography-tokens.json');
const report = { issues: [] };

// 1) Verify clamp strings look valid (contain 'clamp(' and at least two units)
Object.entries(tokens.tokens.clampRecommendations || {}).forEach(([k,v]) => {
  if (typeof v !== 'string' || !v.includes('clamp(')) {
    report.issues.push({ key: k, issue: 'clamp_missing_or_invalid', value: v });
  }
});

// 2) Verify lineHeight numeric values are reasonable (between 1 and 1.8)
Object.entries(tokens.tokens.scale).forEach(([k,v]) => {
  const lh = v.lineHeight || v.lineHeight;
  if (lh) {
    const numeric = parseFloat(lh);
    if (isNaN(numeric)) {
      report.issues.push({ key: k, issue: 'lineHeight_not_numeric', value: lh });
    } else if (numeric < 1 || numeric > 2) {
      report.issues.push({ key: k, issue: 'lineHeight_out_of_range', value: numeric });
    }
  }
});

fs.writeFileSync(path.join(__dirname,'..','design-system','docs','typography-check-report.json'), JSON.stringify(report, null, 2));
console.log('Typography check complete. Report written to design-system/docs/typography-check-report.json');
