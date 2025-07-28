#!/bin/bash

# Restaurant Data Migration Script
# This script helps migrate from current fragmented data to unified template structure

echo "🏗️  Restaurant Data Migration Helper"
echo "=================================="

# Check if template exists
if [ ! -f "data/templates/restaurant-template.json" ]; then
    echo "❌ Template file not found. Please ensure restaurant-template.json exists in data/templates/"
    exit 1
fi

echo "✅ Found restaurant template"

# Check current data files
CURRENT_FILES=()
if [ -f "data/restaurant.json" ]; then
    CURRENT_FILES+=("restaurant.json")
fi
if [ -f "data/menu-new.json" ]; then
    CURRENT_FILES+=("menu-new.json")
fi

echo "📁 Current production files found: ${CURRENT_FILES[*]}"

# Create backup
BACKUP_DIR="data/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

for file in "${CURRENT_FILES[@]}"; do
    if [ -f "data/$file" ]; then
        cp "data/$file" "$BACKUP_DIR/"
        echo "💾 Backed up data/$file to $BACKUP_DIR/"
    fi
done

echo ""
echo "🎯 Migration Steps:"
echo "1. Current data backed up to: $BACKUP_DIR"
echo "2. Use data/templates/restaurant-template.json as reference"
echo "3. Update components to use unified structure"
echo "4. Test thoroughly before removing legacy files"
echo ""
echo "📝 Template benefits:"
echo "   • Modular structure for easy editing"
echo "   • Consistent data formats"
echo "   • SEO-ready with schema markup"
echo "   • Scalable for multi-location expansion"
echo ""
echo "✨ Migration complete! Review the changes and update your components."
