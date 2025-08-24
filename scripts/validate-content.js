const fs = require('fs');
const path = require('path');

// Simple validation without importing the full Zod schema
function validateContent() {
  try {
    const contentPath = path.join(__dirname, '../config/content.json');
    
    if (!fs.existsSync(contentPath)) {
      console.error('❌ Content file not found:', contentPath);
      return false;
    }
    
    const contentRaw = fs.readFileSync(contentPath, 'utf8');
    
    // Check if it's valid JSON
    let content;
    try {
      content = JSON.parse(contentRaw);
    } catch (parseError) {
      console.error('❌ Invalid JSON in content file:', parseError.message);
      return false;
    }
    
    // Basic structure validation
    const requiredSections = ['global', 'pages', 'components', 'forms', 'api', 'legal'];
    const missingRootSections = requiredSections.filter(section => !content[section]);
    
    if (missingRootSections.length > 0) {
      console.error('❌ Missing required root sections:', missingRootSections.join(', '));
      return false;
    }
    
    // Validate global section
    if (!content.global.site || !content.global.site.name) {
      console.error('❌ Missing required global.site.name');
      return false;
    }
    
    if (!content.global.navigation) {
      console.error('❌ Missing required global.navigation');
      return false;
    }
    
    if (!content.global.ui) {
      console.error('❌ Missing required global.ui');
      return false;
    }
    
    // Validate pages section
    const requiredPages = ['home', 'about', 'contact', 'events', 'menu'];
    const missingPages = requiredPages.filter(page => !content.pages[page]);
    
    if (missingPages.length > 0) {
      console.error('❌ Missing required pages:', missingPages.join(', '));
      return false;
    }
    
    // Validate components section
    const requiredComponents = ['testimonials', 'faq'];
    const missingComponents = requiredComponents.filter(component => !content.components[component]);
    
    if (missingComponents.length > 0) {
      console.error('❌ Missing required components:', missingComponents.join(', '));
      return false;
    }
    
    // Additional checks
    let issues = [];
    
    // Check for empty strings
    function checkForEmptyStrings(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          if (value.trim() === '') {
            issues.push(`Empty string at ${currentPath}`);
          }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkForEmptyStrings(value, currentPath);
        }
      }
    }
    
    checkForEmptyStrings(content);
    
    // Check navigation links
    if (content.global.navigation.header.links) {
      content.global.navigation.header.links.forEach((link, index) => {
        if (!link.href || !link.label) {
          issues.push(`Navigation link ${index} missing href or label`);
        }
      });
    }
    
    // Check FAQ items
    if (content.components.faq.items) {
      content.components.faq.items.forEach((item, index) => {
        if (!item.question || !item.answer) {
          issues.push(`FAQ item ${index} missing question or answer`);
        }
      });
    }
    
    if (issues.length > 0) {
      console.warn('⚠️  Content validation warnings:');
      issues.forEach(issue => console.warn(`  - ${issue}`));
    }
    
    console.log('✅ Content validation passed');
    if (issues.length > 0) {
      console.log(`📝 Found ${issues.length} warnings (non-blocking)`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Content validation error:', error.message);
    return false;
  }
}

function auditContent() {
  try {
    const contentPath = path.join(__dirname, '../config/content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    const stats = {
      totalStrings: 0,
      emptyStrings: 0,
      longStrings: 0,
      avgLength: 0,
      totalLength: 0,
      sections: {}
    };
    
    function analyzeObject(obj, section = 'root') {
      if (!stats.sections[section]) {
        stats.sections[section] = { strings: 0, avgLength: 0, totalLength: 0 };
      }
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          stats.totalStrings++;
          stats.sections[section].strings++;
          
          const length = value.length;
          stats.totalLength += length;
          stats.sections[section].totalLength += length;
          
          if (value.trim() === '') {
            stats.emptyStrings++;
          }
          
          if (length > 200) {
            stats.longStrings++;
          }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          analyzeObject(value, section);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              analyzeObject(item, section);
            }
          });
        }
      }
    }
    
    // Analyze each main section
    Object.keys(content).forEach(sectionKey => {
      analyzeObject(content[sectionKey], sectionKey);
    });
    
    // Calculate averages
    stats.avgLength = stats.totalLength / stats.totalStrings;
    Object.keys(stats.sections).forEach(section => {
      stats.sections[section].avgLength = stats.sections[section].totalLength / stats.sections[section].strings;
    });
    
    console.log('📊 Content Audit Report');
    console.log('=' .repeat(50));
    console.log(`Total strings: ${stats.totalStrings}`);
    console.log(`Total length: ${stats.totalLength} characters`);
    console.log(`Average length: ${Math.round(stats.avgLength)} characters`);
    console.log(`Empty strings: ${stats.emptyStrings}`);
    console.log(`Long strings (>200 chars): ${stats.longStrings}`);
    console.log('');
    
    console.log('📋 Section Breakdown:');
    Object.entries(stats.sections).forEach(([section, data]) => {
      console.log(`  ${section}: ${data.strings} strings, avg ${Math.round(data.avgLength)} chars`);
    });
    
    // Health score
    const emptyStringPenalty = stats.emptyStrings * 5;
    const longStringPenalty = stats.longStrings * 2;
    const healthScore = Math.max(0, 100 - emptyStringPenalty - longStringPenalty);
    
    console.log('');
    console.log(`🏥 Content Health Score: ${healthScore}/100`);
    
    if (healthScore >= 90) {
      console.log('✅ Excellent content quality');
    } else if (healthScore >= 75) {
      console.log('⚠️  Good content quality, minor improvements possible');
    } else if (healthScore >= 50) {
      console.log('⚠️  Content quality needs attention');
    } else {
      console.log('❌ Content quality requires immediate improvement');
    }
    
    return stats;
    
  } catch (error) {
    console.error('❌ Content audit error:', error.message);
    return null;
  }
}

function formatContent() {
  try {
    const contentPath = path.join(__dirname, '../config/content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Format with proper indentation
    const formattedContent = JSON.stringify(content, null, 2);
    
    fs.writeFileSync(contentPath, formattedContent, 'utf8');
    
    console.log('✅ Content file formatted successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Content formatting error:', error.message);
    return false;
  }
}

// Handle command line execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'validate':
      validateContent().then ? validateContent().then(success => {
        process.exit(success ? 0 : 1);
      }) : process.exit(validateContent() ? 0 : 1);
      break;
      
    case 'audit':
      auditContent();
      break;
      
    case 'format':
      process.exit(formatContent() ? 0 : 1);
      break;
      
    default:
      console.log('Usage: node validate-content.js [validate|audit|format]');
      console.log('');
      console.log('Commands:');
      console.log('  validate  - Validate content structure');
      console.log('  audit     - Generate content quality report');
      console.log('  format    - Format content file with proper indentation');
      process.exit(1);
  }
}

module.exports = { validateContent, auditContent, formatContent };