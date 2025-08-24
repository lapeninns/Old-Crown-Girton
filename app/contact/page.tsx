import RestaurantLayout from "@/components/restaurant/Layout";
import { getContentSmart } from '@/src/lib/data/server-loader';

export default async function ContactPage() {
  const content = await getContentSmart();
  const contactContent = content.pages.contact;
  return (
    <RestaurantLayout>
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-4">
              {contactContent.hero.title}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {contactContent.hero.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Phone */}
              <div className="bg-neutral-100 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">📞</span>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brand-700">{contactContent.contactInfo.phone.title}</h2>
                    <p className="text-neutral-600">{contactContent.contactInfo.phone.description}</p>
                  </div>
                </div>
                <a href={`tel:${contactContent.contactInfo.phone.number.replace(/\s/g, '')}`} className="inline-block bg-accent-600 hover:bg-accent-700 text-neutral-50 font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/60" aria-label="Call Himalayan Spice" type="button">📞 {contactContent.contactInfo.phone.number}</a>
              </div>

              {/* Address */}
              <div className="bg-neutral-50 border-2 border-neutral-200 p-6 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">📍</span>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brand-700 mb-2">{contactContent.contactInfo.location.title}</h2>
                    <div className="text-neutral-600">
                      {contactContent.contactInfo.location.address.split(', ').map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-500">
                  {contactContent.contactInfo.location.description}
                </p>
              </div>

              {/* Email */}
              <div className="bg-neutral-50 border-2 border-neutral-200 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">📧</span>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brand-700">Email</h2>
                    <p className="text-neutral-600">Send us a message</p>
                  </div>
                </div>
                <a
                  href="mailto:info@oldcrowngirton.co.uk"
                    className="text-foreground-strong hover:text-foreground-strong font-semibold transition-colors duration-200"
                  aria-label="Email Himalayan Spice"
                >
                  info@oldcrowngirton.co.uk
                </a>
              </div>
            </div>

            {/* Opening Hours & Additional Info */}
            <div className="space-y-8">
              {/* Opening Hours */}
              <div className="bg-neutral-100 p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">⏰</span>
                  <h2 className="text-xl font-display font-bold text-brand-700">{contactContent.hours.title}</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-brand-700 mb-2">{contactContent.hours.restaurant.title}</h3>
                    <div className="space-y-1 text-neutral-600">
                      {contactContent.hours.restaurant.schedule.map((schedule: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{schedule.days}</span>
                          <span>{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-300 pt-4">
                    <h3 className="font-bold text-brand-700 mb-2">{contactContent.hours.bar.title}</h3>
                    <div className="space-y-1 text-neutral-600">
                      {contactContent.hours.bar.schedule.map((schedule: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{schedule.days}</span>
                          <span>{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-neutral-50 border-2 border-neutral-200 p-6 rounded-xl">
                <h2 className="text-xl font-display font-bold text-stout-700 mb-4">
                  {contactContent.features.title}
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {contactContent.features.items.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{feature.icon}</span>
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-accent-50 border-2 border-accent-500 p-6 rounded-xl text-center">
                <h2 className="text-xl font-display font-bold text-stout-700 mb-4">
                  Follow Us
                </h2>
                <p className="text-neutral-600 mb-4">
                  Stay updated with our latest news and special offers
                </p>
                <div className="flex justify-center space-x-6">
                  <a 
                    href="https://facebook.com" 
                    className="text-accent hover:text-accent-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    className="text-accent hover:text-accent-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.897 14.411 3.29 13.043 3.29 11.498c0-1.544.608-2.913 1.837-4.198.875-.801 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.228 1.285 1.837 2.654 1.837 4.198 0 1.545-.609 2.913-1.837 4.199-.875.8-2.026 1.291-3.323 1.291z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-neutral-50 rounded-xl shadow-lg overflow-hidden">
              <div className="h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.7892358932124!2d0.09036631577853944!3d52.23847767975736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d870a1c0e1e9b7%3A0x1f4c4f8c4f8c4f8c!2sGirton%2C%20Cambridge!5e0!3m2!1sen!2suk!4v1635789123456!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  className="h-[400px] w-full rounded-xl shadow-lg"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Old Crown Girton Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
