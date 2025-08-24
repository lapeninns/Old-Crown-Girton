# Content Editing Workflows and Best Practices

This document provides comprehensive workflows and best practices for editing content in the Content Management System (CMS).

## Quick Start Guide

### For Content Editors

1. **Locate Content File**: All content is in `/config/content.json`
2. **Edit Content**: Update text, labels, or UI content
3. **Validate Changes**: Run validation script to check structure
4. **Test Locally**: Preview changes in development environment
5. **Deploy**: Commit changes to deploy

### For Developers

1. **Add New Content Fields**: Update content.json structure
2. **Update Schema**: Extend Zod schemas for validation
3. **Update Components**: Integrate new content fields
4. **Write Tests**: Add tests for new content integration
5. **Document Changes**: Update workflows and documentation

## Content Structure Guide

### Global Content

#### Site Information
```json
{
  "global": {
    "site": {
      "name": "The Old Crown Girton",                    // Main site name
      "title": "Historic Thatched Pub & Nepalese Restaurant",  // Browser title
      "description": "Historic thatched pub in Girton...",     // Meta description
      "keywords": ["pub Girton", "Nepalese restaurant"],       // SEO keywords
      "branding": {
        "tagline": "A unique blend of authentic Nepalese...",  // Main tagline
        "slogan": "Where heritage meets hospitality"           // Marketing slogan
      }
    }
  }
}
```

**Editing Guidelines:**
- Keep `name` under 50 characters
- `title` should be SEO-friendly (50-60 characters)
- `description` should be compelling and under 160 characters
- `keywords` should be relevant and specific
- `tagline` should capture brand essence
- `slogan` should be memorable and short

#### Navigation Content
```json
{
  "navigation": {
    "header": {
      "links": [
        { "href": "/", "label": "Home" },
        { "href": "/menu", "label": "Menu" },
        { "href": "/about", "label": "About" },
        { "href": "/events", "label": "Events" },
        { "href": "/contact", "label": "Contact" }
      ]
    },
    "footer": {
      "sections": [
        {
          "title": "Quick Links",
          "links": [
            { "href": "/menu", "label": "Menu" },
            { "href": "/about", "label": "About" }
          ]
        }
      ],
      "copyright": "© 2025 The Old Crown Girton. All rights reserved.",
      "socialMedia": {
        "facebook": { 
          "url": "https://facebook.com/yourpage", 
          "label": "Follow us on Facebook" 
        }
      }
    }
  }
}
```

**Editing Guidelines:**
- Keep navigation labels short and clear
- Ensure URLs are correct and accessible
- Update copyright year annually
- Use descriptive labels for social media links
- Test all links after updates

#### UI Elements
```json
{
  "ui": {
    "buttons": {
      "bookOnline": "Book Online",
      "viewMenu": "View Menu",
      "orderTakeaway": "Order Takeaway",
      "callNow": "Call Now",
      "getDirections": "Get Directions",
      "close": "Close",
      "submit": "Submit",
      "cancel": "Cancel"
    },
    "labels": {
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "menu": "Menu",
      "support": "Customer Support"
    },
    "messages": {
      "loading": "Please wait while we load the content...",
      "error": "Something went wrong. Please try again.",
      "offline": "You are currently offline.",
      "connectionError": "Connection error. Please check your internet connection."
    }
  }
}
```

**Editing Guidelines:**
- Use action-oriented language for buttons
- Keep button text concise (1-3 words)
- Make error messages helpful and actionable
- Use consistent tone across all UI text
- Consider accessibility when writing labels

#### Accessibility Content
```json
{
  "accessibility": {
    "ariaLabels": {
      "mainNavigation": "Main navigation",
      "mainContent": "Main content",
      "skipToContent": "Skip to main content",
      "openModal": "Open modal",
      "closeModal": "Close modal",
      "menuButton": "Toggle navigation menu"
    },
    "altTexts": {
      "logo": "The Old Crown Girton logo",
      "heroBanner": "Historic thatched pub exterior",
      "defaultImage": "Restaurant image"
    },
    "descriptions": {
      "siteDescription": "Historic thatched pub and Nepalese restaurant website"
    }
  }
}
```

**Editing Guidelines:**
- ARIA labels should be descriptive and concise
- Alt texts should describe image content clearly
- Use present tense for actions
- Avoid redundant phrases like "image of" or "link to"
- Test with screen readers when possible

### Page-Specific Content

#### Home Page
```json
{
  "pages": {
    "home": {
      "hero": {
        "title": "The Old Crown Girton: Historic Thatched Pub & Authentic Nepalese Restaurant",
        "subtitle": "Welcome to Girton's unique dining destination...",
        "description": "Just minutes from Cambridge and Girton College...",
        "cta": {
          "primary": "Book Online",
          "secondary": "View Menu"
        }
      },
      "sections": {
        "features": {
          "title": "What Makes Us Special",
          "items": [
            {
              "icon": "🏛️",
              "title": "Historic Thatched Building",
              "description": "Largest in the country"
            }
          ]
        }
      }
    }
  }
}
```

