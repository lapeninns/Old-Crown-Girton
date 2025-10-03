'use client';

import EmojiIcon from '@/components/common/EmojiIcon';

export default function TakeawayBanner() {
  return (
  <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-neutral-50">
          <div className="flex items-center justify-center mb-4">
            <EmojiIcon emoji="🥡" size="xl" className="mr-3" />
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Takeaway Available
            </h2>
          </div>
          
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Enjoy our delicious Nepalese cuisine from the comfort of your home. 
            <br className="hidden md:block" />
            <span className="font-semibold">Call us to place your takeaway order!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:01223 277217"
              className="bg-accent-500 text-neutral-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-accent-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 transition-colors"
              aria-label="Call to order takeaway at 01223 277217"
            >
              <EmojiIcon emoji="📞" className="mr-2" /> Call to Order: 01223 277217
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-base font-medium">
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <EmojiIcon emoji="⏰" size="lg" />
              <span className="text-neutral-50 font-semibold">Ready in 20-30 mins</span>
            </div>
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <EmojiIcon emoji="🚗" size="lg" />
              <span className="text-neutral-50 font-semibold">Free collection</span>
            </div>
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <EmojiIcon emoji="📞" size="lg" />
              <span className="text-neutral-50 font-semibold">Call for current menu & prices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
