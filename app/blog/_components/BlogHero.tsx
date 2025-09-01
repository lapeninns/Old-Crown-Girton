"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

interface BlogHeroProps {
  title: string;
  subtitle: string;
}

export default function BlogHero({ title, subtitle }: BlogHeroProps) {
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? mv.fadeIn : mv.fadeUp;
  return (
    <motion.section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16" variants={itemVariant as any} initial="hidden" animate="visible">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </motion.section>
  );
}
