'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-crown-slate mb-6">
              Welcome to <span className="text-crown-gold">Old Crown</span>
            </h2>
            
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Located in the charming village of Girton, just 3 miles from Cambridge city center, 
                the Old Crown offers a unique dining experience that bridges the flavors of Nepal 
                with traditional British pub classics.
              </p>
              
              <p>
                Our beautiful terrace garden provides the perfect setting for al fresco dining, 
                while our warm, welcoming interior creates an intimate atmosphere for any occasion. 
                Whether you&apos;re looking for an authentic taste of the Himalayas or comforting pub fare, 
                our talented chefs use only the freshest ingredients and time-honored recipes.
              </p>
              
              <p>
                As part of the Le Papillon Inns group, we&apos;re committed to providing exceptional 
                hospitality and unforgettable dining experiences. Join us for lunch, dinner, 
                or just a drink in our cozy bar.
              </p>
            </div>

            {/* Awards Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-crown-cream rounded-lg"
            >
              <h3 className="text-xl font-display font-bold text-crown-slate mb-4">
                🏆 Awards & Recognition
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">🌱</span>
                  <span>BII Sustainability Champion</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-crown-gold">⭐</span>
                  <span>4.8/5 Customer Rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-600">🍺</span>
                  <span>CAMRA Recommended</span>
                </div>
              </div>
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
              className="absolute -top-4 -right-4 bg-crown-gold text-white p-4 rounded-full shadow-lg"
            >
              <span className="text-2xl">🍽️</span>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-crown-red text-white p-4 rounded-full shadow-lg"
            >
              <span className="text-2xl">🌶️</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
