# Ultra-Deep Data Architecture Analysis: Old Crown Restaurant Template

## Executive Summary
After comprehensive analysis of 6 JSON data sources (menu-new.json, data/restaurant.json, Menu/old_crown_menu.json, menu.json, menu2.json, old_crown_menu_validated.json), this document presents a unified, modular, and scalable JSON template structure that consolidates all restaurant data into easily editable sections.

## Data Source Analysis

### Current Data Fragmentation
1. **menu-new.json** (525 lines) - Production menu data with hours and notes
2. **data/restaurant.json** (218 lines) - Comprehensive business data with contact, social media, testimonials, events
3. **Menu/old_crown_menu.json** (524 lines) - Menu-focused data similar to menu-new.json
4. **menu.json** (569 lines) - Hierarchical menu structure with subcategories
5. **menu2.json** (527 lines) - Restaurant-centric structure with embedded contact info
6. **old_crown_menu_validated.json** (533 lines) - Cleaned menu data with standardized formatting

### Key Data Patterns Identified

#### Restaurant Identity & Branding
- Restaurant name consistency: "Old Crown Girton" across all sources
- Logo and hero image references in data/restaurant.json
- Brand colors and styling information present

#### Contact Information Patterns
- **Phone**: 01223 276027 (consistent across sources)
- **Email**: info@oldcrowngirton.co.uk
- **Address**: High Street, Girton, Cambridge CB3 0QQ
- **Hours**: Complex multi-format patterns (kitchen vs bar hours)

#### Menu Data Structures
- **Hierarchical**: Categories → Subcategories → Items (menu.json pattern)
- **Flat Array**: Direct category-item relationship (menu-new.json pattern)
- **Restaurant-Embedded**: Menu as property of restaurant object (menu2.json pattern)

#### Business Information Architecture
- **Social Media**: Facebook, Instagram, Twitter links
- **Testimonials**: Customer reviews with ratings and names
- **Events**: Special occasions with descriptions and dates
- **Gallery**: Multiple image categories (dishes, restaurant, events)

## Template Design Principles

### 1. Modularity
Each section should be independently editable without affecting others:
- Restaurant details
- Contact information
- Menu items
- Images and gallery
- Events and testimonials
- Social media and SEO

### 2. Scalability
Structure should accommodate:
- Multiple restaurant locations
- Seasonal menu changes
- Event additions
- Gallery expansions
- New social media platforms

### 3. Consistency
Standardized formats for:
- Pricing (always £X.XX format)
- Phone numbers (international format capability)
- Hours (consistent time format)
- Image paths (relative to public directory)

### 4. Flexibility
Support for:
- Multiple languages
- Dietary restrictions (GF, V, VE indicators)
- Price variations (lunch/dinner pricing)
- Seasonal availability

## Recommended Template Structure

```json
{
  "restaurant": {
    "identity": {
      "name": "Old Crown Girton",
      "tagline": "Authentic Indian & Nepalese Cuisine",
      "description": "Traditional flavors meets modern dining",
      "established": "2010",
      "type": "Indian & Nepalese Restaurant"
    },
    "contact": {
      "phone": {
        "primary": "+44 1223 276027",
        "display": "01223 276027"
      },
      "email": {
        "primary": "info@oldcrowngirton.co.uk",
        "bookings": "bookings@oldcrowngirton.co.uk"
      },
      "address": {
        "street": "High Street",
        "area": "Girton",
        "city": "Cambridge",
        "postcode": "CB3 0QQ",
        "country": "UK",
        "coordinates": {
          "lat": 52.2434,
          "lng": 0.0838
        }
      }
    },
    "hours": {
      "kitchen": {
        "monday": "12:00-15:00,17:00-22:00",
        "tuesday": "12:00-15:00,17:00-22:00",
        "wednesday": "12:00-15:00,17:00-22:00",
        "thursday": "12:00-15:00,17:00-22:00",
        "friday": "12:00-15:00,17:00-22:00",
        "saturday": "12:00-22:00",
        "sunday": "12:00-21:00"
      },
      "bar": {
        "monday": "12:00-22:00",
        "tuesday": "12:00-22:00",
        "wednesday": "12:00-22:00",
        "thursday": "12:00-22:00",
        "friday": "12:00-23:00",
        "saturday": "12:00-23:00",
        "sunday": "12:00-22:00"
      }
    },
    "social": {
      "facebook": "https://facebook.com/oldcrowngirton",
      "instagram": "https://instagram.com/oldcrowngirton",
      "twitter": "https://twitter.com/oldcrowngirton",
      "website": "https://oldcrowngirton.co.uk"
    }
  },
  "menu": {
    "metadata": {
      "last_updated": "2024-01-15",
      "version": "2.1",
      "currency": "GBP",
      "allergen_info": "If you have any food allergies, please let us know before you order",
      "notes": [
        "Please be aware that although all due care is taken, there is risk of allergen contamination",
        "We can do bespoke orders - tell us your spice level preference"
      ]
    },
    "categories": [
      {
        "id": "starters",
        "name": "Starters",
        "description": "Begin your meal with our authentic appetizers",
        "subcategories": [
          {
            "id": "veg_starters",
            "name": "Vegetarian",
            "items": [
              {
                "id": "onion_bhaji",
                "name": "Onion Bhaji",
                "description": "Traditional crispy onion fritters",
                "price": {
                  "amount": 4.25,
                  "display": "£4.25"
                },
                "dietary": ["GF", "V"],
                "spice_level": 1,
                "image": "dishes/onion-bhaji.jpg",
                "available": true,
                "popular": true
              }
            ]
          }
        ]
      }
    ]
  },
  "gallery": {
    "hero": {
      "main": "hero/restaurant-exterior.jpg",
      "alt": "Old Crown Girton restaurant exterior"
    },
    "categories": {
      "dishes": [
        {
          "src": "dishes/curry-selection.jpg",
          "alt": "Selection of authentic curries",
          "caption": "Our signature curry collection"
        }
      ],
      "restaurant": [
        {
          "src": "restaurant/dining-room.jpg",
          "alt": "Main dining area",
          "caption": "Comfortable dining atmosphere"
        }
      ],
      "events": [
        {
          "src": "events/diwali-celebration.jpg",
          "alt": "Diwali celebration at Old Crown",
          "caption": "Special Diwali menu celebration"
        }
      ]
    }
  },
  "testimonials": [
    {
      "id": "testimonial_1",
      "text": "Absolutely fantastic food and service. The best Indian restaurant in Cambridge!",
      "author": "Sarah M.",
      "rating": 5,
      "date": "2024-01-10",
      "verified": true,
      "platform": "Google Reviews"
    }
  ],
  "events": [
    {
      "id": "diwali_2024",
      "title": "Diwali Celebration Menu",
      "description": "Join us for a special Diwali celebration with traditional festive menu",
      "date": {
        "start": "2024-11-01",
        "end": "2024-11-03"
      },
      "image": "events/diwali-menu.jpg",
      "special_menu": true,
      "booking_required": true
    }
  ],
  "seo": {
    "title": "Old Crown Girton - Authentic Indian & Nepalese Restaurant Cambridge",
    "description": "Experience the finest Indian and Nepalese cuisine in Cambridge. Located in Girton, we offer traditional flavors with modern dining.",
    "keywords": ["Indian restaurant Cambridge", "Nepalese food Girton", "curry house", "authentic spices"],
    "schema": {
      "@type": "Restaurant",
      "name": "Old Crown Girton",
      "cuisine": ["Indian", "Nepalese"],
      "priceRange": "££"
    }
  },
  "features": {
    "takeaway": true,
    "delivery": true,
    "reservations": true,
    "private_dining": false,
    "outdoor_seating": false,
    "parking": true,
    "accessibility": true,
    "payment_methods": ["cash", "card", "contactless"]
  },
  "delivery": {
    "radius": "5 miles",
    "minimum_order": 15.00,
    "delivery_fee": 2.50,
    "estimated_time": "30-45 minutes",
    "partners": ["Deliveroo", "Just Eat", "Uber Eats"]
  }
}
```

