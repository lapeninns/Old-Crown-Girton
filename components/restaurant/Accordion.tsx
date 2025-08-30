'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="touch-target w-full px-6 py-4 text-left bg-neutral-50 hover:bg-neutral-100 transition-colors duration-200 flex justify-between items-center"
      >
        <span className="text-lg font-semibold text-stout-700">{title}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div variants={mv.expand} initial="collapsed" animate="expanded" exit="collapsed" className="overflow-hidden">
            <div className="px-6 py-4 bg-neutral-100 border-t border-neutral-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
