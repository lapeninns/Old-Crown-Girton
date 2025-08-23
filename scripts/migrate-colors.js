#!/usr/bin/env node

/**
 * Himalayan Spice Color System - Automated Migration Script
 * 
 * This script completes the standardization of color usage across the repository
 * by replacing remaining hard-coded color values with semantic design tokens.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color migration mappings
const COLOR_MIGRATIONS = {
  // Background colors
  'bg-white': 'bg-neutral-50',
  'bg-gray-50': 'bg-neutral-100',
  'bg-gray-100': 'bg-neutral-200',
  'bg-gray-200': 'bg-neutral-300',
  'bg-yellow-100': 'bg-accent-100',
  'bg-yellow-500': 'bg-accent-500',
  'bg-green-100': 'bg-cardamom-100',
  'bg-green-500': 'bg-cardamom-500',
  'bg-orange-500': 'bg-marigold-500',
  
  // Text colors
  'text-white': 'text-neutral-50',
  'text-gray-50': 'text-neutral-100',
  'text-gray-200': 'text-neutral-200',
  'text-gray-400': 'text-neutral-400',
  'text-gray-500': 'text-neutral-500',
  'text-brand-600': 'text-brand-600',
  'text-brand-600': 'text-brand-700',
  'text-gray-800': 'text-brand-800',
  'text-yellow-500': 'text-accent-500',
  'text-green-800': 'text-cardamom-800',
  'text-red-500': 'text-error-500',
  
  // Border colors
  'border-white': 'border-neutral-50',
  'border-gray-100': 'border-neutral-100',
  'border-gray-200': 'border-neutral-200',
  'border-gray-300': 'border-neutral-300',
  'border-green-200': 'border-cardamom-200',
  
  // Ring colors for focus states
  'ring-accent/50': 'ring-accent-500/50',
  'ring-accent-500': 'ring-accent-500',
  
  // Special cases with opacity
  'bg-black/60': 'bg-stout-900/70',
  'bg-white/10': 'bg-neutral-50/15',
  'border-white/15': 'border-accent-400/25',
  'border-white/20': 'border-neutral-300/30',
  'border-white/50': 'border-neutral-300',
};

// File patterns to scan
const FILE_PATTERNS = [
  'components/**/*.tsx',
  'components/**/*.jsx', 
  'app/**/*.tsx',
  'app/**/*.jsx',
];

// Files to exclude (already processed or special cases)
const EXCLUDE_FILES = [
  'error.tsx', // SVG illustrations - low priority
  'sw.js',     // Service worker - different context
  'ResponsiveDebugger.tsx', // Debug utility
];

/**
 * Get all files matching the patterns
 */
function getTargetFiles() {
  const allFiles = [];
  
  FILE_PATTERNS.forEach(pattern => {
    try {
      const files = execSync(`find . -path "./node_modules" -prune -o -name "${pattern.split('/').pop()}" -type f -print`)
        .toString()
        .split('\n')
        .filter(Boolean)
        .filter(file => !EXCLUDE_FILES.some(exclude => file.includes(exclude)));
      
      allFiles.push(...files);
    } catch (error) {
      console.warn(`Warning: Pattern ${pattern} not found`);
    }
  });
  
  return [...new Set(allFiles)]; // Remove duplicates
}

/**
 * Apply color migrations to a file
 */
function migrateFileColors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    
    // Apply each color migration
    Object.entries(COLOR_MIGRATIONS).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(`\\b${oldColor.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, newColor);
        changeCount += matches.length;
      }
    });
    
    // Write back if changes were made
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${filePath}: ${changeCount} color updates`);
      return changeCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Validate that we're not breaking any existing good patterns
 */
function validateMigrations() {
  const validations = [
    // Ensure we don't replace already-correct semantic tokens
    { pattern: 'brand-', shouldExist: true },
    { pattern: 'accent-', shouldExist: true },
    { pattern: 'neutral-', shouldExist: true },
    { pattern: 'crimson-', shouldExist: true },
    
    // Ensure we reduce hard-coded colors
    { pattern: 'text-gray-', shouldExist: false },
    { pattern: 'bg-white', shouldExist: false },
  ];
  
  const componentFiles = getTargetFiles();
  
  validations.forEach(({ pattern, shouldExist }) => {
    const matchingFiles = componentFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes(pattern);
    });
    
    if (shouldExist && matchingFiles.length === 0) {
      console.warn(`⚠️ Warning: No files contain expected pattern "${pattern}"`);
    } else if (!shouldExist && matchingFiles.length > 0) {
      console.log(`📝 Note: ${matchingFiles.length} files still contain "${pattern}"`);
    }
  });
}

/**
 * Generate a summary report
 */
function generateReport(totalChanges, filesProcessed) {
  const report = `
# Color Migration Summary

## Results
- **Files Processed**: ${filesProcessed}
- **Total Color Updates**: ${totalChanges}
- **Migration Status**: ${totalChanges > 0 ? 'SUCCESSFUL' : 'NO CHANGES NEEDED'}

## Color Mappings Applied
${Object.entries(COLOR_MIGRATIONS)
  .map(([old, new]) => `- \`${old}\` → \`${new}\``)
  .join('\n')}

## Next Steps
${totalChanges > 0 ? `
1. Run \`npm run build\` to verify no compilation errors
2. Run \`npm run lint\` to check code quality
3. Test visual appearance in development
4. Commit changes with descriptive message
` : `
✅ All colors are already properly standardized!
No further migration needed.
`}

Generated: ${new Date().toISOString()}
`;

  fs.writeFileSync('color-migration-report.md', report);
  console.log('\n📊 Report saved to: color-migration-report.md');
}

/**
 * Main migration function
 */
function main() {
  console.log('🎨 Himalayan Spice Color System - Migration Script');
  console.log('=' .repeat(50));
  
  // Get target files
  const targetFiles = getTargetFiles();
  console.log(`📁 Found ${targetFiles.length} files to process\n`);
  
  if (targetFiles.length === 0) {
    console.log('No target files found. Migration complete!');
    return;
  }
  
  // Process each file
  let totalChanges = 0;
  let filesChanged = 0;
  
  targetFiles.forEach(file => {
    const changes = migrateFileColors(file);
    totalChanges += changes;
    if (changes > 0) filesChanged++;
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 Migration Complete!`);
  console.log(`📊 Files processed: ${targetFiles.length}`);
  console.log(`✏️  Files modified: ${filesChanged}`);
  console.log(`🔄 Total changes: ${totalChanges}`);
  
  // Validate results
  console.log('\n🔍 Validating migrations...');
  validateMigrations();
  
  // Generate report
  generateReport(totalChanges, targetFiles.length);
  
  if (totalChanges > 0) {
    console.log('\n🎉 Color standardization improved!');
    console.log('💡 Run `npm run build` to verify everything works correctly.');
  } else {
    console.log('\n✅ Color system already fully standardized!');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  COLOR_MIGRATIONS,
  migrateFileColors,
  getTargetFiles,
  main
};