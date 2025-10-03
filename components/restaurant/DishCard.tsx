'use client';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { v } from '@/components/variants';

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
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : v.fadeUp;
  return (
    <motion.div className="bg-white rounded-2xl sm:rounded-xl shadow-lg overflow-hidden hover-lift gpu-fix" variants={itemVariant as any} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-10% 0%' }} whileHover={{ y: -2, scale: 1.01 }} transition={{ duration: 0.18 }}>
      <div className="relative h-44 sm:h-48 w-full">
        <Image
          src={image}
          alt={`${title} - authentic Nepalese cuisine at The Old Crown Girton Cambridge`}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-2">
          {isVegetarian && (
            <span className="bg-cardamom-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
              Vegetarian
            </span>
          )}
          {spiceLevel && (
            <span className={`text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
              spiceLevel === 'mild' ? 'bg-cardamom-400' :
              spiceLevel === 'medium' ? 'bg-accent-500' : 'bg-crimson-500'
            }`}>
              {spiceLevel === 'mild' ? '🌶️' : spiceLevel === 'medium' ? '🌶️🌶️' : '🌶️🌶️🌶️'}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-accent text-white text-sm sm:text-lg font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {price}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-display font-bold text-stout-700 mb-2 break-words hyphens-auto" lang="en">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 mb-4 line-clamp-2">
          {description}
        </p>
        <motion.a
          href="tel:01223 277217"
          className="block w-full text-center bg-accent text-white font-medium py-2 px-4 rounded-lg text-sm sm:text-base"
          {...v.button}
        >
          📞 Call to Order
        </motion.a>
      </div>
    </motion.div>
  );
}
