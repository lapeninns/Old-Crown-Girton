'use client';

import { motion } from 'framer-motion';
import { PerformantMotionSection, PerformantMotionDiv, performantVariants } from '@/components/motion/DynamicMotion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <PerformantMotionSection 
      className="py-16 bg-neutral-50"
      initial="hidden"
      whileInView="visible"
      variants={performantVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-stout-700 mb-6">
              Welcome to <span className="text-accent">Old Crown</span>
            </h2>
            
            <div className="prose prose-lg text-brand-600 space-y-4">
              <p>Girton’s historic thatched pub just outside Cambridge – blending community heritage with a warmly spiced Nepalese kitchen and familiar British pub comfort.</p>
              <p>Garden space for long summer evenings, cosy interior for winter gatherings, and a welcoming spot for locals, families, students, professionals & visitors.</p>
              <p>Our dual identity means you can explore aromatic Himalayan-inspired dishes while friends opt for classic favourites – shared tables, shared experiences.</p>
            </div>

            {/* Awards Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-brand-50 rounded-lg"
            >
              <h3 className="text-xl font-display font-bold text-stout-700 mb-4">Why Guests Visit</h3>
              <ul className="list-disc pl-5 text-sm text-brand-600 space-y-1">
                <li>Distinctive thatched setting & village feel</li>
                <li>Authentic Nepalese flavour + pub classics</li>
                <li>Inclusive for mixed groups & families</li>
                <li>Close to Girton College / north Cambridge</li>
                <li>Garden & seasonal community events</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/restaurant-interior.jpg"
                alt="Old Crown restaurant interior"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-accent-500 text-neutral-900 p-4 rounded-full shadow-lg"
            >
              <span className="text-2xl">🍽️</span>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-crimson-600 text-white p-4 rounded-full shadow-lg"
            >
              <span className="text-2xl">🌶️</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PerformantMotionSection>
  );
}
