'use client';

import { motion } from 'framer-motion';
import DishCard from './DishCard';
import Link from 'next/link';

const featuredDishes = [
  {
    title: 'Momo (Chicken)',
    description: 'Famous traditional Nepalese dumplings made with chicken mince and herbs',
    price: '£6.75',
    image: '/dishes/momo.jpg',
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Kathmandu Tikka',
    description: 'Succulent chicken breast cubes marinated in cheese and cream with crushed black peppers',
    price: '£13.00',
    image: '/dishes/chicken-tikka.jpg',
    spiceLevel: 'mild' as const,
  },
  {
    title: 'Himali Lamb',
    description: 'Green curry seasoned with Himalayan salt and yoghurt blend with fresh mint and Nepalese spice',
    price: '£14.00',
    image: '/dishes/lamb-curry.jpg',
    spiceLevel: 'hot' as const,
  },
  {
    title: 'Fish & Chips',
    description: 'Medium battered cod fish served with tartar sauce and hand-cut chips',
    price: '£12.00',
    image: '/dishes/fish-chips.jpg',
  },
  {
    title: 'Dum Biryani (Chicken)',
    description: 'Well seasoned one pot dish, made by layering fragrant basmati rice with spiced chicken',
    price: '£14.00',
    image: '/dishes/biryani.jpg',
    spiceLevel: 'medium' as const,
  },
  {
    title: 'Salmon Tikka',
    description: 'Pieces of salmon flavoured with cumin seeds and char grilled in tandoor',
    price: '£16.00',
    image: '/dishes/salmon.jpg',
  },
];

export default function MenuHighlights() {
  return (
    <section className="py-16 bg-crown-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-crown-slate mb-4">
            Our <span className="text-crown-gold">Signature</span> Dishes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From authentic Nepalese specialties to beloved pub classics, 
            every dish is prepared with fresh ingredients and traditional techniques.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredDishes.map((dish, index) => (
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
            className="inline-block bg-crown-gold hover:bg-crown-gold-dark text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            View Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
