# Production Migration Guide

## 🚀 Modular Content System - Production Deployment

This guide provides a step-by-step approach to safely migrate from the legacy content.json system to the new modular content architecture in production.

## Migration Phases

### Phase 1: Preparation (Pre-Production)
**Duration**: 1-2 weeks  
**Risk Level**: Low  
**Rollback**: Immediate  

#### Checklist
- [ ] Deploy modular system alongside legacy (parallel running)
- [ ] Enable comparison mode in staging environment
- [ ] Validate all content modules load correctly
- [ ] Run performance benchmarks
- [ ] Test environment-specific overrides
- [ ] Verify backward compatibility adapter works
- [ ] Set up monitoring and alerting
- [ ] Train team on new system

#### Environment Variables
```bash
# Staging Environment
NEXT_PUBLIC_USE_MODULAR_CONTENT=true
NEXT_PUBLIC_ENVIRONMENT=staging
FEATURE_FLAG_CONTENT_VALIDATION=true
ENABLE_DEBUG_MODE=true
```

#### Validation Steps
```bash
# 1. Deploy to staging
npm run build
npm run deploy:staging

# 2. Run content validation
npm run validate:content

# 3. Performance testing
npm run test:performance

# 4. E2E testing
npm run test:e2e:staging
```

### Phase 2: Gradual Migration (Production)
**Duration**: 2-4 weeks  
**Risk Level**: Medium  
**Rollback**: Within 1 hour  

#### Week 1: Core Content (20% traffic)
- [ ] Enable modular system for core modules only
- [ ] Monitor performance metrics
- [ ] Validate content consistency
- [ ] Collect user feedback

```bash
# Production Environment Variables
NEXT_PUBLIC_USE_MODULAR_CONTENT=true
NEXT_PUBLIC_ENVIRONMENT=prod
FEATURE_FLAG_BACKWARD_COMPATIBILITY=true

# Gradual rollout configuration
MIGRATION_PHASE=gradual
PAGE_WHITELIST=home,about
MODULE_WHITELIST=core/global,core/ui
```

#### Week 2: Main Pages (50% traffic)
- [ ] Add menu, contact, events pages
- [ ] Monitor cache performance
- [ ] Validate SEO impact
- [ ] Check mobile performance

#### Week 3: All Pages (80% traffic)
- [ ] Enable all page modules
- [ ] Add component modules
- [ ] Test form functionality
- [ ] Validate API integrations

#### Week 4: Complete Migration (100% traffic)
- [ ] Switch all traffic to modular system
- [ ] Disable legacy fallbacks
- [ ] Remove comparison mode
- [ ] Optimize cache settings

### Phase 3: Optimization (Post-Migration)
**Duration**: 1-2 weeks  
**Risk Level**: Low  
**Rollback**: Legacy system available  

- [ ] Remove legacy content.json
- [ ] Clean up compatibility code
- [ ] Optimize bundle sizes
- [ ] Fine-tune cache settings
- [ ] Update documentation

## Deployment Commands

### Staging Deployment
```bash
# 1. Build with staging configuration
npm run build:staging

# 2. Deploy to staging
npm run deploy:staging

# 3. Run smoke tests
npm run test:smoke:staging

# 4. Validate content loading
curl -H "Accept: application/json" \
     -H "X-Environment: staging" \
     "https://staging.yourrestaurant.com/api/content/manifest"
```

### Production Deployment
```bash
# 1. Build production bundle
npm run build:production

# 2. Pre-deployment validation
npm run validate:production

# 3. Deploy with gradual rollout
npm run deploy:production:gradual

# 4. Monitor deployment
npm run monitor:deployment

# 5. Health check
npm run health:check:production
```

## Monitoring & Alerting

### Key Metrics to Monitor
1. **Content Loading Performance**
   - Module load times
   - Cache hit rates
   - Network request counts
   - Bundle sizes

2. **Error Rates**
   - Content fetch failures
   - Module composition errors
   - Validation failures
   - API endpoint errors

3. **User Experience**
   - Page load times
   - Time to interactive
   - Cumulative layout shift
   - First contentful paint

### Monitoring Setup
```bash
# Set up performance monitoring
export ENABLE_PERFORMANCE_MONITORING=true
export PERFORMANCE_TRACKING_ENDPOINT="https://api.yourmonitoring.com/performance"

# Set up error tracking
export ENABLE_ERROR_TRACKING=true
export ERROR_TRACKING_ENDPOINT="https://api.yourmonitoring.com/errors"

# Set up content analytics
export ENABLE_CONTENT_ANALYTICS=true
export ANALYTICS_ENDPOINT="https://api.youranalytics.com/content"
```

### Alert Thresholds
```yaml
alerts:
  content_load_time:
    warning: 500ms
    critical: 1000ms
  
  error_rate:
    warning: 1%
    critical: 5%
  
  cache_hit_rate:
    warning: 80%
    critical: 70%
  
  api_response_time:
    warning: 200ms
    critical: 500ms
```

