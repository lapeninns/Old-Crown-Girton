'use client';

import { motion } from 'framer-motion';
import { getTestimonials } from '@/lib/restaurantData';
import { useEffect } from 'react';
import { SchemaInjector } from '@/components/seo/RestaurantSchema';
import { useParsedData } from '@/hooks/useParsedData';
import { MarketingDataSchema } from '@/lib/schemas';

export default function TestimonialsSection() {
  const testimonials = getTestimonials();
  const { data: marketing } = useParsedData('marketing.json', MarketingDataSchema);
  const labelBookTableOnline = marketing?.buttons?.bookTableOnline || 'Book Your Table Online';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Re-trigger restaurant schema injection when testimonials render to ensure reviews/aggregate stay fresh
  useEffect(() => {
    // This will remove & re-add updated restaurant schema with reviews if needed
    // (SchemaInjector ensures uniqueness per type)
  }, [testimonials]);

  // If there are no testimonials, render nothing (after hook declarations)
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Hidden injector to refresh schema (no additional props needed) */}
        <SchemaInjector type="restaurant" page="testimonials" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-crown-slate mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our valued customers about their dining experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.slice(0, 6).map((testimonial: any) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Star Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-crown-slate">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{testimonial.platform}</p>
                  {testimonial.verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to create your own memorable dining experience?
          </p>
          <motion.a
            href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-crown-gold hover:bg-crown-gold-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
          >
            {labelBookTableOnline}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
