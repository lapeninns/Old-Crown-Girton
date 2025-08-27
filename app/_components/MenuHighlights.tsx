'use client';

import { motion } from 'framer-motion';
import DishCard from '@/components/restaurant/DishCard';
import Link from 'next/link';
import { useHomeContent } from '../_content/useHomeContent';

export default function MenuHighlights() {
  const content = useHomeContent();
  
  if (!content) {
    return (
      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const { menuHighlights } = content;
  
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
            {menuHighlights.title.split(menuHighlights.titleAccent)[0]}
            <span className="text-accent">{menuHighlights.titleAccent}</span>
            {menuHighlights.title.split(menuHighlights.titleAccent)[1]}
          </h2>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto">
            {menuHighlights.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {menuHighlights.featuredDishes.map((dish, index) => (
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
            href={menuHighlights.ctaLink}
            className="inline-block bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            {menuHighlights.ctaLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}