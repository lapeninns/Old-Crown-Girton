#!/usr/bin/env node

/**
 * Color Usage Analysis Script
 * 
 * This script analyzes the codebase to identify which color tokens are actually being used
 * and generates a report of unused colors that can be safely removed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// File patterns to search
const FILE_PATTERNS = [
  'app/**/*.{tsx,ts,css}',
  'components/**/*.{tsx,ts,css}',
  'src/**/*.{tsx,ts,css}',
  'lib/**/*.{tsx,ts,css}',
  'hooks/**/*.{tsx,ts,css}',
  'styles/**/*.css',
  'design-system/**/*.{tsx,ts,css}',
  'tailwind.config.js'
];

// Color token patterns to look for
const COLOR_PATTERNS = {
  // Tailwind class patterns
  tailwind: /(?:bg-|text-|border-|ring-|from-|to-|via-|fill-|stroke-)([a-zA-Z]+-(?:\d+|[a-zA-Z]+))/g,
  
  // CSS custom property patterns
  cssVars: /var\(--color-([a-zA-Z]+-(?:\d+|[a-zA-Z]+))\)/g,
  
  // Direct CSS custom property definitions
  cssDefs: /--color-([a-zA-Z]+-(?:\d+|[a-zA-Z]+)):/g
};

/**
 * Get all files to analyze
 */
function getTargetFiles() {
  const files = [];
  
  FILE_PATTERNS.forEach(pattern => {
    try {
      // Use find command to get files matching pattern
      const result = execSync(`find . -name "node_modules" -prune -o -name ".git" -prune -o -type f \\( -name "*.tsx" -o -name "*.ts" -o -name "*.css" -o -name "*.js" \\) -print`, { encoding: 'utf8' });
      files.push(...result.split('\n').filter(Boolean));
    } catch (error) {
      console.warn(`Warning: Could not process pattern ${pattern}`);
    }
  });
  
  return [...new Set(files)]; // Remove duplicates
}

/**
 * Extract all color tokens used in the codebase
 */
function extractUsedColors() {
  const usedColors = new Set();
  const files = getTargetFiles();
  
  console.log(`📂 Analyzing ${files.length} files...`);
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Find Tailwind classes
      let match;
      while ((match = COLOR_PATTERNS.tailwind.exec(content)) !== null) {
        usedColors.add(match[1]);
      }
      
      // Find CSS custom properties
      COLOR_PATTERNS.tailwind.lastIndex = 0;
      while ((match = COLOR_PATTERNS.cssVars.exec(content)) !== null) {
        usedColors.add(match[1]);
      }
      
      // Find CSS definitions
      COLOR_PATTERNS.cssVars.lastIndex = 0;
      while ((match = COLOR_PATTERNS.cssDefs.exec(content)) !== null) {
        usedColors.add(match[1]);
      }
      
    } catch (error) {
      console.warn(`⚠️ Could not read file: ${file}`);
    }
  });
  
  return Array.from(usedColors).sort();
}

/**
 * Extract all defined colors from theme files
 */
function extractDefinedColors() {
  const definedColors = new Set();
  
  // Extract from app/globals.css
  try {
    const globalsContent = fs.readFileSync('./app/globals.css', 'utf8');
    let match;
    while ((match = COLOR_PATTERNS.cssDefs.exec(globalsContent)) !== null) {
      definedColors.add(match[1]);
    }
  } catch (error) {
    console.warn('⚠️ Could not read app/globals.css');
  }
  
  // Extract from theme/colors.js
  try {
    const colorsContent = fs.readFileSync('./theme/colors.js', 'utf8');
    // Extract color names from the structure
    const colorMatch = colorsContent.match(/(\w+):\s*{[^}]*\d+:\s*'[^']*'/g);
    if (colorMatch) {
      colorMatch.forEach(match => {
        const colorName = match.match(/(\w+):/)[1];
        // Add all scales for this color
        for (let i = 50; i <= 950; i += 50) {
          definedColors.add(`${colorName}-${i}`);
        }
        for (let i = 25; i <= 975; i += 25) {
          if (i % 50 !== 0) definedColors.add(`${colorName}-${i}`);
        }
      });
    }
  } catch (error) {
    console.warn('⚠️ Could not read theme/colors.js');
  }
  
  // Extract from tailwind.config.js
  try {
    const tailwindContent = fs.readFileSync('./tailwind.config.js', 'utf8');
    const colorMatches = tailwindContent.match(/(\w+):\s*{[^}]*\d+:/g);
    if (colorMatches) {
      colorMatches.forEach(match => {
        const colorName = match.match(/(\w+):/)[1];
        for (let i = 50; i <= 950; i += 50) {
          definedColors.add(`${colorName}-${i}`);
        }
      });
    }
  } catch (error) {
    console.warn('⚠️ Could not read tailwind.config.js');
  }
  
  return Array.from(definedColors).sort();
}

