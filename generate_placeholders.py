#!/usr/bin/env python3
"""
Generate placeholder images for the Restaurant_BP project
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(width, height, text, filename, bg_color=(212, 148, 30), text_color=(255, 255, 255)):
    """Create a placeholder image with text"""
    # Create image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, fallback to default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", 36)
        except:
            font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center text
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill=text_color, font=font)
    
    # Save image
    img.save(filename, 'JPEG', quality=85)
    print(f"Created: {filename}")

def main():
    # Ensure directories exist
    os.makedirs("public/dishes", exist_ok=True)
    os.makedirs("public/restaurant", exist_ok=True)
    os.makedirs("public/events", exist_ok=True)
    os.makedirs("public/logos", exist_ok=True)
    os.makedirs("public/hero", exist_ok=True)
    
    # Dish images (800x600)
    dishes = [
        ("momo", "Nepalese Momo"),
        ("chicken-tikka", "Chicken Tikka"),
        ("lamb-curry", "Lamb Curry"),
        ("fish-chips", "Fish & Chips"),
        ("biryani", "Dum Biryani"),
        ("salmon", "Salmon Tikka"),
        ("dal-bhat", "Dal Bhat"),
        ("thali", "Nepalese Thali"),
        ("onion-bhaji", "Onion Bhaji"),
        ("veg-samosas", "Veg Samosas"),
        ("chicken-tikka-masala", "Chicken Tikka Masala"),
        ("curry-selection", "Curry Selection"),
        ("tandoori-platter", "Tandoori Platter")
    ]
    
    for filename, display_name in dishes:
        create_placeholder(800, 600, display_name, f"public/dishes/{filename}.jpg", 
                         bg_color=(212, 148, 30))  # Crown gold
    
    # Restaurant atmosphere (1200x800)
    restaurant_images = [
        ("dining-room", "Dining Room"),
        ("bar-area", "Bar Area")
    ]
    
    for filename, display_name in restaurant_images:
        create_placeholder(1200, 800, display_name, f"public/restaurant/{filename}.jpg",
                         bg_color=(139, 69, 19))  # Brown
    
    # Event images (800x600)
    events = [
        ("curry-night", "Curry Night"),
        ("quiz-night", "Quiz Night"),
        ("live-music", "Live Music"),
        ("diwali-celebration", "Diwali Celebration"),
        ("diwali-menu", "Diwali Menu"),
        ("mothers-day-special", "Mother's Day Special")
    ]
    
    for filename, display_name in events:
        create_placeholder(800, 600, display_name, f"public/events/{filename}.jpg",
                         bg_color=(75, 0, 130))  # Indigo
    
    # Logo (400x400, PNG with transparency)
    logo_img = Image.new('RGBA', (400, 400), (212, 148, 30, 255))
    draw = ImageDraw.Draw(logo_img)
    
    # Try to get a better font for logo
    try:
        logo_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
    except:
        logo_font = ImageFont.load_default()
    
    # Logo text
    logo_text = "OLD CROWN"
    bbox = draw.textbbox((0, 0), logo_text, font=logo_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (400 - text_width) // 2
    y = (400 - text_height) // 2
    
    draw.text((x, y), logo_text, fill=(255, 255, 255, 255), font=logo_font)
    logo_img.save("public/logos/old-crown-logo.png", 'PNG')
    print("Created: public/logos/old-crown-logo.png")
    
    # Update hero images (1920x1080)
    create_placeholder(1920, 1080, "Old Crown Restaurant", "public/hero-restaurant.jpg",
                     bg_color=(139, 69, 19))
    
    create_placeholder(1920, 1080, "Restaurant Interior", "public/restaurant-interior.jpg",
                     bg_color=(160, 82, 45))
    
    print("\nAll placeholder images generated!")
    print("\nGenerated images:")
    print("- 13 dish images in /dishes/")
    print("- 2 restaurant atmosphere images in /restaurant/")
    print("- 6 event images in /events/")
    print("- 1 logo in /logos/")
    print("- 2 hero images in root public/")

if __name__ == "__main__":
    main()
