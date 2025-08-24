# Environment-Specific Content Strategy

This document outlines the content management strategy across different environments (development, staging, production) for the Old Crown Restaurant application.

## Overview

The application supports environment-specific content configurations to enable different content variations based on the deployment environment. This allows for:

- **Development**: Debug-enabled content with clear environment indicators
- **Staging**: Production-like content with testing features enabled
- **Production**: Optimized, customer-facing content with full performance features

## Directory Structure

```
data/
├── dev/
│   ├── config.json      # Development environment configuration
│   └── content.json     # Development-specific content
├── staging/
│   ├── config.json      # Staging environment configuration
│   └── content.json     # Staging-specific content
└── prod/
    ├── config.json      # Production environment configuration
    └── content.json     # Production-specific content
```

## Environment Configurations

### Development Environment (`data/dev/`)

**Features:**
- CMS enabled with filesystem source
- Debug features enabled
- Environment banners visible
- Short caching durations (60s content, 5min menu)
- Development-specific contact information
- Debug labels on UI elements (`[DEV]` suffixes)

**Use Cases:**
- Local development
- Feature testing
- Content debugging
- Performance testing with minimal caching

### Staging Environment (`data/staging/`)

**Features:**
- CMS enabled with API source, filesystem fallback
- Limited debug features
- Environment banners visible
- Moderate caching (5min content, 10min menu)
- Staging-specific contact information
- Clean UI labels without debug markers

**Use Cases:**
- Pre-production testing
- Client demos
- Integration testing
- Performance validation

### Production Environment (`data/prod/`)

**Features:**
- CMS enabled with API source, filesystem fallback
- No debug features
- No environment banners
- Optimized caching (1hr content, 2hr menu, 24hr static)
- Real contact information
- Customer-facing content with marketing focus

**Use Cases:**
- Live customer-facing website
- Maximum performance optimization
- Real business operations

## Content Variations

### Site Information
- **Dev**: `"Old Crown [DEV]"` with debug indicators
- **Staging**: `"Old Crown [STAGING]"` with staging indicators  
- **Prod**: `"Old Crown"` with professional branding

### Contact Information
- **Dev**: Test contact details with `dev@` email prefix
- **Staging**: Staging contact details with `staging@` email prefix
- **Prod**: Real business contact information

### UI Elements
- **Dev**: Debug suffixes on buttons and labels (`[DEV]`)
- **Staging**: Clean labels for testing user experience
- **Prod**: Optimized, marketing-focused copy

### Error Messages
- **Dev**: Detailed error messages with debug context
- **Staging**: User-friendly error messages
- **Prod**: Professional, customer-appropriate error messaging

## Configuration Management

### Feature Flags

Environment-specific feature flags control functionality:

```json
{
  "featureFlags": {
    "cms": true,           // Content management system
    "posSync": false,      // Point of sale synchronization  
    "debug": true,         // Debug features (dev only)
    "analytics": false,    // Analytics tracking
    "environmentBanner": true // Environment indicator banner
  }
}
```

### Caching Strategy

Performance optimization through environment-specific caching:

- **Development**: Minimal caching for rapid iteration
- **Staging**: Moderate caching for realistic testing
- **Production**: Aggressive caching for optimal performance

### API Endpoints

Environment-specific API configurations:

- **Dev**: `localhost:3000` for local development
- **Staging**: `staging.oldcrown.co.uk` for pre-production testing
- **Prod**: `oldcrown.co.uk` for live operations

## Implementation

### Environment Detection

The application automatically detects the environment using:

1. `NODE_ENV` environment variable
2. `APP_ENV` custom environment variable (if set)
3. Domain-based detection for client-side routing

### Content Loading Strategy

1. **Primary**: Load from environment-specific directory (`data/{env}/`)
2. **Fallback**: Load from main config directory (`config/`)
3. **Default**: Use hardcoded fallbacks in code

### Deployment Workflow

1. **Development**: Direct file modifications in `data/dev/`
2. **Staging**: Content promotion from dev to staging
3. **Production**: Approved content promotion from staging to prod

## Content Management Workflows

### Development Workflow
1. Edit content directly in `data/dev/content.json`
2. Test changes locally with hot reload
3. Validate content structure with validation scripts
4. Commit changes for review

### Staging Promotion
1. Copy content from `data/dev/` to `data/staging/`
2. Remove debug markers and development-specific content
3. Update contact information for staging environment
4. Deploy to staging environment for testing

### Production Promotion
1. Copy approved content from `data/staging/` to `data/prod/`
2. Update to final production contact information
3. Remove all environment indicators
4. Optimize content for SEO and marketing
5. Deploy to production with cache invalidation

## Best Practices

### Content Development
- Always start content changes in development environment
- Use clear debug markers for development content
- Maintain consistent content structure across environments
- Test content changes in staging before production

### Performance Optimization
- Use appropriate caching strategies for each environment
- Minimize content payload in production
- Implement proper cache invalidation strategies
- Monitor content loading performance

### Security Considerations
- Never include sensitive information in development content
- Use environment-appropriate contact information
- Implement proper access controls for content APIs
- Validate all content inputs regardless of environment

## Monitoring and Maintenance

### Content Validation
- Automated schema validation for all environments
- Content structure consistency checks
- Link validation for contact information
- Performance impact assessment

### Environment Synchronization
- Regular content audits across environments
- Automated promotion workflows where appropriate
- Change tracking and version control
- Rollback procedures for content issues

## Troubleshooting

### Common Issues

1. **Content Not Loading**: Check environment detection and file paths
2. **Wrong Environment Content**: Verify environment variable configuration
3. **Caching Issues**: Clear environment-specific caches
4. **Missing Fallbacks**: Ensure fallback content exists in all environments

### Debug Commands

```bash
# Validate environment-specific content
npm run validate-content -- --env=dev
npm run validate-content -- --env=staging  
npm run validate-content -- --env=prod

# Check content loading
npm run test:content -- --environment=dev
```

This environment-specific content strategy ensures consistent, appropriate content delivery across all deployment environments while maintaining development efficiency and production performance.