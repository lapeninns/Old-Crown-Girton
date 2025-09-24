'use client';
import DishCard from '@/components/restaurant/DishCard';
import Link from '@/lib/debugLink';
import { AutoMarquee } from '@/components/restaurant/AutoMarquee';
import { Images } from '@/src/lib/images';

// Featured dishes using only high-quality real dish images
const featuredDishes = [
  {
    title: 'Crispy Hot Wings',
    description: 'Spiced grilled chicken wings with our signature marinade - perfectly crispy and bursting with flavor',
    price: '£7.25',
    image: Images.dishes.wings,
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Himali Lamb',
    description: 'Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint, green chilli and Nepalese spice',
    price: '£14.00',
    image: Images.dishes.himaliLamb,
    spiceLevel: 'hot' as const,
  },
  {
    title: 'Khasi Ko Masu (Goat Curry)',
    description: 'A rich and flavoursome slow cooked goat on the bone/off the bone with unique blend of Nepalese spices',
    price: '£14.00',
    image: Images.dishes.goatCurry,
    spiceLevel: 'hot' as const,
  },
  {
    title: 'Chicken Bhuna',
    description: 'Traditional spiced curry with tender chicken pieces in a rich, thick sauce',
    price: '£11.00',
    image: Images.dishes.chickenBhuna,
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Chicken Curry',
    description: 'Classic home-style curry with tender chicken in aromatic spices',
    price: '£11.00',
    image: Images.dishes.chickenCurry,
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Vindaloo',
    description: 'Fiery hot curry with potatoes in a tangy, spiced sauce - for the brave!',
    price: '£11.00',
    image: Images.dishes.vindaloo,
    spiceLevel: 'hot' as const,
  }
];

export default function MenuHighlights() {
  return (
    <section className="bg-brand-50 py-16" id="menu-highlights-heading" aria-labelledby="menu-highlights-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-4">
            Our <span className="text-accent-600">Signature</span> Dishes
          </h2>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto">
            A taste of what we offer
          </p>
        </div>

        {/* Infinite horizontal marquee with 6 cards */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <AutoMarquee
            ariaLabel="Signature dishes"
            speedPxPerSec={38}
            direction="right"
            duplicates={2}
          >
            {featuredDishes.map((dish) => (
              <div key={dish.title} className="flex-shrink-0 w-72 md:w-80">
                <DishCard {...dish} />
              </div>
            ))}
          </AutoMarquee>
        </div>

        <div className="text-center">
          <Link
            href="/menu#starters"
            className="inline-block bg-brand-700 hover:bg-brand-800 text-white border-2 border-brand-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-300 focus:ring-offset-2"
            aria-label="View full restaurant menu"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