**Editing Guidelines:**
- Hero title should be compelling and SEO-friendly
- Subtitle should expand on the title
- Description should provide context and location
- CTAs should be action-oriented
- Feature descriptions should be benefit-focused

#### Forms Content
```json
{
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address",
      "phone": "Please enter a valid phone number",
      "minLength": "Must be at least {min} characters",
      "maxLength": "Must be no more than {max} characters"
    },
    "messages": {
      "success": "Thank you! We'll get back to you soon.",
      "error": "Sorry, something went wrong. Please try again.",
      "submitting": "Submitting..."
    },
    "labels": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "message": "Message",
      "subject": "Subject"
    }
  }
}
```

**Editing Guidelines:**
- Validation messages should be helpful and specific
- Success messages should confirm action and set expectations
- Error messages should suggest solutions
- Form labels should be clear and concise
- Use consistent terminology across forms

## Content Editing Workflows

### Workflow 1: Standard Content Updates

**For routine text updates, menu changes, and UI modifications**

1. **Preparation**
   ```bash
   # Clone repository and create branch
   git checkout -b content-update-YYYY-MM-DD
   cd /path/to/restaurant-project
   ```

2. **Edit Content**
   - Open `/config/content.json`
   - Locate the section to update
   - Make changes following content guidelines
   - Save file

3. **Validation**
   ```bash
   # Validate content structure
   npm run validate-content
   
   # Run content tests
   npm run test:content
   ```

4. **Local Testing**
   ```bash
   # Start development server
   npm run dev
   
   # Test changes in browser
   # Visit affected pages
   # Check responsive design
   # Test accessibility
   ```

5. **Review and Deploy**
   ```bash
   # Commit changes
   git add config/content.json
   git commit -m "Update: [description of changes]"
   
   # Push and create PR
   git push origin content-update-YYYY-MM-DD
   ```

### Workflow 2: Adding New Content Sections

**For adding new pages, components, or content structures**

1. **Plan Structure**
   - Define content hierarchy
   - Plan schema structure
   - Document new fields

2. **Update Schema**
   ```typescript
   // In src/lib/data/schemas.ts
   export const NewSectionSchema = z.object({
     title: z.string(),
     items: z.array(z.string()),
     // ... other fields
   });
   
   // Add to ContentSchema
   export const ContentSchema = z.object({
     // ... existing fields
     newSection: NewSectionSchema.optional(),
   });
   ```

3. **Add Content**
   ```json
   // In config/content.json
   {
     "newSection": {
       "title": "New Section Title",
       "items": ["Item 1", "Item 2"]
     }
   }
   ```

4. **Update Components**
   ```typescript
   // Use in components
   const { data: content } = useContent();
   const newSectionData = content?.newSection;
   ```

5. **Testing and Documentation**
   - Write unit tests
   - Update documentation
   - Test thoroughly

### Workflow 3: Seasonal Content Updates

**For holiday seasons, special events, or temporary promotions**

1. **Create Seasonal Branch**
   ```bash
   git checkout -b seasonal-content-holiday-2025
   ```

2. **Update Relevant Sections**
   - Hero sections with seasonal messaging
   - Special event announcements
   - Temporary menu items
   - Promotional CTAs

3. **Schedule Deployment**
   - Plan deployment timing
   - Set up content rollback plan
   - Coordinate with marketing team

4. **Post-Season Cleanup**
   - Remove temporary content
   - Restore standard messaging
   - Archive seasonal content for future use

### Workflow 4: Accessibility Content Review

**Regular accessibility audit and content updates**

1. **Audit Current Content**
   ```bash
   # Run accessibility tests
   npm run test:accessibility
   
   # Use accessibility tools
   npm run audit:a11y
   ```

2. **Review Content Areas**
   - ARIA labels completeness
   - Alt text accuracy
   - Button text clarity
   - Error message helpfulness

3. **Update and Test**
   - Improve accessibility content
   - Test with screen readers
   - Validate with accessibility tools

## Content Validation Scripts

### Automated Validation

Create validation scripts in `package.json`:

```json
{
  "scripts": {
    "validate-content": "node scripts/validate-content.js",
    "test:content": "jest --testPathPattern=content",
    "audit:content": "node scripts/audit-content.js",
    "format:content": "node scripts/format-content.js"
  }
}
```

### Content Validation Script

```javascript
// scripts/validate-content.js
const fs = require('fs');
const path = require('path');
const { ContentSchema } = require('../src/lib/data/schemas');

async function validateContent() {
  try {
    const contentPath = path.join(__dirname, '../config/content.json');
    const contentRaw = fs.readFileSync(contentPath, 'utf8');
    const content = JSON.parse(contentRaw);
    
    // Validate against schema
    const result = ContentSchema.safeParse(content);
    
    if (result.success) {
      console.log('✅ Content validation passed');
      return true;
    } else {
      console.error('❌ Content validation failed:');
      result.error.errors.forEach(error => {
        console.error(`  - ${error.path.join('.')}: ${error.message}`);
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Content validation error:', error.message);
    return false;
  }
}

if (require.main === module) {
  validateContent().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { validateContent };
```

