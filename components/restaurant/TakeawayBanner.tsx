'use client';

import { motion } from 'framer-motion';

export default function TakeawayBanner() {
  return (
  <section className="bg-gradient-to-r from-crimson to-crimson-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white"
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
              className="bg-white text-crimson hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              📞 Call to Order: 01223 276027
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <span>Ready in 20-30 mins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span>Free collection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">�</span>
              <span>Call for current menu & prices</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
