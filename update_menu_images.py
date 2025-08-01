#!/usr/bin/env python3
"""
Update menu-new.json to include image paths for dishes
"""

import json
import re

def normalize_name_to_filename(name):
    """Convert dish name to filename format"""
    # Remove parentheses and contents
    name = re.sub(r'\([^)]*\)', '', name)
    # Remove common words and clean up
    name = name.lower().strip()
    name = re.sub(r'[^\w\s-]', '', name)  # Remove special chars except hyphens
    name = re.sub(r'\s+', '-', name)  # Replace spaces with hyphens
    name = re.sub(r'-+', '-', name)  # Remove multiple hyphens
    name = name.strip('-')  # Remove leading/trailing hyphens
    return name

def get_image_for_dish(dish_name):
    """Map dish names to available image files"""
    normalized = normalize_name_to_filename(dish_name)
    
    # Direct mappings for available images
    image_mappings = {
        'momo': '/dishes/momo.jpg',
        'chicken-tikka': '/dishes/chicken-tikka.jpg',
        'lamb-curry': '/dishes/lamb-curry.jpg',
        'fish-chips': '/dishes/fish-chips.jpg',
        'biryani': '/dishes/biryani.jpg',
        'salmon': '/dishes/salmon.jpg',
        'dal-bhat': '/dishes/dal-bhat.jpg',
        'thali': '/dishes/thali.jpg',
        'onion-bhaji': '/dishes/onion-bhaji.jpg',
        'veg-samosas': '/dishes/veg-samosas.jpg',
        'chicken-tikka-masala': '/dishes/chicken-tikka-masala.jpg',
        'curry-selection': '/dishes/curry-selection.jpg',
        'tandoori-platter': '/dishes/tandoori-platter.jpg'
    }
    
    # Check direct match first
    if normalized in image_mappings:
        return image_mappings[normalized]
    
    # Check partial matches
    for key, path in image_mappings.items():
        if key in normalized or normalized in key:
            return path
        # Check if any word from the dish name matches
        dish_words = normalized.split('-')
        key_words = key.split('-')
        if any(word in key_words for word in dish_words if len(word) > 3):
            return path
    
    # Default fallbacks based on category
    if any(word in normalized for word in ['chicken', 'tikka']):
        return '/dishes/chicken-tikka.jpg'
    elif any(word in normalized for word in ['lamb', 'mutton']):
        return '/dishes/lamb-curry.jpg'
    elif any(word in normalized for word in ['fish', 'salmon']):
        return '/dishes/salmon.jpg'
    elif any(word in normalized for word in ['curry', 'masala']):
        return '/dishes/curry-selection.jpg'
    elif any(word in normalized for word in ['biryani', 'rice']):
        return '/dishes/biryani.jpg'
    elif any(word in normalized for word in ['dal', 'dhal']):
        return '/dishes/dal-bhat.jpg'
    elif any(word in normalized for word in ['tandoori']):
        return '/dishes/tandoori-platter.jpg'
    elif any(word in normalized for word in ['samosa']):
        return '/dishes/veg-samosas.jpg'
    elif any(word in normalized for word in ['onion', 'bhaji']):
        return '/dishes/onion-bhaji.jpg'
    else:
        return '/dishes/curry-selection.jpg'  # Default fallback

def main():
    # Load the menu
    with open('menu-new.json', 'r') as f:
        menu_data = json.load(f)
    
    # Process each section
    sections_to_process = [
        'starters', 'mixed_grills', 'old_crown_speciality_dishes', 
        'home_made_authentic_dishes', 'dum_biryani', 'sides', 
        'pub_classics', 'burgers', 'desserts'
    ]
    
    for section in sections_to_process:
        if section in menu_data['menu']:
            for item in menu_data['menu'][section]:
                if isinstance(item, dict) and 'name' in item:
                    image_path = get_image_for_dish(item['name'])
                    item['image'] = image_path
                    print(f"Added image for {item['name']}: {image_path}")
    
    # Save updated menu
    with open('menu-new.json', 'w') as f:
        json.dump(menu_data, f, indent=2)
    
    print("\nMenu updated with image paths!")

if __name__ == "__main__":
    main()
