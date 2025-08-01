# Implementation Guide: Old Crown Menu Redesign

## Quick Start

The redesigned menu has been implemented and is ready for deployment. Here's everything you need to know to understand, maintain, and extend the new system.

## File Structure

```
app/menu/
├── page.tsx                    # Main menu page with metadata
├── menu-content.tsx           # Original implementation (backup)
├── menu-content-complete.tsx  # New redesigned implementation
└── menu-content-redesigned.tsx # Initial redesign (reference)

components/
├── ui/
│   ├── Card.tsx              # Reusable card component
│   └── EnhancedButton.tsx    # Enhanced button component
└── restaurant/
    ├── Layout.tsx            # Restaurant layout wrapper
    ├── Navbar.tsx           # Main navigation
    └── Footer.tsx           # Footer component

menu-new.json                 # Menu data source
```

## Key Components

### 1. CompleteRedesignedMenu (Main Component)
**Location**: `app/menu/menu-content-complete.tsx`

```typescript
// Main features implemented:
- Advanced search with debouncing
- Multi-criteria filtering
- Favorites system
- Shopping cart functionality
- Responsive design
- Accessibility compliance
- Smooth animations
```

### 2. Inline Components
The main component includes several inline components for better maintainability:

```typescript
// Card Component - Reusable container
const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => {
  // Motion animations and styling
}

// Button Component - Enhanced interactions
const Button: React.FC<ButtonProps> = ({ variant, size, icon, children }) => {
  // Multiple variants and states
}

// Badge Component - Dietary and status indicators
const Badge: React.FC<BadgeProps> = ({ text, type, icon }) => {
  // Color-coded badges with accessibility
}

// MenuItem Component - Rich menu item display
const MenuItem: React.FC<MenuItemProps> = ({ name, description, price }) => {
  // Interactive cards with favorites and cart
}
```

## State Management

The component uses React hooks for comprehensive state management:

```typescript
// Search and filtering
const [searchTerm, setSearchTerm] = useState<string>('');
const [filters, setFilters] = useState<FilterState>({
  dietary: [],
  priceRange: [0, 25],
  category: 'all',
  showFavoritesOnly: false
});

// User preferences
const [favorites, setFavorites] = useState<Set<string>>(new Set());
const [cart, setCart] = useState<Set<string>>(new Set());

// UI state
const [activeSection, setActiveSection] = useState<string>('starters');
const [showFilters, setShowFilters] = useState(false);
const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
```

## Styling System

### Tailwind CSS Classes
The component uses a comprehensive set of Tailwind utilities:

```css
/* Color System */
crown-gold: #D4941E
crown-gold-dark: #B8800F
crown-slate: #475569
crown-cream: #FEF7ED

/* Component Patterns */
.card-base: bg-white rounded-xl border border-gray-100 transition-all duration-300
.button-primary: bg-crown-gold hover:bg-crown-gold-dark text-white focus:ring-crown-gold
.gradient-bg: bg-gradient-to-br from-gray-50 via-white to-crown-cream/30
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
default: 320px+    /* Mobile */
sm:     768px+     /* Tablet */
md:     1024px+    /* Desktop */
lg:     1280px+    /* Large Desktop */
xl:     1536px+    /* Ultra-wide */
```

## Animation System

### Framer Motion Integration
```typescript
// Page entrance animations
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Hover effects
whileHover={{ scale: 1.02, y: -2 }}
whileTap={{ scale: 0.98 }}

// Smooth page transitions
<AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* Filter content */}
    </motion.div>
  )}
</AnimatePresence>
```

## Accessibility Implementation

### WCAG 2.1 AA Features
```typescript
// Focus management
className="focus:outline-none focus:ring-2 focus:ring-crown-gold focus:ring-offset-2"

// ARIA labels
aria-label="Search menu items"
aria-expanded={showFilters}
aria-controls="filter-panel"
role="navigation"

// Semantic HTML
<nav role="navigation" aria-label="Menu categories">
<article role="article" aria-labelledby={`${itemId}-title`}>
<button aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
```

### Screen Reader Support
```typescript
// Status announcements
<span role="status" aria-label={config.label}>
  {/* Badge content */}
</span>

// Descriptive content
<h3 id={`${itemId}-title`} className="...">
  {name}
</h3>
<p id={`${itemId}-description`} className="...">
  {description}
</p>
```

## Performance Optimizations

