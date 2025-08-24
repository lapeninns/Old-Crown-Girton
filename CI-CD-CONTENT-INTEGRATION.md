# CI/CD Pipeline Integration for Content Management

This document outlines the automated CI/CD workflows for content validation, deployment, and monitoring in the Old Crown Restaurant application.

## Overview

The CI/CD pipeline ensures content quality, security, and consistency across all environments through automated validation, testing, and deployment processes.

## Workflows

### 1. Content Validation (`content-validation.yml`)

**Trigger:** 
- Push to `main` or `develop` branches
- Pull requests targeting `main` branch
- Changes to content-related files (`config/**`, `data/**`, `src/lib/data/**`, `hooks/**`, `app/api/content/**`)

**Jobs:**

#### `validate-content`
- **Purpose**: Comprehensive content structure and format validation
- **Steps**:
  - Schema validation for all environments (dev, staging, prod)
  - Content audit for completeness and consistency
  - Content loading functionality testing
  - API route integration testing
  - Accessibility compliance validation
  - JSON formatting verification
  - File size constraint checking
  - Automated PR comments with validation results

#### `content-security-scan`
- **Purpose**: Security validation and sensitive data detection
- **Steps**:
  - Scan for sensitive information (passwords, secrets, tokens)
  - Validate environment-specific content isolation
  - Check for development markers in production content
  - Validate contact information formatting
  - Ensure production-ready content standards

#### `deployment-readiness`
- **Purpose**: Production build validation (main branch only)
- **Steps**:
  - Full application build with content integration
  - Production API endpoint testing
  - Content loading performance validation
  - Total content size constraint verification

### 2. Content Deployment (`content-deployment.yml`)

**Trigger:**
- Manual workflow dispatch for content promotion
- Automatic deployment on production content changes

**Jobs:**

#### `content-promotion`
- **Purpose**: Automated content promotion between environments
- **Features**:
  - Manual environment selection (dev → staging, staging → prod)
  - Validation-only mode for testing
  - Automatic environment-specific content transformation
  - Content backup creation before deployment
  - Deployment metadata tracking
  - Git commit automation for successful deployments

**Environment Transformations:**
- **Production**: Remove debug markers, update contact information, set production environment flags
- **Staging**: Clean testing-appropriate content without debug artifacts
- **Development**: Preserve debug features and development-specific configurations

#### `production-deployment`
- **Purpose**: Final production deployment validation and notification
- **Steps**:
  - Final content validation before live deployment
  - Production application build verification
  - Content hash calculation for cache invalidation
  - Deployment notification and monitoring setup

### 3. Content Health Monitoring (`content-monitoring.yml`)

**Trigger:**
- Scheduled daily runs (6 AM UTC)
- Manual workflow dispatch with environment selection

**Jobs:**

#### `content-health-check`
- **Purpose**: Ongoing content quality and consistency monitoring
- **Features**:
  - Environment-specific health validation
  - Content consistency checking across environments
  - Link and contact information validation
  - Content quality metrics calculation
  - Performance metrics tracking
  - Automated health report generation
  - Issue creation on health check failures

**Monitoring Metrics:**
- Content file sizes and growth tracking
- Content structure consistency across environments
- Empty values and placeholder content detection
- Email and phone format validation
- Compression ratio analysis for performance optimization

## Validation Scripts

The pipeline leverages npm scripts defined in `package.json`:

```json
{
  "validate-content": "node scripts/validate-content.js validate",
  "audit-content": "node scripts/validate-content.js audit", 
  "format-content": "node scripts/validate-content.js format",
  "test:content": "jest --testPathPattern=content",
  "test:accessibility": "jest --testPathPattern=accessibility"
}
```

### Content Validation Script (`scripts/validate-content.js`)

**Functions:**
- `validate`: Schema validation and structure verification
- `audit`: Content completeness and quality assessment
- `format`: JSON formatting and consistency checks

