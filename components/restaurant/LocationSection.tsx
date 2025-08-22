'use client';

import { motion } from 'framer-motion';
import Accordion from './Accordion';
import { getContactInfo, getHours } from '@/lib/restaurantData';

export default function LocationSection() {
  const contact = getContactInfo();
  const hours = getHours();
  const mapKitchen = hours?.kitchen || {};
  const mapBar = hours?.bar || {};
  const pretty = (range?: string) => {
    if (!range) return '';
    // Convert 24h times like 12:00-15:00,17:00-22:00 -> 12:00–15:00 / 17:00–22:00 and then compress minutes :00 to no minutes for display
    return range.split(',')
      .map(slot => slot.trim().replace('-', '–'))
      .map(slot => slot.replace(/:00/g, ''))
      .join(' / ');
  };
  const order = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const label: Record<string,string> = {monday:'Monday',tuesday:'Tuesday',wednesday:'Wednesday',thursday:'Thursday',friday:'Friday',saturday:'Saturday',sunday:'Sunday'};
  const restaurantHours = order.map(d => ({ day: label[d], hours: pretty((mapKitchen as any)[d]) })).filter(r => r.hours);
  const barHours = order.map(d => ({ day: label[d], hours: pretty((mapBar as any)[d]) })).filter(r => r.hours);

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
          <h2 className="text-4xl md:text-5xl font-display font-bold text-stout-700 mb-4">
            Find <span className="text-accent">Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-display font-bold text-stout-700 mb-4 flex items-center gap-2">
                <span className="text-accent">📍</span>
                Address
              </h3>
              <p className="text-gray-600">
                Old Crown<br />
                {contact?.address.street || 'High Street'}<br />
                {contact?.address.area}, {contact?.address.city}<br />
                {contact?.address.postcode}
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-display font-bold text-stout-700 mb-4 flex items-center gap-2">
                <span className="text-accent">📞</span>
                Contact
              </h3>
              <div className="space-y-2 text-gray-600">
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

            {/* Opening Hours */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-2">
                <h3 className="text-xl font-display font-bold text-stout-700 mb-4 flex items-center gap-2">
                  <span className="text-accent">⏰</span>
                  Opening Hours
                </h3>
              </div>
              
              <div className="px-6 pb-6">
                <Accordion title="Restaurant Hours" defaultOpen>
                  <div className="space-y-2">
                    {restaurantHours.map((item) => (
                      <div key={item.day} className="flex justify-between items-center">
                        <span className="font-medium text-stout-700">{item.day}</span>
                        <span className="text-gray-600">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
                
                <Accordion title="Bar Hours">
                  <div className="space-y-2">
                    {barHours.map((item) => (
                      <div key={item.day} className="flex justify-between items-center">
                        <span className="font-medium text-stout-700">{item.day}</span>
                        <span className="text-gray-600">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[600px] bg-white rounded-xl shadow-lg overflow-hidden"
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
