/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart } from '@/src/lib/data/loader';
import Hero from "@/components/restaurant/Hero";
import dynamic from 'next/dynamic';
// Dynamic non-LCP sections
const AboutSection = dynamic(() => import("@/components/restaurant/AboutSection"), { ssr: true });
const MenuHighlights = dynamic(() => import("@/components/restaurant/MenuHighlights"));
const TestimonialsSection = dynamic(() => import("@/components/restaurant/TestimonialsSection"));
const TakeawayBanner = dynamic(() => import("@/components/restaurant/TakeawayBanner"));
const LocationSection = dynamic(() => import("@/components/restaurant/LocationSection"));
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Old Crown Girton | Historic Thatched Pub & Nepalese Restaurant Cambridge',
  description: 'Girton\'s largest thatched pub serving authentic Nepalese cuisine & British classics. Family & dog friendly. Near Cambridge. Book: 01223 276027',
  keywords: 'pub Girton, Nepalese restaurant Cambridge, family friendly pub Cambridge, dog friendly pub Girton, Sunday roast Cambridge, historic thatched pub, Girton College pub, takeaway Cambridge',
  openGraph: {
    title: 'The Old Crown Girton | Historic Thatched Pub & Nepalese Restaurant',
    description: 'Discover Girton\'s unique thatched pub combining authentic Nepalese flavours with traditional British comfort food, just minutes from Cambridge',
    url: 'https://oldcrowngirton.co.uk',
    siteName: 'The Old Crown Girton',
    locale: 'en_GB',
    type: 'website',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const m = await getMarketingSmart();
    if (m.seo) {
      return { title: m.seo.title, description: m.seo.description };
    }
  } catch {}
  return metadata;
}

