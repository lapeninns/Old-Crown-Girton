'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveMapProps {
  className?: string;
  height?: string;
  title?: string;
}

export default function InteractiveMap({ 
  className = "h-[600px] bg-neutral-50 rounded-xl shadow-lg overflow-hidden",
  height = "100%",
  title = "Old Crown Girton Location"
}: InteractiveMapProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Restaurant coordinates
  const lat = '52.2425913';
  const lng = '0.0814946';

  // Direction URLs - same logic as sticky button
  const googleHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  const appleHref = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  const appleNative = `maps://?daddr=${lat},${lng}&dirflg=d`;

  const handleMapClick = () => {
    const isiOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isiOS) {
      try {
        // Try native Apple Maps first
        window.location.href = appleNative;
        // Fallback to web version after delay
        setTimeout(() => window.open(appleHref, '_blank', 'noopener'), 1200);
      } catch (err) {
        window.open(appleHref, '_blank', 'noopener');
      }
    } else {
      // Open Google Maps for non-iOS devices
      window.open(googleHref, '_blank', 'noopener');
    }

    // Analytics tracking
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ 
        event: "map_directions_click", 
        action: "directions_click",
        href: isiOS ? appleHref : googleHref
      });
    }
  };

  return (
    <div className={className}>
      <div 
        className="relative h-full cursor-pointer group"
        onClick={handleMapClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Click to get directions to Old Crown Girton"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMapClick();
          }
        }}
      >
        {/* Google Maps Embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.7892358932124!2d0.09036631577853944!3d52.23847767975736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d870a1c0e1e9b7%3A0x1f4c4f8c4f8c4f8c!2sGirton%2C%20Cambridge!5e0!3m2!1sen!2suk!4v1635789123456!5m2!1sen!2suk"
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="pointer-events-none"
        />

        {/* Interactive Overlay */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300" />

        {/* Direction Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.8, 
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 bg-brand-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
        >
          <span className="text-lg">🧭</span>
          <span>Get Directions</span>
        </motion.div>

        {/* Center Pin Indicator */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -2 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl drop-shadow-lg"
        >
          📍
        </motion.div>

        {/* Click Hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm text-neutral-700 font-medium"
        >
          Click for directions to Old Crown Girton
        </motion.div>

        {/* Focus Ring */}
        <div className="absolute inset-0 rounded-xl ring-0 group-focus-visible:ring-4 group-focus-visible:ring-brand-700/40 transition-all" />
      </div>
    </div>
  );
}