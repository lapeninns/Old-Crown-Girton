#!/usr/bin/env node

/**
 * Precise Color Cleanup Analysis
 * 
 * This script identifies exactly which color tokens are used vs defined
 * and provides specific recommendations for cleanup.
 */

const { execSync } = require('child_process');

// Extract colors used in the codebase
function getUsedColors() {
  try {
    const result = execSync(`
      grep -r --include="*.tsx" --include="*.ts" --include="*.css" -o -E "(bg-|text-|border-|ring-|from-|to-|via-)(brand|accent|neutral|stout|cardamom|crimson|chakra|indiagreen|marigold|masala|brass|amberbeer|secondary|error|warning|info|success)-[0-9]+" . | 
      sed 's/.*://' | 
      sed 's/^[a-z]*-//' |
      sort | 
      uniq
    `, { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting used colors:', error.message);
    return [];
  }
}

// Extract colors defined in globals.css
function getDefinedColors() {
  try {
    const result = execSync(`
      grep -o -E "\\-\\-color-[a-zA-Z]+-[0-9]+" app/globals.css | 
      sed 's/--color-//' | 
      sort | 
      uniq
    `, { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting defined colors:', error.message);
    return [];
  }
}

// Group colors by family
function groupByFamily(colors) {
  const groups = {};
  colors.forEach(color => {
    const family = color.split('-')[0];
    if (!groups[family]) groups[family] = [];
    groups[family].push(color);
  });
  return groups;
}

// Main analysis
function analyze() {
  console.log('🔍 Analyzing actual color usage in Restaurant_BP...\n');
  
  const usedColors = getUsedColors();
  const definedColors = getDefinedColors();
  
  const unusedColors = definedColors.filter(color => !usedColors.includes(color));
  
  console.log('📊 COLOR USAGE ANALYSIS');
  console.log('='.repeat(50));
  console.log(`✅ Colors Actually Used: ${usedColors.length}`);
  console.log(`📝 Colors Defined: ${definedColors.length}`);
  console.log(`❌ Colors Unused: ${unusedColors.length}`);
  console.log(`💾 Cleanup Potential: ${((unusedColors.length / definedColors.length) * 100).toFixed(1)}%\n`);
  
  // Show used colors by family
  console.log('✅ USED COLORS BY FAMILY');
  console.log('-'.repeat(30));
  const usedByFamily = groupByFamily(usedColors);
  Object.entries(usedByFamily).forEach(([family, colors]) => {
    console.log(`${family} (${colors.length}): ${colors.sort().join(', ')}`);
  });
  
  console.log('\n❌ UNUSED COLORS BY FAMILY');
  console.log('-'.repeat(30));
  const unusedByFamily = groupByFamily(unusedColors);
  Object.entries(unusedByFamily).forEach(([family, colors]) => {
    console.log(`${family} (${colors.length}): ${colors.sort().join(', ')}`);
  });
  
  // System colors to keep even if unused
  const systemColors = unusedColors.filter(color => 
    color.includes('error-') || 
    color.includes('warning-') || 
    color.includes('info-') || 
    color.includes('success-')
  );
  
  const safeToRemove = unusedColors.filter(color => !systemColors.includes(color));
  
  console.log('\n🗑️ SAFE TO REMOVE');
  console.log('-'.repeat(30));
  const safeByFamily = groupByFamily(safeToRemove);
  Object.entries(safeByFamily).forEach(([family, colors]) => {
    console.log(`${family} (${colors.length}): ${colors.sort().join(', ')}`);
  });
  
  console.log('\n🛡️ KEEP FOR SYSTEM');
  console.log('-'.repeat(30));
  const systemByFamily = groupByFamily(systemColors);
  Object.entries(systemByFamily).forEach(([family, colors]) => {
    console.log(`${family} (${colors.length}): ${colors.sort().join(', ')}`);
  });
  
  console.log('\n📋 SUMMARY');
  console.log('-'.repeat(30));
  console.log(`Total colors to remove: ${safeToRemove.length}`);
  console.log(`Total colors to keep: ${usedColors.length + systemColors.length}`);
  console.log(`Space saving: ${((safeToRemove.length / definedColors.length) * 100).toFixed(1)}%`);
  
  return {
    usedColors,
    definedColors,
    unusedColors,
    safeToRemove,
    systemColors
  };
}

// Generate removal commands
function generateRemovalCommands(safeToRemove) {
  console.log('\n🛠️ REMOVAL COMMANDS');
  console.log('-'.repeat(30));
  console.log('To remove unused colors, run these commands:\n');
  
  // Group safe-to-remove by family for easier removal
  const byFamily = groupByFamily(safeToRemove);
  
  Object.entries(byFamily).forEach(([family, colors]) => {
    const pattern = colors.map(color => `--color-${color}`).join('|');
    console.log(`# Remove unused ${family} colors`);
    console.log(`sed -i '' -E 's/--color-(${colors.join('|')})[^;]*;//g' app/globals.css`);
    console.log(`sed -i '' -E 's/--color-(${colors.join('|')})[^;]*;//g' theme/colors.js`);
    console.log('');
  });
}

if (require.main === module) {
  const result = analyze();
  generateRemovalCommands(result.safeToRemove);
}

module.exports = { analyze };