### React Performance
```typescript
// Memoized computations
const shouldShow = useMemo(() => {
  if (!searchTerm) return true;
  const searchLower = searchTerm.toLowerCase();
  return name.toLowerCase().includes(searchLower) || 
         (description && description.toLowerCase().includes(searchLower));
}, [name, description, searchTerm]);

// Callback optimization
const scrollToSection = useCallback((sectionId: string) => {
  setActiveSection(sectionId);
  // Scroll logic
}, []);

// Effect cleanup
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  return () => observer.disconnect();
}, []);
```

### Image Optimization
```typescript
// Placeholder images with gradients
<div className="w-16 h-16 bg-gradient-to-br from-crown-gold/20 to-crown-gold/10 rounded-xl">
  <ChefHat className="w-6 h-6 text-crown-gold/60" />
</div>
```

## Data Structure

### Menu Data Format
```json
{
  "restaurant": "Old Crown Girton",
  "hours": {
    "kitchen": {
      "monday_friday": "12PM-3PM & 5PM-10PM",
      "saturday": "12PM-10PM",
      "sunday": "12PM-9PM"
    }
  },
  "menu": {
    "starters": [
      {
        "name": "Onion Bhaji",
        "price": "£4.25",
        "description": "Optional description",
        "gluten_free": true,
        "vegetarian": false
      }
    ]
  }
}
```

## Browser Support

### Target Browsers
- Chrome 90+ (95% coverage)
- Safari 14+ (iOS 14+)
- Firefox 88+
- Edge 90+

### Fallback Strategy
```css
/* Progressive enhancement */
.modern-feature {
  /* Modern implementation */
}

@supports not (backdrop-filter: blur(8px)) {
  .fallback {
    /* Fallback styles */
  }
}
```

## Testing Strategy

### Component Testing
```typescript
// Example test structure
describe('CompleteRedesignedMenu', () => {
  test('renders all menu sections', () => {
    render(<CompleteRedesignedMenu />);
    expect(screen.getByText('Starters')).toBeInTheDocument();
  });

  test('search functionality works', () => {
    render(<CompleteRedesignedMenu />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    // Assert filtered results
  });
});
```

### Accessibility Testing
```bash
# Run accessibility audit
npm run test:a11y

# Lighthouse audit
npm run lighthouse

# Manual testing checklist
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] High contrast mode
- [ ] 200% zoom support
```

## Deployment Checklist

### Pre-deployment
- [ ] All TypeScript errors resolved
- [ ] Component tests passing
- [ ] Accessibility audit completed
- [ ] Performance metrics meet targets
- [ ] Cross-browser testing completed

### Environment Variables
```env
# Add any required environment variables
NEXT_PUBLIC_RESTAURANT_NAME="Old Crown Girton"
NEXT_PUBLIC_PHONE_NUMBER="01223276027"
```

### Performance Monitoring
```typescript
// Add performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Future Enhancements

### Phase 2 Features
1. **Online Ordering Integration**
```typescript
// Add order state management
const [order, setOrder] = useState<OrderItem[]>([]);
```

2. **Real-time Menu Updates**
```typescript
// WebSocket integration for live updates
const [menuData, setMenuData] = useState(initialData);
```

3. **Multi-language Support**
```typescript
// i18n integration
import { useTranslation } from 'next-i18next';
const { t } = useTranslation('menu');
```

## Troubleshooting

### Common Issues

1. **Animation Performance**
```typescript
// Reduce motion for users who prefer it
const prefersReducedMotion = useReducedMotion();
const animationProps = prefersReducedMotion ? {} : {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};
```

2. **Mobile Touch Issues**
```css
/* Ensure proper touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

3. **Memory Leaks**
```typescript
// Cleanup effect dependencies
useEffect(() => {
  const cleanup = () => {
    // Cleanup logic
  };
  return cleanup;
}, []);
```

## Support and Maintenance

### Code Organization
- Keep components under 300 lines
- Extract reusable logic into custom hooks
- Maintain consistent naming conventions
- Document complex business logic

### Performance Monitoring
- Monitor Core Web Vitals
- Track user interaction metrics
- Set up error boundary logging
- Implement A/B testing framework

### Accessibility Maintenance
- Regular audit schedule
- User testing with diverse groups
- Keep up with WCAG updates
- Monitor keyboard navigation paths

This implementation provides a solid foundation for the Old Crown Restaurant menu while maintaining extensibility for future enhancements.
