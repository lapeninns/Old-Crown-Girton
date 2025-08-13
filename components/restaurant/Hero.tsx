'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getRestaurantIdentity, getContactInfo, getGallery, getHours } from '@/lib/restaurantData';
import { useParsedData } from '@/hooks/useParsedData';
import { MarketingDataSchema } from '@/lib/schemas';

export default function Hero() {
  const identity = getRestaurantIdentity();
  const contact = getContactInfo();
  const gallery = getGallery();
  const hours = getHours();
  const kitchenWeek = hours?.display?.kitchen?.weekdays;
  const barWeek = hours?.display?.bar?.mon_thu;
  const hoursSnippet = kitchenWeek && barWeek ? `Kitchen ${kitchenWeek} | Bar ${barWeek}` : 'Open – see full hours';
  const { data: marketing } = useParsedData('marketing.json', MarketingDataSchema);
  const labelBookOnline = marketing?.buttons?.bookOnline || 'Book Online';
  const labelCallForTakeaway = marketing?.buttons?.callForTakeaway || 'Call for Takeaway';
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/OldCrownGirtonBuilding.png"
          alt="Old Crown Girton Building"
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            <span className="block text-crown-gold">Girton’s Historic Thatched Pub</span>
            <span className="block text-white text-3xl md:text-4xl lg:text-5xl">with Himalayan Flavour</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            A welcoming village hub just outside Cambridge – authentic Nepalese dishes alongside trusted British pub comfort in a distinctive thatched setting.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-white/85 mb-10 max-w-4xl mx-auto">
            {[
              'Authentic Nepalese + Pub Classics',
              'Family & Dog Friendly',
              'Near Girton College',
              'Garden • Live Sports',
              'Community Events'
            ].map((item) => (
              <span key={item} className="px-3 py-1 bg-white/10 rounded-full backdrop-blur border border-white/15">
                {item}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-crown-gold-dark text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              {labelBookOnline}
            </motion.a>
            <motion.a
              href={`tel:${contact?.phone.primary || '01223276027'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-crown-red hover:bg-crown-red-dark text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              📞 {labelCallForTakeaway}
            </motion.a>
          </div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 text-white/90"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-crown-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{contact?.address.area}, {contact?.address.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-crown-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{hoursSnippet}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-crown-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{contact?.phone.display || '01223 276027'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
