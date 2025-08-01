# Restaurant Data Organization

This folder contains all restaurant data files organized in a clean, maintainable structure.

## Folder Structure

```
data/
├── README.md                    # This documentation file
├── restaurant.json             # Current comprehensive business data
├── menu-new.json              # Current production menu data (validated)
├── templates/                 # Template files for reusability
│   └── restaurant-template.json # Unified restaurant data template
├── legacy/                    # Archived/legacy data files
│   ├── menu.json             # Legacy menu format (hierarchical)
│   ├── menu2.json            # Legacy menu format (restaurant-embedded)
│   ├── old_crown_menu.json   # Original menu data

└── docs/                      # Documentation and analysis
    └── restaurant-template-analysis.md # Template design analysis
```

## File Descriptions

### Production Files
- **`restaurant.json`**: Comprehensive business data including contact info, hours, social media, testimonials, and events
- **`menu-new.json`**: Current validated menu data used in production (525 lines, 100% accurate)

### Template Files
- **`restaurant-template.json`**: Unified, modular template that consolidates all restaurant data into easily editable sections

### Legacy Files
- **`menu.json`**: Original hierarchical menu structure with subcategories
- **`menu2.json`**: Restaurant-centric structure with embedded contact info
- **`old_crown_menu.json`**: Menu-focused legacy data (524 lines)


### Documentation
- **`restaurant-template-analysis.md`**: Comprehensive analysis of data architecture patterns and template design principles

## Usage Guidelines

### For Current Operations
- Use `restaurant.json` for business information (contact, hours, social media)
- Use `menu-new.json` for current menu data
- Reference `templates/restaurant-template.json` for new implementations

### For Development
- The template in `templates/` provides the recommended structure for future development
- Legacy files in `legacy/` are kept for reference but should not be used in production
- Documentation in `docs/` explains the rationale behind the template design

### For Content Updates
1. **Menu Changes**: Update `menu-new.json` directly
2. **Business Info**: Update `restaurant.json` for contact details, hours, etc.
3. **New Features**: Consider migrating to the unified template structure

## Migration Path

The repository is ready for migration from fragmented data sources to the unified template:

1. **Phase 1**: Continue using current production files (`restaurant.json`, `menu-new.json`)
2. **Phase 2**: Gradually migrate components to use the unified template structure
3. **Phase 3**: Replace fragmented data with single source of truth from template

## Template Benefits

The unified template provides:
- ✅ **Modular Structure**: Independent sections for easy editing
- ✅ **Scalability**: Supports multiple locations and business growth
- ✅ **Consistency**: Standardized formats across all data
- ✅ **Type Safety**: Ready for TypeScript implementation
- ✅ **SEO Ready**: Built-in schema.org markup
- ✅ **Multi-platform**: Works across web, mobile, and API integrations

---

*Last updated: July 26, 2025*
*Template version: 1.0*
