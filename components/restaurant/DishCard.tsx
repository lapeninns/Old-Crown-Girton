'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface DishCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  isVegetarian?: boolean;
  delay?: number;
}

export default function DishCard({
  title,
  description,
  price,
  image,
  spiceLevel,
  isVegetarian,
  delay = 0,
}: DishCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isVegetarian && (
            <span className="bg-indiagreen-500 text-neutral-50 text-xs px-2 py-1 rounded-full font-medium">
              Vegetarian
            </span>
          )}
          {spiceLevel && (
            <span className={`text-neutral-50 text-xs px-2 py-1 rounded-full font-medium ${
              spiceLevel === 'mild' ? 'bg-cardamom-500' :
              spiceLevel === 'medium' ? 'bg-marigold-500' : 'bg-crimson-500'
            }`}>
              {spiceLevel === 'mild' ? '🌶️' : spiceLevel === 'medium' ? '🌶️🌶️' : '🌶️🌶️🌶️'}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3">
          <span className="bg-accent-500 text-neutral-900 text-lg font-bold px-3 py-1 rounded-full">
            {price}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-brand-800 mb-2">
          {title}
        </h3>
        <p className="text-brand-600 mb-4 line-clamp-2">
          {description}
        </p>
        <a
          href="tel:01223276027"
          className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-neutral-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          📞 Call to Order
        </a>
      </div>
    </motion.div>
  );
}
