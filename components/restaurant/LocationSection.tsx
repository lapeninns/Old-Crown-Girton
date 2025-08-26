'use client';

import { motion } from 'framer-motion';
import OpeningHours from './OpeningHours';
import { getContactInfo } from '@/lib/restaurantData';

export default function LocationSection() {
  const contact = getContactInfo();

  return (
    <section className="py-16 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground-strong mb-4">
            Find <span className="text-accent">Us</span>
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            Located in the heart of Girton village, we&apos;re easily accessible 
            and just a short drive from Cambridge city center.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="bg-neutral-50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-display font-bold text-foreground-strong mb-4 flex items-center gap-2">
                <span className="text-accent">📍</span>
                Address
              </h3>
              <p className="text-foreground">
                Old Crown<br />
                {contact?.address.street || 'High Street'}<br />
                {contact?.address.area}, {contact?.address.city}<br />
                {contact?.address.postcode}
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-neutral-50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-display font-bold text-foreground-strong mb-4 flex items-center gap-2">
                <span className="text-accent">📞</span>
                Contact
              </h3>
              <div className="space-y-2 text-foreground">
                <p>
                  <strong>Phone:</strong> 
                  <a href="tel:01223276027" className="text-accent hover:underline ml-2">
                    {contact?.phone.display || '01223 276027'}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong> 
                  <a href="mailto:info@oldcrowngirton.co.uk" className="text-accent hover:underline ml-2">
                    {contact?.email.primary || 'info@oldcrowngirton.co.uk'}
                  </a>
                </p>
              </div>
            </div>

            {/* Opening Hours - New Modern Component */}
            <OpeningHours variant="compact" showTitle={false} />
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[600px] bg-neutral-50 rounded-xl shadow-lg overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.7892358932124!2d0.09036631577853944!3d52.23847767975736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d870a1c0e1e9b7%3A0x1f4c4f8c4f8c4f8c!2sGirton%2C%20Cambridge!5e0!3m2!1sen!2suk!4v1635789123456!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Old Crown Girton Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
