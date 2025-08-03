"use client";
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, ChefHat, Leaf, Shield } from 'lucide-react';

interface MenuItem {
  name: string;
  price: string;
  description?: string;
  gluten_free?: boolean;
  vegetarian?: boolean;
}

interface MenuData {
  restaurant: string;
  hours: {
    kitchen: {
      monday_friday: string;
      saturday: string;
      sunday: string;
    };
    bar: {
      monday_thursday: string;
      friday_saturday: string;
      sunday: string;
    };
  };
  menu: {
    [key: string]: MenuItem[];
  };
}

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof menuData.menu>('starters');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGlutenFree, setShowGlutenFree] = useState(false);

  const menuData: MenuData = {
    restaurant: "Old Crown Girton",
    hours: {
      kitchen: {
        monday_friday: "12PM-3PM & 5PM-10PM",
        saturday: "12PM-10PM",
        sunday: "12PM-9PM"
      },
      bar: {
        monday_thursday: "12PM-10PM",
        friday_saturday: "12PM-11PM",
        sunday: "12PM-10PM"
      }
    },
    menu: {
      starters: [
        { name: "Onion Bhaji", price: "£4.25", gluten_free: true },
        { name: "Samosas (Veg/Meat)", price: "£4.50" },
        { name: "Chilli Mogo", price: "£5.25", gluten_free: true },
        { name: "Samosa Chaat", price: "£5.50" },
        { name: "Garlic Mushroom", price: "£5.75", gluten_free: true },
        { name: "Momo (Veg)", price: "£6.25", description: "Famous traditional Nepalese dumplings made with various seasonal vegetables." },
        { name: "Stuff Tandoori Mushroom", price: "£6.25", gluten_free: true },
        { name: "Chilli Paneer", price: "£6.25", gluten_free: true },
        { name: "Chicken Pakora", price: "£6.25" },
        { name: "Fish Pakora", price: "£6.25" },
        { name: "Crispy Squid", price: "£6.50" },
        { name: "Chicken Wings", price: "£6.75", gluten_free: true },
        { name: "Momo (Chicken)", price: "£6.75", description: "Made with chicken mince and herbs" },
        { name: "Chilli Chicken", price: "£7.00" },
        { name: "Crispy Hot Wings", price: "£7.25" },
        { name: "Chicken Tikka", price: "£7.50", gluten_free: true },
        { name: "Sheek Kebab", price: "£7.50", gluten_free: true },
        { name: "Lamb Chops", price: "£8.25", gluten_free: true },
        { name: "Battered King Prawn", price: "£8.50" }
      ],
      mixed_grills: [
        { name: "Galley's Veg Grill", price: "£11.00", description: "Onion bhaji, mogo, samosas and paneer" },
        { name: "Small Mixed Grill", price: "£12.00", description: "Chicken wings, chicken tikka, sheekh kebab, chicken pakora" },
        { name: "Regular Mixed Grill", price: "£15.00", description: "Same as our small mixed grill plus lamb chops" },
        { name: "Large Mixed Grill", price: "£18.00", description: "Same as our regular mixed grill plus, Kathmandu Tikka and fish pakora" },
        { name: "Xtra Large Special Mixed Grill", price: "£22.00", description: "Same as our large mixed grill plus king prawn" }
      ],
      old_crown_speciality_dishes: [
        { name: "Bhutuwa (chicken/lamb)", price: "£12.00/13.00", description: "Traditional Nepalese speciality cooked with dried crushed chilli and crushed garlic", gluten_free: true },
        { name: "Lasun Kukhura Khursani (LKK/LLK)", price: "£12.00/13.00", description: "Tender pieces of chicken cooked with garlic, crushed chilli, spring onions, fresh cream in the chef's special Nepalese sauce", gluten_free: true },
        { name: "Kathmandu Tikka (Served in Grill)", price: "£13.00", description: "Succulent chicken breast cubes marinated in cheese and cream with a hint of crushed black peppers.", gluten_free: true },
        { name: "Paneer Saslick", price: "£13.00", description: "Soft cheese cooked in tandoor oven served in sizzler with onion and peppers", gluten_free: true },
        { name: "Chicken Rum Rum", price: "£13.00", description: "Must try Nepalese dish. Chicken cooked with himalayan herbs, nepalese black peppers", gluten_free: true },
        { name: "Khasi Ko Masu (Goat Curry)", price: "£13.50", description: "A rich and flavoursome slow cooked goat curry with unique blend of Nepalese spices.", gluten_free: true },
        { name: "Rack of Lamb", price: "£14.00", description: "Lamb chops marinated overnight to give extra softness and tender, cooked in tandoor", gluten_free: true },
        { name: "Special Butter Chicken", price: "£14.00", description: "One butter chicken is irresistibly creamy with mothy flavour and a hint of chilli. Fancy a mild one? Let us know.", gluten_free: true },
        { name: "Himali Lamb", price: "£14.00", description: "Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint, green chilli and Nepalese spice", gluten_free: true },
        { name: "Pokhareli Fish Curry", price: "£14.00", description: "Another traditional flavourful curry with a hint of mustard, coconut milk, exhilarating", gluten_free: true },
        { name: "Rara King Prawn", price: "£15.00", description: "King prawn cooked in coconut based medium sauce with blend of Nepalese spices, turmeric and mustard" },
        { name: "Salmon Tikka", price: "£16.00", description: "Pieces of salmon flavoured with cumin seeds and chargrilled in tandoor.", gluten_free: true },
        { name: "Tandoori King Prawn", price: "£18.00", description: "King prawn marinated in nepalese spices and herbs and cooked in tandoor.", gluten_free: true },
        { name: "Lamb Shank", price: "£20.00", description: "Absolutely delicious and succulent, this LAMB dish is to die for or shall we say to live for!", gluten_free: true }
      ],
      dum_biryani: [
        { name: "Veggie Biryani", price: "£13.00", description: "A well seasoned one pot dish, made by layering fragrant basmati rice" },
        { name: "Chicken Biryani", price: "£14.00", description: "A well seasoned one pot dish, made by layering fragrant basmati rice" },
        { name: "Lamb Biryani", price: "£15.00", description: "A well seasoned one pot dish, made by layering fragrant basmati rice" },
        { name: "King Prawn Biryani", price: "£16.00", description: "A well seasoned one pot dish, made by layering fragrant basmati rice" }
      ],
      sides: [
        { name: "Tadka Daal (Lentil)", price: "£6.00" },
        { name: "Gurkha Aalo", price: "£6.00", description: "Dry potato cooked in Nepalese special herbs" },
        { name: "Saag Aalo", price: "£6.00", description: "Spinach and potato" },
        { name: "Chana Masala", price: "£6.00", description: "Chickpeas" },
        { name: "Saag Bhaji", price: "£6.00", description: "Spinach" },
        { name: "Mushroom Bhaji", price: "£6.00" },
        { name: "Saag Paneer", price: "£6.50", description: "Fresh spinach and cottage cheese" },
        { name: "Matar Paneer", price: "£6.50", description: "Green peas and cottage cheese" },
        { name: "Special Veggie Tarkari", price: "£11.00", description: "Nepalese style vegetarian semi dry curry cooked with aromatic spices and herbs full of flavours", vegetarian: true, gluten_free: true }
      ],
      rice: [
        { name: "Boiled Rice", price: "£4.00" },
        { name: "Pilau Rice", price: "£4.50" },
        { name: "Mushroom Rice", price: "£4.75" },
        { name: "Egg Fried Rice", price: "£4.75" },
        { name: "Special Rice", price: "£5.50" }
      ],
      naans: [
        { name: "Roti", price: "£3.50" },
        { name: "Plain", price: "£3.75" },
        { name: "Garlic", price: "£4.25" },
        { name: "Garlic Chilli", price: "£4.75" },
        { name: "Peshwari", price: "£4.75" },
        { name: "Cheese", price: "£4.75" },
        { name: "Keema", price: "£4.75" },
        { name: "Signature", price: "£5.25" }
      ],
      pub_classics: [
        { name: "Chicken Strips with Chips", price: "£9.00" },
        { name: "Peri-Peri Chicken with Chips", price: "£9.00" },
        { name: "Fish & Chips", price: "£12.00", description: "Medium battered cod fish served with tartar sauce" }
      ],
      burgers: [
        { name: "Veg/Vegan", price: "£9.00", description: "served with chips" },
        { name: "Chicken", price: "£10.00", description: "served with chips" },
        { name: "Beef", price: "£11.00", description: "served with chips" }
      ],
      wraps: [
        { name: "Cheesy Chips Wrap", price: "£7.00", description: "Our wraps are served with chips, salad, mayo and sweet chilli sauce" },
        { name: "Sweet Chilli Wrap (Crispy)", price: "£7.75", description: "Our wraps are served with chips, salad, mayo and sweet chilli sauce" },
        { name: "Chicken Tikka Wrap", price: "£8.50", description: "Our wraps are served with chips, salad, mayo and sweet chilli sauce" },
        { name: "Kebab Wrap", price: "£8.75", description: "Our wraps are served with chips, salad, mayo and sweet chilli sauce" },
        { name: "Special Wrap (Mix)", price: "£9.75", description: "Our wraps are served with chips, salad, mayo and sweet chilli sauce" }
      ],
      kids_menu: [
        { name: "Popcorn Chicken", price: "£5.75", description: "Choose either chips or rice" },
        { name: "Nuggets", price: "£6.00", description: "Choose either chips or rice" },
        { name: "Scampi", price: "£6.00", description: "Choose either chips or rice" },
        { name: "Chicken Pakora", price: "£6.00", description: "Choose either chips or rice" },
        { name: "CTM/Korma", price: "£7.50", description: "Choose either chips or rice" }
      ],
      desserts: [
        { name: "Gulab Jamun", price: "£4.50" },
        { name: "Nepalese Rice Pudding (Kheer)", price: "£4.50" },
        { name: "Chocolate Fondant", price: "£4.50", description: "(chocolate sponge with chocolate liquid in the middle)" },
        { name: "Punky Ice Cream", price: "£5.00", description: "(Kiddies ice cream)" },
        { name: "Vanilla and Honey Toffee Ice Cream", price: "£6.50" }
      ]
    }
  };

  const categories = [
    { key: 'starters', name: '🥗 Starters', icon: '🥗' },
    { key: 'mixed_grills', name: '🔥 Mixed Grills', icon: '🔥' },
    { key: 'old_crown_speciality_dishes', name: '👑 Specialities', icon: '👑' },
    { key: 'dum_biryani', name: '🍚 Biryani', icon: '🍚' },
    { key: 'sides', name: '🥘 Sides', icon: '🥘' },
    { key: 'rice', name: '🍚 Rice', icon: '🍚' },
    { key: 'naans', name: '🫓 Naans', icon: '🫓' },
    { key: 'pub_classics', name: '🍺 Pub Classics', icon: '🍺' },
    { key: 'burgers', name: '🍔 Burgers', icon: '🍔' },
    { key: 'wraps', name: '🌯 Wraps', icon: '🌯' },
    { key: 'kids_menu', name: '👶 Kids Menu', icon: '👶' },
    { key: 'desserts', name: '🍰 Desserts', icon: '🍰' }
  ];

  const filteredItems = () => {
    const items = menuData.menu[activeCategory] || [];
    return items.filter((item: MenuItem) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGlutenFree = !showGlutenFree || item.gluten_free;
      return matchesSearch && matchesGlutenFree;
    });
  };

  const formatCategoryName = (key: string) => {
    return categories.find(cat => cat.key === key)?.name || key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
              <ChefHat className="w-8 h-8" />
              Old Crown Girton
            </h1>
            <p className="text-amber-200 mb-4">Authentic Nepalese & Indian Cuisine</p>
            
            {/* Opening Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-black bg-opacity-20 rounded-lg p-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Kitchen Hours
                </h3>
                <p>Mon-Fri: {menuData.hours.kitchen.monday_friday}</p>
                <p>Saturday: {menuData.hours.kitchen.saturday}</p>
                <p>Sunday: {menuData.hours.kitchen.sunday}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Bar Hours
                </h3>
                <p>Mon-Thu: {menuData.hours.bar.monday_thursday}</p>
                <p>Fri-Sat: {menuData.hours.bar.friday_saturday}</p>
                <p>Sunday: {menuData.hours.bar.sunday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGlutenFree(!showGlutenFree)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  showGlutenFree 
                    ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Gluten Free Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-20 z-30 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  activeCategory === category.key
                    ? 'bg-amber-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name.replace(/^[^\s]+ /, '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            {categories.find(cat => cat.key === activeCategory)?.icon}
            {formatCategoryName(activeCategory as string)}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
        </div>

        <div className="grid gap-4">
          {filteredItems().map((item: MenuItem, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      {item.name}
                      {item.gluten_free && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          GF
                        </span>
                      )}
                      {item.vegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          Veg
                        </span>
                      )}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="text-xl font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Important Notes</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>⚠️ If you have any food allergies, please let us know before you order.</p>
              <p>🍽️ We can do bespoke orders - tell us your spice level!</p>
              <p>🔄 Mixed Grill Option: Swap your chicken wings to crispy wings +£1.00</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400">© 2024 Old Crown Girton - Authentic Nepalese & Indian Cuisine</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