## Rollback Procedures

### Immediate Rollback (Emergency)
```bash
# 1. Disable modular system via environment variable
export NEXT_PUBLIC_USE_MODULAR_CONTENT=false

# 2. Force restart application
kubectl rollout restart deployment/restaurant-app

# 3. Verify rollback
curl -s "https://yourrestaurant.com/health" | jq '.contentSystem'

# Expected: "legacy"
```

### Gradual Rollback
```bash
# 1. Reduce traffic to modular system
export PAGE_WHITELIST=home  # Only home page

# 2. Monitor for stability

# 3. Complete rollback if needed
export NEXT_PUBLIC_USE_MODULAR_CONTENT=false
```

## Testing Procedures

### Pre-Deployment Testing
```bash
# 1. Unit tests
npm run test:unit

# 2. Integration tests
npm run test:integration

# 3. Content validation
npm run validate:content:all

# 4. Performance tests
npm run test:performance:baseline

# 5. E2E tests
npm run test:e2e:critical-paths
```

### Post-Deployment Validation
```bash
# 1. Smoke tests
npm run test:smoke:production

# 2. Content consistency check
npm run validate:content:consistency

# 3. Performance regression test
npm run test:performance:regression

# 4. SEO validation
npm run validate:seo

# 5. Accessibility check
npm run test:accessibility
```

## Performance Optimization

### Cache Configuration
```javascript
// Production cache settings
const cacheConfig = {
  core: {
    maxAge: 1800, // 30 minutes
    sMaxAge: 3600, // 1 hour
    staleWhileRevalidate: 86400, // 24 hours
  },
  pages: {
    maxAge: 600, // 10 minutes
    sMaxAge: 1200, // 20 minutes
    staleWhileRevalidate: 3600, // 1 hour
  },
  components: {
    maxAge: 300, // 5 minutes
    sMaxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
  },
};
```

### CDN Configuration
```nginx
# CDN cache rules for content modules
location /api/content/modules/ {
    proxy_pass http://backend;
    proxy_cache content_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    add_header X-Cache-Status $upstream_cache_status;
}

# Longer cache for manifest
location /api/content/manifest {
    proxy_pass http://backend;
    proxy_cache content_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
}
```

## Security Considerations

### Production Security Settings
```bash
# CORS configuration
ALLOWED_ORIGINS="https://yourrestaurant.com,https://www.yourrestaurant.com"

# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# Security headers
ENABLE_SECURITY_HEADERS=true
HSTS_MAX_AGE=31536000
CSP_ENABLED=true
```

### Content Security Policy
```javascript
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'connect-src': ["'self'", "https://api.yourrestaurant.com"],
  'font-src': ["'self'"],
};
```

## Troubleshooting

### Common Issues

#### 1. Module Loading Failures
```bash
# Check module exists
ls -la config/content/pages/home.json

# Validate JSON syntax
cat config/content/pages/home.json | jq .

# Check API endpoint
curl "https://yourrestaurant.com/api/content/modules/pages/home"
```

#### 2. Cache Issues
```bash
# Clear CDN cache
curl -X PURGE "https://cdn.yourrestaurant.com/api/content/*"

# Check cache headers
curl -I "https://yourrestaurant.com/api/content/manifest"

# Validate cache behavior
curl -H "Cache-Control: no-cache" "https://yourrestaurant.com/api/content/manifest"
```

#### 3. Performance Degradation
```bash
# Check response times
curl -w "@curl-format.txt" "https://yourrestaurant.com/api/content/manifest"

# Monitor bundle sizes
npm run analyze:bundle

# Check memory usage
npm run monitor:memory
```

### Emergency Contacts
- **DevOps Team**: devops@yourrestaurant.com
- **Backend Team**: backend@yourrestaurant.com
- **Frontend Team**: frontend@yourrestaurant.com
- **On-call Engineer**: +1-XXX-XXX-XXXX

## Success Criteria

### Migration Considered Successful When:
- [ ] All content loads within performance thresholds
- [ ] Error rate < 0.1%
- [ ] Cache hit rate > 90%
- [ ] No SEO regression
- [ ] Page load times improved or maintained
- [ ] Zero user-reported issues
- [ ] Monitoring shows stable metrics for 48 hours

### Post-Migration Cleanup
- [ ] Remove legacy content.json file
- [ ] Clean up migration adapter code
- [ ] Update documentation
- [ ] Archive rollback procedures
- [ ] Conduct post-mortem review
- [ ] Share learnings with team

## Documentation Updates
After successful migration, update:
- [ ] API documentation
- [ ] Developer onboarding guide
- [ ] Content management workflows
- [ ] Monitoring runbooks
- [ ] Architecture diagrams