'use client';

import { motion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';
import Image from 'next/image';
import heroBg from '@cimages/Slideshow/OldCrownGirtonBuilding.png';
import { getContactInfo } from '@/lib/restaurantData';
import { useParsedData } from '@/hooks/useParsedData';
import { useContent } from '@/hooks/useContent';
import { useOpeningHours } from '@/hooks/data/useOpeningHours';
import { MarketingDataSchema } from '@/lib/schemas';

export default function Hero() {
  const contact = getContactInfo();
  const { hours, isLoading: hoursLoading } = useOpeningHours();
  
  // Generate hours snippet from actual restaurant data
  const hoursSnippet = (() => {
    if (hoursLoading) return 'Loading hours...';
    if (!hours) return 'Open – see full hours';
    
    const { kitchenSummary, barSummary } = hours.summary;
    
    if (kitchenSummary && barSummary) {
      return `Kitchen: ${kitchenSummary} | Bar: ${barSummary}`;
    } else if (kitchenSummary) {
      return `Kitchen: ${kitchenSummary}`;
    } else if (barSummary) {
      return `Bar: ${barSummary}`;
    }
    
    return 'Open – see full hours';
  })();
  
  const { data: marketing } = useParsedData('marketing.json', MarketingDataSchema);
  const { data: content } = useContent();
  
  // Get content from content management system with fallbacks
  const heroContent = content?.pages?.home?.hero;
  const labelBookOnline = marketing?.buttons?.bookOnline || content?.global?.ui?.buttons?.bookOnline || 'Book Online';
  const labelCallForTakeaway = marketing?.buttons?.callForTakeaway || 'Call for Takeaway';
  
  // Hero content with fallbacks
  const heroTitle = heroContent?.title || 'Girton\'s Historic Thatched Pub with Himalayan Flavour';
  const heroDescription = heroContent?.description || 'A welcoming village hub just outside Cambridge – authentic Nepalese dishes alongside trusted British pub comfort in a distinctive thatched setting.';
  const primaryCTA = heroContent?.cta?.primary || labelBookOnline;
  const secondaryCTA = heroContent?.cta?.secondary || 'View Menu';
  const altText = content?.global?.accessibility?.altTexts?.heroBanner || 'Old Crown Girton Building';
  
  // Feature tags from content or fallback
  const features = content?.pages?.home?.sections?.features?.items || [
    { title: 'Authentic Nepalese + Pub Classics' },
    { title: 'Family & Dog Friendly' },
    { title: 'Near Girton College' },
    { title: 'Garden • Live Sports' },
    { title: 'Community Events' }
  ];
  
  return (
  <section className="relative h-[60vh] sm:h-[65vh] md:h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBg}
          alt={altText}
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stout-900/80 via-stout-800/60 to-stout-700/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={mv.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0%' }}>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 mb-6 leading-snug md:leading-tight">
            <span className="block text-accent-400">Girton’s Historic Thatched Pub</span>
            <span className="block text-neutral-50 text-xl sm:text-2xl md:text-3xl lg:text-4xl">with Himalayan Flavour</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-neutral-100 mb-10 max-w-3xl mx-auto">
            {features.map((feature: any, index: number) => (
              <span key={index} className="px-3 py-1 bg-neutral-50/15 rounded-full backdrop-blur border border-accent-400/25">
                {feature.title}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
              whileHover={mv.button.hover}
              whileTap={mv.button.tap}
                className="bg-brand-600 hover:bg-accent-500 text-neutral-50 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto"
              >
                {primaryCTA}
              </motion.a>
            <motion.a
              href={`tel:${contact?.phone.primary || '01223 277217'}`}
              whileHover={mv.button.hover}
              whileTap={mv.button.tap}
              className="bg-crimson-600 hover:bg-crimson-700 text-neutral-50 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              📞 {labelCallForTakeaway}
            </motion.a>
          </div>

          {/* Quick Info */}
          <motion.div variants={mv.fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0%' }}
            className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 text-neutral-100"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{contact?.address.area}, {contact?.address.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{hoursSnippet}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{contact?.phone.display || '01223277217'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
}