### Content Audit Script

```javascript
// scripts/audit-content.js
const fs = require('fs');
const path = require('path');

function auditContent() {
  const contentPath = path.join(__dirname, '../config/content.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  
  const report = {
    totalStrings: 0,
    emptyStrings: 0,
    longStrings: 0,
    missingAltTexts: 0,
    missingAriaLabels: 0,
    issues: []
  };
  
  function auditObject(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        report.totalStrings++;
        
        if (value.trim() === '') {
          report.emptyStrings++;
          report.issues.push(`Empty string at ${currentPath}`);
        }
        
        if (value.length > 200) {
          report.longStrings++;
          report.issues.push(`Long string (${value.length} chars) at ${currentPath}`);
        }
      } else if (typeof value === 'object' && value !== null) {
        auditObject(value, currentPath);
      }
    }
  }
  
  auditObject(content);
  
  // Check for missing accessibility content
  if (!content.global?.accessibility?.altTexts) {
    report.missingAltTexts++;
    report.issues.push('Missing alt texts section');
  }
  
  if (!content.global?.accessibility?.ariaLabels) {
    report.missingAriaLabels++;
    report.issues.push('Missing ARIA labels section');
  }
  
  console.log('📊 Content Audit Report');
  console.log(`Total strings: ${report.totalStrings}`);
  console.log(`Empty strings: ${report.emptyStrings}`);
  console.log(`Long strings: ${report.longStrings}`);
  console.log(`Missing alt texts: ${report.missingAltTexts}`);
  console.log(`Missing ARIA labels: ${report.missingAriaLabels}`);
  
  if (report.issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    report.issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('\n✅ No issues found');
  }
  
  return report;
}

if (require.main === module) {
  auditContent();
}

module.exports = { auditContent };
```

## Best Practices

### Content Writing Guidelines

1. **Clarity and Conciseness**
   - Use simple, clear language
   - Avoid jargon and technical terms
   - Keep sentences short and readable
   - Use active voice

2. **Consistency**
   - Maintain consistent terminology
   - Use the same tone throughout
   - Follow established style guide
   - Use consistent formatting

3. **User-Focused**
   - Write from the user's perspective
   - Focus on benefits, not features
   - Use action-oriented language
   - Address user pain points

4. **SEO Optimization**
   - Include relevant keywords naturally
   - Write compelling meta descriptions
   - Use descriptive headings
   - Optimize for local search

5. **Accessibility**
   - Write descriptive alt texts
   - Use clear, helpful ARIA labels
   - Avoid using color alone to convey meaning
   - Test with assistive technologies

### Technical Best Practices

1. **JSON Structure**
   - Use consistent naming conventions
   - Organize content logically
   - Avoid deeply nested structures
   - Use meaningful key names

2. **Version Control**
   - Make atomic commits
   - Write descriptive commit messages
   - Use branches for major changes
   - Tag stable releases

3. **Validation**
   - Always validate before deployment
   - Run automated tests
   - Check schema compliance
   - Test fallback scenarios

4. **Performance**
   - Keep content files manageable
   - Optimize for caching
   - Minimize unnecessary nesting
   - Use efficient data structures

### Review and Quality Assurance

1. **Content Review Process**
   - Peer review for all changes
   - Spell check and grammar review
   - Brand voice consistency check
   - Legal and compliance review

2. **Testing Checklist**
   - [ ] Content displays correctly
   - [ ] Responsive design works
   - [ ] Accessibility compliance
   - [ ] Performance not degraded
   - [ ] Fallbacks work properly
   - [ ] Schema validation passes
   - [ ] All tests pass

3. **Deployment Checklist**
   - [ ] Content validated
   - [ ] Tests passing
   - [ ] Peer reviewed
   - [ ] Staging tested
   - [ ] Rollback plan ready
   - [ ] Documentation updated

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**
   - Check JSON syntax
   - Verify all required fields
   - Ensure correct data types
   - Run validation script

2. **Content Not Displaying**
   - Check API endpoint
   - Verify network requests
   - Check browser console
   - Test fallback mechanisms

3. **Performance Issues**
   - Check content file size
   - Verify caching headers
   - Monitor API response times
   - Optimize content structure

4. **Accessibility Problems**
   - Audit ARIA labels
   - Check alt text coverage
   - Test with screen readers
   - Validate semantic markup

### Emergency Procedures

1. **Content Rollback**
   ```bash
   # Quick rollback to previous version
   git revert HEAD
   git push origin main
   ```

2. **Emergency Content Update**
   ```bash
   # Hotfix for critical content issues
   git checkout -b hotfix-content
   # Make minimal changes
   git commit -m "Hotfix: [critical issue]"
   git push origin hotfix-content
   # Create immediate PR
   ```

3. **API Failure Fallback**
   - Content automatically falls back to local files
   - Monitor error rates
   - Check server status
   - Verify CDN status

This comprehensive workflow ensures consistent, high-quality content management while maintaining system reliability and user experience.