export default async function Page() {
  const m = await getMarketingSmart();
  const labels: Record<string, string> = m.buttons || {};
  const labelBookOnline = labels.bookOnline || 'Book Online';
  const labelViewMenu = labels.viewMenu || 'View Menu';
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": "https://oldcrowngirton.co.uk/#restaurant",
        "name": "The Old Crown",
        "alternateName": "Old Crown Girton",
        "description": "Historic thatched pub in Girton serving authentic Nepalese cuisine and traditional British pub classics. Family and dog friendly with beer garden.",
        "url": "https://oldcrowngirton.co.uk",
        "telephone": "+441223276027",
        "priceRange": "££",
        "servesCuisine": ["Nepalese", "British", "Pub Food"],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "89 High Street",
          "addressLocality": "Girton",
          "addressRegion": "Cambridgeshire",
          "postalCode": "CB3 0QQ",
          "addressCountry": "GB"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 52.2385,
          "longitude": 0.0926
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
            "opens": "12:00",
            "closes": "23:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Friday", "Saturday"],
            "opens": "12:00",
            "closes": "00:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "12:00",
            "closes": "22:30"
          }
        ],
        "amenityFeature": [
          {"@type": "LocationFeatureSpecification", "name": "Outdoor seating"},
          {"@type": "LocationFeatureSpecification", "name": "Dog friendly"},
          {"@type": "LocationFeatureSpecification", "name": "Family friendly"},
          {"@type": "LocationFeatureSpecification", "name": "Free parking"},
          {"@type": "LocationFeatureSpecification", "name": "Wheelchair accessible"},
          {"@type": "LocationFeatureSpecification", "name": "Free WiFi"}
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://oldcrowngirton.co.uk/#business",
        "name": "The Old Crown",
        "image": "https://oldcrowngirton.co.uk/hero-restaurant.jpg",
        "sameAs": [
          "https://facebook.com/oldcrowngirton",
          "https://instagram.com/oldcrowngirton"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RestaurantLayout>
        <Hero />
        
        {/* Welcome Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-stout-700 mb-6">
                The Old Crown Girton: Historic Thatched Pub & Authentic Nepalese Restaurant
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Welcome to Girton's unique dining destination, where the largest thatched pub in the country serves 
                exceptional <strong>Nepalese cuisine</strong> alongside beloved <strong>British pub classics</strong>. 
                Just minutes from <strong>Cambridge</strong> and <strong>Girton College</strong>, we're your 
                family-friendly, dog-welcoming village hub for memorable meals and community gathering.
              </p>
            </div>

            {/* Quick Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: '🏛️', text: 'Historic Thatched Building', desc: 'Largest in the country' },
                { icon: '🍛', text: 'Authentic Nepalese Food', desc: 'Traditional recipes' },
                { icon: '👨‍👩‍👧‍👦', text: 'Family Friendly', desc: 'Kids welcome until 9pm' },
                { icon: '🐕', text: 'Dog Friendly', desc: 'Well-behaved dogs welcome' }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-brand-50/30">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-stout-700 text-sm">{feature.text}</h3>
                  <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cuisine Section */}
        <section className="py-16 bg-brand-50/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stout-700 text-center mb-12">
              Authentic Nepalese Cuisine Meets British Pub Tradition
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-stout-700 mb-6">Our Signature Nepalese Dishes</h3>
                <p className="text-gray-700 mb-6">
                  Experience the rich, aromatic flavours of the Himalayas with our authentic Nepalese menu. 
                  From traditional <strong>momos</strong> (Nepalese dumplings) to hearty <strong>dal bhat</strong> 
                  (Nepal's national dish), every recipe uses time-honoured techniques and fresh spices.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Chicken Momo</strong> - Traditional dumplings with signature tomato chutney</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Dal Bhat</strong> - Nepal's national dish with lentils, rice & vegetables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Lamb Curry</strong> - Slow-cooked in aromatic Himalayan spices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Vegetable Thali</strong> - Complete vegetarian feast for sharing</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-stout-700 mb-6">Beloved British Pub Classics</h3>
                <p className="text-gray-700 mb-6">
                  Alongside our Nepalese specialities, we serve all your favourite <strong>pub classics</strong> 
                  made with quality local ingredients. Perfect for those seeking familiar comforts 
                  in our welcoming village setting.
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Fish & Chips</strong> - Fresh cod in golden beer batter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Sunday Roast</strong> - Traditional roast with all the trimmings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Grilled Salmon</strong> - Pan-seared with seasonal vegetables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span><strong>Steak & Ale Pie</strong> - Homemade with local ales</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <MenuHighlights />

        {/* Perfect for Every Occasion */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stout-700 text-center mb-12">
              Perfect for Every Occasion in Girton & Cambridge
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-brand-50/30">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-stout-700 mb-4">Family-Friendly Dining</h3>
                <p className="text-gray-700 mb-4">
                  Bring the whole family to our welcoming pub. We offer a dedicated children's menu, 
                  high chairs, and a spacious beer garden where kids can play safely while you relax.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Children welcome until 9pm</li>
                  <li>• Kids menu with mild spice options</li>
                  <li>• Large garden with safe play area</li>
                  <li>• Baby changing facilities</li>
                </ul>
              </div>

              <div className="text-center p-6 rounded-lg bg-brand-50/30">
                <div className="text-4xl mb-4">🐕</div>
                <h3 className="text-xl font-bold text-stout-700 mb-4">Dog-Friendly Welcome</h3>
                <p className="text-gray-700 mb-4">
                  Your four-legged family members are more than welcome! Our dog-friendly policy 
                  extends throughout the pub and garden, with water bowls and treats available.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dogs welcome in all areas</li>
                  <li>• Water bowls provided</li>
                  <li>• Plenty of garden space</li>
                  <li>• Dog treats at the bar</li>
                </ul>
              </div>

              <div className="text-center p-6 rounded-lg bg-brand-50/30">
                <div className="text-4xl mb-4">📺</div>
                <h3 className="text-xl font-bold text-stout-700 mb-4">Live Sports & Community Events</h3>
                <p className="text-gray-700 mb-4">
                  Join fellow sports fans for live football, rugby and more on our large screens. 
                  Plus regular quiz nights, curry specials and community gatherings.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Large screen sports viewing</li>
                  <li>• Thursday pub quiz nights</li>
                  <li>• Tuesday curry night specials</li>
                  <li>• Monthly live music events</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        
        {/* Featured Snippet/PAA Answers */}
        <section className="py-16 bg-brand-50/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-stout-700 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">Is The Old Crown dog friendly?</h3>
                  <p className="text-gray-700">Yes! Well-behaved dogs are welcome throughout the pub and garden. We provide water bowls and dog treats.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">Do you need to book for Sunday roast?</h3>
                  <p className="text-gray-700">Booking is recommended for Sunday roast, especially for larger groups. Call 01223 276027 or <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="text-accent underline">{labelBookOnline.toLowerCase()}</a>.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">Does The Old Crown have parking?</h3>
                  <p className="text-gray-700">Yes, we offer free parking behind the building with easy access from High Street, Girton.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">What's special about your Nepalese food?</h3>
                  <p className="text-gray-700">Our authentic Nepalese dishes use traditional recipes and fresh spices. Try our famous momos or dal bhat - Nepal's national dish.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">Are children welcome at The Old Crown?</h3>
                  <p className="text-gray-700">Absolutely! Children are welcome until 9pm. We have a kids menu, high chairs, and a safe garden play area.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-stout-700 mb-2">How far is The Old Crown from Cambridge?</h3>
                  <p className="text-gray-700">We're just 2 miles from Cambridge city centre in Girton village, easily accessible by car, bus (Citi 6), or bike.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <TakeawayBanner />
        <LocationSection />
        
        {/* Final CTA Section */}
  <section className="py-16 bg-accent/10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="font-display font-bold text-stout-700 mb-4 text-3xl md:text-4xl">
              Ready to Experience Girton's Historic Thatched Pub?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Book your table for authentic Nepalese cuisine and British pub classics in our unique village setting. 
              Perfect for families, couples, groups, and your four-legged friends too!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg">
                {labelBookOnline}
              </a>
              <Link href="/menu" className="bg-stout-700 hover:bg-black text-white font-bold py-4 px-8 rounded-lg text-lg">
                {labelViewMenu}
              </Link>
              <Link href="/events" className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-4 px-8 rounded-lg text-lg">
                What's On This Week
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-600">
              <p><strong>Address:</strong> 89 High Street, Girton, Cambridge CB3 0QQ</p>
              <p><strong>Kitchen:</strong> Daily 12:00-22:00 (22:30 Fri/Sat, 21:30 Sun) | <strong>Bar:</strong> Until 23:00 (midnight Fri/Sat)</p>
            </div>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
