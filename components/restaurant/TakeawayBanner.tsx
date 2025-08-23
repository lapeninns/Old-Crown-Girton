'use client';

import { motion } from 'framer-motion';

export default function TakeawayBanner() {
  return (
  <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-neutral-50"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl mr-3"
            >
              🥡
            </motion.div>
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
              href="tel:01223276027"
              className="bg-accent-500 text-neutral-900 hover:bg-accent-400 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
            >
              📞 Call to Order: 01223 276027
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-base font-medium"
          >
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <span className="text-2xl">⏰</span>
              <span className="text-neutral-50 font-semibold">Ready in 20-30 mins</span>
            </div>
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <span className="text-2xl">🚗</span>
              <span className="text-neutral-50 font-semibold">Free collection</span>
            </div>
            <div className="flex items-center gap-2 bg-brand-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent-300/40">
              <span className="text-2xl">📞</span>
              <span className="text-neutral-50 font-semibold">Call for current menu & prices</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
