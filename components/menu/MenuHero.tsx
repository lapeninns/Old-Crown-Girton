/* eslint-disable react/no-unescaped-entities */
import React from 'react';

type Props = {
  labelBookOnline: string;
  labelOrderTakeaway: string;
};

export default function MenuHero({ labelBookOnline, labelOrderTakeaway }: Props) {
  return (
  <section className="py-8 bg-gradient-to-br from-stout-800 to-stout-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Menu — Nepalese & Pub Classics</h1>
        <p className="text-sm sm:text-base text-neutral-200 mb-4">Curated menu — quick to scan. Book or order takeaway.</p>
        <div className="flex items-center justify-center gap-3">
          <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent text-white font-semibold py-2 px-4 rounded-md text-sm">
            {labelBookOnline}
          </a>
          <a href="tel:01223 277217" className="bg-crimson-500 text-white font-semibold py-2 px-4 rounded-md text-sm">
            {labelOrderTakeaway}
          </a>
        </div>
      </div>
    </section>
  );
}
