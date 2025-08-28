'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import DishCard from './DishCard';
import Link from 'next/link';

// Featured dishes using only high-quality real dish images
const featuredDishes = [
  {
    title: 'Crispy Hot Wings',
    description: 'Spiced grilled chicken wings with our signature marinade - perfectly crispy and bursting with flavor',
    price: '£7.25',
    image: '/dishes/CrispyHotWings.jpeg',
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Himali Lamb',
    description: 'Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint, green chilli and Nepalese spice',
    price: '£14.00',
    image: '/dishes/HimaliLamb.jpeg',
    spiceLevel: 'hot' as const,
  },
  {
    title: 'Khasi Ko Masu (Goat Curry)',
    description: 'A rich and flavoursome slow cooked goat on the bone/off the bone with unique blend of Nepalese spices',
    price: '£14.00',
    image: '/dishes/GoatCurry.jpeg',
    spiceLevel: 'hot' as const,
  },
  {
    title: 'Chicken Bhuna',
    description: 'Traditional spiced curry with tender chicken pieces in a rich, thick sauce',
    price: '£11.00',
    image: '/dishes/ChickenBhuna.jpeg',
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Chicken Curry',
    description: 'Classic home-style curry with tender chicken in aromatic spices',
    price: '£11.00',
    image: '/dishes/ChickenCurry.jpeg',
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Vindaloo',
    description: 'Fiery hot curry with potatoes in a tangy, spiced sauce - for the brave!',
    price: '£11.00',
    image: '/dishes/Vindalo.jpeg',
    spiceLevel: 'hot' as const,
  },
];

export default function MenuHighlights() {
  const { data: content } = useContent();
  
  // Get menu highlights content from content management or fallback
  const menuHighlightsContent = content?.components?.menuHighlights;
  const title = menuHighlightsContent?.title || 'Our Signature Dishes';
  const subtitle = menuHighlightsContent?.subtitle || 'A taste of what we offer';
  const ctaLabel = content?.global?.ui?.buttons?.viewMenu || 'View Full Menu';
  
  // Use our curated selection of high-quality featured dishes
  const dishesToDisplay = featuredDishes;
  
  return (
    <section className="py-16 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-4">
            Our <span className="text-accent">Signature</span> Dishes
          </h2>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {dishesToDisplay.map((dish, index) => (
            <DishCard
              key={dish.title}
              {...dish}
              delay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/menu"
            className="inline-block bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