**Environment Support:**
```bash
npm run validate-content -- --env=dev
npm run validate-content -- --env=staging
npm run validate-content -- --env=prod
```

## Content Promotion Workflow

### Development to Staging
1. **Trigger**: Manual workflow dispatch
2. **Source**: `data/dev/content.json`
3. **Target**: `data/staging/content.json`
4. **Transformations**:
   - Remove `[DEV]` markers
   - Update to staging contact information
   - Set staging environment flags
5. **Validation**: Full content and API testing
6. **Deployment**: Automatic commit to repository

### Staging to Production
1. **Trigger**: Manual workflow dispatch or approved PR merge
2. **Source**: `data/staging/content.json`
3. **Target**: `data/prod/content.json`
4. **Transformations**:
   - Remove all environment markers
   - Update to production contact information
   - Set production environment flags
   - Enable production optimizations
5. **Validation**: Comprehensive production readiness testing
6. **Deployment**: Automatic commit with deployment metadata

## Security Features

### Sensitive Data Protection
- Automated scanning for credentials and secrets
- Environment isolation validation
- Production content purity verification
- Contact information format validation

### Access Control
- Branch protection rules for main branch
- Required status checks for content changes
- Manual approval required for production deployments
- Audit trail for all content modifications

## Performance Optimization

### Content Size Monitoring
- Per-environment file size limits (2MB)
- Total content size constraints (5MB)
- Compression ratio analysis
- Performance impact assessment

### Caching Strategy
- Environment-specific cache durations
- Content hash calculation for cache busting
- CDN cache invalidation preparation
- Performance metrics tracking

## Error Handling and Recovery

### Validation Failures
- Detailed error reporting in workflow logs
- Automatic PR comments with failure details
- Issue creation for critical failures
- Rollback procedures for failed deployments

### Deployment Recovery
- Automatic backup creation before deployments
- Rollback scripts for failed promotions
- Health check validation after deployments
- Emergency content restoration procedures

## Monitoring and Alerting

### Daily Health Checks
- Automated content consistency validation
- Performance metrics collection
- Quality metrics tracking
- Proactive issue detection

### Failure Notifications
- GitHub issue creation for failures
- Deployment status notifications
- Health report artifact generation
- Integration with external monitoring systems

## Best Practices

### Content Development
1. Always start changes in development environment
2. Use validation scripts before committing
3. Test content changes locally before pushing
4. Include accessibility validation in development workflow

### Deployment Process
1. Validate content in development first
2. Promote to staging for integration testing
3. Perform full validation before production deployment
4. Monitor performance after production deployment

### Security Guidelines
1. Never commit sensitive information to content files
2. Use environment-appropriate contact information
3. Validate all external links and references
4. Implement proper content sanitization

## Integration Points

### GitHub Actions Integration
- Seamless integration with existing GitHub workflows
- Automatic status checks for pull requests
- Integration with branch protection rules
- Artifact storage for health reports and backups

### Application Integration
- Compatible with existing data loading architecture
- Supports smart loading with fallback mechanisms
- Integrates with SWR-based content hooks
- Maintains compatibility with existing API routes

### Monitoring Integration
- Health check results available as artifacts
- Performance metrics for external monitoring
- Issue creation for automated alerting
- Integration with deployment tracking systems

## Troubleshooting

### Common Issues

1. **Validation Failures**
   - Check content schema compliance
   - Verify JSON formatting
   - Validate environment-specific content

2. **Deployment Failures**
   - Review deployment logs for errors
   - Check content transformation scripts
   - Verify target environment accessibility

3. **Health Check Failures**
   - Review health check logs
   - Validate content consistency
   - Check external link accessibility

### Debug Commands

```bash
# Local validation
npm run validate-content -- --env=dev --verbose
npm run test:content -- --verbose

# Manual health check
npm run audit-content -- --environment=all

# Content formatting
npm run format-content -- --fix
```

This CI/CD integration ensures reliable, secure, and performant content management across all environments while maintaining development velocity and operational excellence.