/**
 * Analyze color usage and generate report
 */
function analyzeColorUsage() {
  console.log('🔍 Starting color usage analysis...\n');
  
  const usedColors = extractUsedColors();
  const definedColors = extractDefinedColors();
  
  const unusedColors = definedColors.filter(color => !usedColors.includes(color));
  const undefinedColors = usedColors.filter(color => !definedColors.includes(color));
  
  // Group colors by family
  const groupedUsed = groupColorsByFamily(usedColors);
  const groupedUnused = groupColorsByFamily(unusedColors);
  
  console.log('📊 COLOR USAGE ANALYSIS REPORT');
  console.log('='.repeat(50));
  console.log(`📈 Total Colors Defined: ${definedColors.length}`);
  console.log(`✅ Total Colors Used: ${usedColors.length}`);
  console.log(`❌ Total Colors Unused: ${unusedColors.length}`);
  console.log(`⚠️ Total Undefined Colors Referenced: ${undefinedColors.length}`);
  console.log(`💾 Space Savings Potential: ${((unusedColors.length / definedColors.length) * 100).toFixed(1)}%\n`);
  
  // Show used colors by family
  console.log('✅ USED COLORS BY FAMILY');
  console.log('-'.repeat(30));
  Object.entries(groupedUsed).forEach(([family, colors]) => {
    console.log(`${family}: ${colors.length} colors`);
    console.log(`  ${colors.join(', ')}`);
  });
  
  console.log('\n❌ UNUSED COLORS BY FAMILY');
  console.log('-'.repeat(30));
  Object.entries(groupedUnused).forEach(([family, colors]) => {
    console.log(`${family}: ${colors.length} colors`);
    console.log(`  ${colors.join(', ')}`);
  });
  
  if (undefinedColors.length > 0) {
    console.log('\n⚠️ UNDEFINED COLORS REFERENCED');
    console.log('-'.repeat(30));
    undefinedColors.forEach(color => console.log(`  ${color}`));
  }
  
  // Generate detailed removal recommendations
  console.log('\n🗑️ REMOVAL RECOMMENDATIONS');
  console.log('-'.repeat(30));
  
  const safeToRemove = [];
  const keepForSystem = [];
  
  unusedColors.forEach(color => {
    // Keep system colors even if unused (error, warning, info, success)
    if (color.includes('error-') || color.includes('warning-') || color.includes('info-') || color.includes('success-')) {
      keepForSystem.push(color);
    } else {
      safeToRemove.push(color);
    }
  });
  
  console.log(`Safe to Remove (${safeToRemove.length} colors):`);
  Object.entries(groupColorsByFamily(safeToRemove)).forEach(([family, colors]) => {
    console.log(`  ${family}: ${colors.join(', ')}`);
  });
  
  console.log(`\nKeep for System (${keepForSystem.length} colors):`);
  Object.entries(groupColorsByFamily(keepForSystem)).forEach(([family, colors]) => {
    console.log(`  ${family}: ${colors.join(', ')}`);
  });
  
  // Save detailed report
  const report = generateDetailedReport(usedColors, unusedColors, undefinedColors, safeToRemove, keepForSystem);
  fs.writeFileSync('./color-usage-analysis.json', JSON.stringify(report, null, 2));
  
  console.log('\n📄 Detailed report saved to: color-usage-analysis.json');
  
  return report;
}

/**
 * Group colors by their family (brand, accent, neutral, etc.)
 */
function groupColorsByFamily(colors) {
  const grouped = {};
  
  colors.forEach(color => {
    const family = color.split('-')[0];
    if (!grouped[family]) {
      grouped[family] = [];
    }
    grouped[family].push(color);
  });
  
  return grouped;
}

/**
 * Generate detailed JSON report
 */
function generateDetailedReport(used, unused, undefined, safeToRemove, keepForSystem) {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalDefined: used.length + unused.length,
      totalUsed: used.length,
      totalUnused: unused.length,
      totalUndefined: undefined.length,
      spaceSavingsPercent: ((unused.length / (used.length + unused.length)) * 100).toFixed(1)
    },
    usedColors: groupColorsByFamily(used),
    unusedColors: groupColorsByFamily(unused),
    undefinedColors: undefined,
    recommendations: {
      safeToRemove: groupColorsByFamily(safeToRemove),
      keepForSystem: groupColorsByFamily(keepForSystem)
    }
  };
}

// Run the analysis
if (require.main === module) {
  analyzeColorUsage();
}

module.exports = { analyzeColorUsage, extractUsedColors, extractDefinedColors };