## Implementation Benefits

### 1. Easy Content Management
- **Non-technical editing**: Clear structure allows easy updates without coding knowledge
- **Sectioned data**: Each area (menu, contact, events) can be updated independently
- **Version control**: Template supports versioning for tracking changes

### 2. Multi-platform Consistency
- **Website integration**: Direct mapping to React components
- **API compatibility**: RESTful structure for mobile apps
- **Print materials**: Easy export for physical menus
- **Social media**: Structured data for automatic posting

### 3. Scalability Features
- **Multi-location support**: Template can be extended for restaurant chains
- **Seasonal menus**: Easy switching between menu versions
- **Language support**: Structure supports internationalization
- **Event management**: Built-in support for special occasions

### 4. Technical Advantages
- **Type safety**: Clear structure supports TypeScript integration
- **Performance**: Optimized for fast loading and caching
- **SEO optimization**: Built-in schema.org compatibility
- **Analytics**: Structured for tracking user interactions

## Migration Strategy

### Phase 1: Data Consolidation
1. Merge all existing JSON sources into unified template
2. Standardize pricing formats and dietary indicators
3. Validate all contact information and hours
4. Organize image assets into structured gallery

### Phase 2: Component Integration
1. Update React components to use new data structure
2. Implement template-based rendering system
3. Add content management interface for easy editing
4. Test all functionality with new data format

### Phase 3: Enhancement & Optimization
1. Add automated validation for template compliance
2. Implement version control for menu updates
3. Create backup and restore functionality
4. Optimize for performance and SEO

## Template Usage Examples

### Adding New Menu Item
```json
{
  "id": "new_curry_dish",
  "name": "Chef's Special Curry",
  "description": "House specialty with secret spice blend",
  "price": {
    "amount": 12.95,
    "display": "£12.95"
  },
  "dietary": ["GF"],
  "spice_level": 3,
  "image": "dishes/chefs-special.jpg",
  "available": true,
  "popular": false
}
```

### Updating Restaurant Hours
```json
"hours": {
  "kitchen": {
    "monday": "CLOSED",
    "tuesday": "12:00-15:00,17:00-22:00"
  }
}
```

### Adding New Event
```json
{
  "id": "valentines_2024",
  "title": "Valentine's Day Special Menu",
  "description": "Romantic dining experience with special couples menu",
  "date": {
    "start": "2024-02-14",
    "end": "2024-02-14"
  },
  "special_menu": true,
  "booking_required": true
}
```

## Conclusion

This unified template structure provides a robust, scalable, and maintainable foundation for Old Crown Girton's digital presence. By consolidating fragmented data sources into a cohesive, modular format, the restaurant can efficiently manage content updates, ensure consistency across platforms, and easily scale for future growth.

The template balances technical sophistication with user-friendly editing capabilities, making it accessible to both developers and non-technical staff members who need to update restaurant information, menus, and promotional content.
