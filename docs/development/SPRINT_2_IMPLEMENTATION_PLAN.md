# 🏎️ SPRINT 2: Performance Optimization - Implementation Plan
**Duration:** 2 weeks  
**Status:** ACTIVE  
**Previous Sprint:** ✅ Sprint 0 Complete (All critical fixes resolved)

---

## 🎯 **Sprint 2 Goals**
- Achieve <100KB First Load JS target (currently 279KB)
- Implement advanced React performance patterns
- Optimize rendering and memory usage
- Add performance monitoring and alerting

---

## 📊 **Current Performance Baseline**
Based on completed Sprint 0 build analysis:

| Metric | Current Value | Target | Status |
|--------|---------------|--------|--------|
| First Load JS | 279KB | <100KB | 🔴 Needs Optimization |
| Main Bundle | Optimized chunks | <90KB | 🟡 In Progress |
| ESLint Warnings | 0 | 0 | ✅ Complete |
| Build Stability | 100% | 100% | ✅ Complete |
| Touch Targets | WCAG Compliant | 100% | ✅ Complete |

---

## 🚀 **Sprint 2 User Stories**

### **Story 2.1: Advanced Bundle Optimization**
**Priority:** P0 - Critical  
**Story Points:** 8  
**Acceptance Criteria:**
- [ ] First Load JS reduced from 279KB to <100KB
- [ ] Menu page bundle <90KB
- [ ] Lighthouse performance score >90
- [ ] Core Web Vitals in "Good" range

**Current Analysis:**
```
First Load JS shared by all: 279 kB
├ chunks/fd9d1056-482349a383bac764.js    53.6 kB  <- Main optimization target
├ chunks/vendors-351e52ed.js             18 kB    <- Vendor splitting needed
├ chunks/vendors-8d56c7ce.js             12.1 kB  <- Can be optimized
├ chunks/vendors-c0d76f48.js             11.6 kB  <- Tree shaking opportunity
└ other shared chunks (total)            173 kB   <- Major optimization needed
```

### **Story 2.2: React Performance Patterns**
**Priority:** P0 - Critical  
**Story Points:** 8  
**Acceptance Criteria:**
- [ ] All menu components properly memoized
- [ ] Expensive calculations optimized with useMemo
- [ ] Event handlers optimized with useCallback  
- [ ] Debounced search input implementation
- [ ] Virtual scrolling for large menu lists

### **Story 2.3: Code Splitting & Lazy Loading**
**Priority:** P1 - High  
**Story Points:** 5  
**Acceptance Criteria:**
- [ ] Route-based code splitting implemented
- [ ] Component-level lazy loading for menu
- [ ] Dynamic imports for heavy features
- [ ] Preloading strategies for critical paths

### **Story 2.4: Performance Monitoring**
**Priority:** P1 - High  
**Story Points:** 5  
**Acceptance Criteria:**
- [ ] Core Web Vitals monitoring setup
- [ ] Bundle size monitoring in CI/CD
- [ ] Performance regression alerts
- [ ] Real-time performance dashboard

---

## 🛠️ **Week 1: Bundle & React Optimization**

### **Day 1-2: Advanced Bundle Optimization**

#### **Task 2.1.1: Enhanced Next.js Configuration**
```javascript
// next.config.js - Enhanced optimization
module.exports = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react',
      'react-hot-toast'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Advanced code splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 100000,
      cacheGroups: {
        default: false,
        vendors: false,
        // React framework
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true
        },
        // Large libraries
        lib: {
          test(module) {
            return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier())
          },
          name(module) {
            const hash = crypto.createHash('sha1')
            hash.update(module.libIdent ? module.libIdent({ context: dir }) : module.identifier())
            return hash.digest('hex').substring(0, 8)
          },
          chunks: 'all',
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        },
        // Common modules
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
    
    // Tree shaking for lucide-react
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/index.js')
    }
    
    return config
  }
}
```

#### **Task 2.1.2: Library Import Optimization**
Target files for import optimization:
- `menu-content-complete.tsx` - Optimize framer-motion imports
- `menu-content-compact.tsx` - Tree-shake lucide-react icons  
- Navigation components - Optimize headless-ui imports

### **Day 3-4: React Performance Patterns**

#### **Task 2.2.1: Menu Component Memoization**
Focus on the large menu components:
- Add React.memo to all MenuItem components
- Implement useMemo for expensive calculations
- Add useCallback for event handlers
- Optimize re-render cycles

#### **Task 2.2.2: Debounced Search Implementation**
```typescript
// hooks/useDebounceSearch.ts
import { useState, useEffect, useMemo } from 'react';

export const useDebounceSearch = (delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  const clearSearch = useMemo(() => () => {
    setSearchTerm('');
    setDebouncedTerm('');
  }, []);

  return [debouncedTerm, setSearchTerm, clearSearch] as const;
};
```

