"use client";

import Link from '@/lib/debugLink';
import { motion, useReducedMotion } from 'framer-motion';

export interface PressFeatureContent {
  label?: string;
  eyebrow?: string;
  title?: string;
  summary?: string;
  quote?: string;
  quoteAttribution?: string;
  cta?: {
    text?: string;
    href?: string;
    ariaLabel?: string;
  };
}

interface PressFeatureBannerProps {
  content?: PressFeatureContent | null;
}

export default function PressFeatureBanner({ content }: PressFeatureBannerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!content?.title || !content?.cta?.href || !content?.cta?.text) {
    return null;
  }

  return (
    <motion.section
      aria-labelledby="press-feature-heading"
      className="bg-brand-700 text-white"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 md:max-w-3xl">
            {content.label ? (
              <p className="text-sm uppercase tracking-[0.18em] text-brand-100 font-semibold">
                {content.label}
              </p>
            ) : null}
            <div className="space-y-2">
              {content.eyebrow && (
                <p className="text-brand-200 text-sm font-semibold">
                  {content.eyebrow}
                </p>
              )}
              <h2 id="press-feature-heading" className="text-2xl md:text-3xl font-display font-bold leading-tight">
                {content.title}
              </h2>
            </div>
            {content.summary && (
              <p className="text-brand-100 text-base md:text-lg leading-relaxed">
                {content.summary}
              </p>
            )}
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4">
            {content.quote && (
              <blockquote className="bg-white/10 rounded-lg p-4 text-sm md:text-base italic border border-white/20">
                <span aria-hidden="true">“</span>
                {content.quote}
                <span aria-hidden="true">”</span>
                {content.quoteAttribution && (
                  <cite className="not-italic block mt-3 text-xs font-medium text-brand-100">
                    {content.quoteAttribution}
                  </cite>
                )}
              </blockquote>
            )}
            <Link
              href={content.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-brand-700 font-semibold px-6 py-3 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:-translate-y-[1px] hover:shadow-lg"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'var(--tap-highlight-color, currentColor)' }}
              aria-label={content.cta.ariaLabel ?? content.cta.text ?? content.title ?? ''}
            >
              {content.cta.text}
              <span aria-hidden="true" className="text-lg leading-none">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
