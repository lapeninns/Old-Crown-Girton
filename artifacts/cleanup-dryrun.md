# Repository Cleanup Dry-Run Analysis Report
Generated: 2025-08-26

## Executive Summary
**Critical Issues Found**: 147 violations across color usage patterns
**Files Affected**: 35+ source files
**Primary Violations**: Hard-coded hex colors in CSS custom properties, RGB/RGBA usage, and default Tailwind color classes

## Color Standardization Issues

### 1. Hard-coded Hex Colors (CSS Custom Properties)
**Status**: ACCEPTABLE - These are Himalayan Spice design tokens
**Files**: `app/globals.css`, `styles/accessibility.css`, `design-system/css/button.css`
**Analysis**: These hex values define the Himalayan Spice color palette. Per memory knowledge, these ARE the design tokens that other colors should reference.
**Action**: KEEP - These are the canonical source of design tokens

### 2. RGB/RGBA Usage in CSS
**Status**: NEEDS REPLACEMENT
**Count**: 25+ instances
**Files Affected**:
- `app/globals.css` (shadow definitions)
- `styles/accessibility.css` (overlay colors)
- `components/restaurant/sections/ContactFeaturesSection.tsx`
- `components/restaurant/sections/RegularEventsSection.tsx`

**Examples**:
```css
--shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.07);
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
backgroundColor: "rgba(0, 0, 0, 0.02)"
```

### 3. Default Tailwind Colors in Components
**Status**: HIGH PRIORITY - NEEDS REPLACEMENT
**Count**: 80+ instances across 25+ files
**Critical Violations**:

#### Gray Color Usage (Performance Dashboard):
```tsx
// components/restaurant/sections/PerformanceDashboard.tsx
<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
<p className="text-sm text-gray-500 mt-1">
```

#### Generic White/Black Usage:
- `text-white`: 60+ instances
- `bg-white`: 25+ instances  
- `text-black`: 5+ instances
- `bg-black`: 3+ instances

## Import Analysis

### Unused Imports Scan
**Command**: `grep -r "^import.*from" --include="*.ts" --include="*.tsx" . | grep -v "use"`
**Status**: NEEDS DETAILED ANALYSIS
**Preliminary Findings**: Multiple files contain imports that may not be used

### Large Components for Dynamic Loading
**Candidates Identified**:
- `components/restaurant/sections/PerformanceDashboard.tsx` (complex dashboard)
- `components/menu/MenuInteractive.tsx` (interactive filtering)
- `components/slideshow/` directory (image-heavy components)

## Security Validation

### Protected Areas Verified
✅ `/app/api/webhook/` - No changes planned
✅ `/app/api/auth/` - No changes planned  
✅ `/data/` - No changes planned
✅ `middleware.ts` - No changes planned
✅ Zod schema files - No changes planned

### Component Analysis Risk Assessment
**Low Risk**: UI color changes in presentation components
**Medium Risk**: Accessibility color changes (requires WCAG compliance verification)
**High Risk**: Any changes near authentication or payment flows

## Recommended Action Plan

### Phase 1: RGB/RGBA Replacement (Low Risk)
1. Replace shadow definitions with CSS custom properties
2. Update accessibility overlay colors
3. Convert inline style RGB/RGBA to CSS variables

### Phase 2: Tailwind Color Migration (Medium Risk)
1. Replace gray colors with neutral palette
2. Standardize white/black usage with semantic tokens
3. Update component classes systematically

### Phase 3: Import Optimization (Low Risk)
1. Remove unused imports
2. Implement dynamic loading for large components
3. Optimize bundle splitting

## Expected Improvements
- **Bundle Size**: 5-10% reduction from unused code removal
- **Color Consistency**: 100% Himalayan Spice compliance
- **Maintainability**: Centralized color management
- **Performance**: Lazy loading for non-critical components

## Risk Mitigation
- Atomic commits per file/component
- Full test suite execution after each phase
- Visual regression testing via screenshots
- Rollback plan documented for each change

## Files Requiring Changes

### High Priority (Color Violations)
1. `components/restaurant/sections/PerformanceDashboard.tsx` - Gray colors
2. `components/menu/MenuSearchFilter.tsx` - Generic whites
3. `components/restaurant/OptimizedMenuItem.tsx` - Mixed color usage
4. `app/globals.css` - RGB shadow definitions
5. `styles/accessibility.css` - RGBA overlays

### Medium Priority (Optimization)
6. `components/slideshow/Slide.tsx` - Dynamic loading candidate
7. `components/menu/MenuInteractive.tsx` - Bundle optimization
8. Multiple files - Unused import cleanup

### Total Estimated Files: 35+
### Total Estimated Changes: 150+

---
**Next Steps**: Execute Phase 1 changes with full validation pipeline