### **Day 5: Testing & Optimization**
- Run bundle analyzer on optimized build
- Performance testing across devices
- Lighthouse audit improvements
- Memory leak detection

---

## 🛠️ **Week 2: Code Splitting & Monitoring**

### **Day 6-7: Dynamic Imports & Code Splitting**

#### **Task 2.3.1: Menu Component Lazy Loading**
```typescript
// app/menu/page.tsx - Implement lazy loading
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load heavy menu components
const MenuContentComplete = lazy(() => import('./menu-content-complete'));
const MenuContentCompact = lazy(() => import('./menu-content-compact'));
const MenuContentRedesigned = lazy(() => import('./menu-content-redesigned'));

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        {/* Menu content based on view preference */}
        <MenuContentComplete />
      </Suspense>
    </div>
  );
}
```

#### **Task 2.3.2: Route-Based Code Splitting**
```typescript
// app/layout.tsx - Implement route prefetching
import { Suspense } from 'react';
import { prefetch } from 'next/navigation';

// Preload critical routes
const preloadCriticalRoutes = () => {
  prefetch('/menu');
  prefetch('/about');
  prefetch('/contact');
};

// Add intersection observer for route preloading
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const href = entry.target.getAttribute('href');
        if (href) prefetch(href);
      }
    });
  });

  // Observe navigation links
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    observer.observe(link);
  });

  return () => observer.disconnect();
}, []);
```

### **Day 8-9: Performance Monitoring Setup**

#### **Task 2.4.1: Web Vitals Monitoring**
```typescript
// lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in navigator['connection']
    ? navigator['connection']['effectiveType']
    : '';
}

function sendToAnalytics(metric: any) {
  if (process.env.NODE_ENV !== 'production') return;
  
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (!analyticsId) return;

  const body = JSON.stringify({
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  });

  fetch(vitalsUrl, {
    body,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  }).catch(console.error);
}

// Setup Web Vitals monitoring
export function setupPerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

#### **Task 2.4.2: Bundle Size CI/CD Monitoring**
```yaml
# .github/workflows/performance.yml
name: Performance Monitoring

on:
  pull_request:
  push:
    branches: [main]

jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and analyze bundle
        run: |
          npm run build
          npx @next/bundle-analyzer
      
      - name: Bundle size check
        run: |
          # Fail if First Load JS > 100KB
          node scripts/check-bundle-size.js
```

### **Day 10: Integration & Testing**
- Performance regression testing
- Cross-browser performance validation
- Mobile performance optimization
- Final performance audit

---

## 📊 **Sprint 2 Success Metrics**

### **Performance Targets**
| Metric | Baseline | Target | Method |
|--------|----------|--------|--------|
| First Load JS | 279KB | <100KB | Bundle optimization |
| Menu Page Size | 290KB | <120KB | Code splitting |
| Lighthouse Score | Unknown | >90 | React optimization |
| LCP | Unknown | <2.5s | Image optimization |
| CLS | Unknown | <0.1 | Layout stability |
| FID | Unknown | <100ms | Event optimization |

### **Technical Deliverables**
- [ ] Enhanced Next.js configuration with advanced optimizations
- [ ] React.memo implementation for all menu components
- [ ] Debounced search with performance optimization
- [ ] Lazy loading for all heavy components
- [ ] Web Vitals monitoring dashboard
- [ ] Automated bundle size checking in CI/CD

---

## 🎯 **Implementation Priority**

### **High Priority (Week 1)**
1. ✅ Next.js bundle optimization configuration
2. ✅ React performance patterns in menu components
3. ✅ Library import optimization (lucide-react, framer-motion)
4. ✅ Debounced search implementation

### **Medium Priority (Week 2)**
1. ✅ Dynamic imports and lazy loading
2. ✅ Route-based code splitting
3. ✅ Performance monitoring setup
4. ✅ Bundle size CI/CD integration

### **Nice to Have**
- Service Worker caching strategies
- Image optimization with next/image
- Font optimization strategies
- Advanced prefetching logic

---

## 🚨 **Risk Mitigation**

### **Technical Risks**
- **Bundle size targets too aggressive**: Implement incrementally, monitor each change
- **React optimization complexity**: Focus on high-impact components first
- **Performance regression**: Automated monitoring with rollback capabilities
- **Cross-browser compatibility**: Test on all major browsers/devices

### **Success Criteria**
- [ ] 60%+ reduction in First Load JS bundle size
- [ ] Lighthouse performance score >90
- [ ] No functionality regression
- [ ] All performance monitoring active

---

Ready to begin Sprint 2 implementation? Let's start with the advanced bundle optimization configuration!
