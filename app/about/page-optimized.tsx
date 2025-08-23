/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart } from '@/src/lib/data/loader';
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The Old Crown | Historic Thatched Pub Girton | Our Story & Heritage',
  description: 'Discover the story of The Old Crown - the largest thatched pub in the country. From village inn to unique Nepalese-British fusion restaurant in Girton, Cambridge.',
  keywords: 'historic pub Cambridge, largest thatched pub UK, Girton pub history, village pub heritage, Old Crown story, traditional English pub, Nepalese restaurant Cambridge history',
  openGraph: {
    title: 'About The Old Crown | Historic Thatched Pub Girton | Our Story & Heritage',
    description: 'Learn the fascinating story of Girton\'s largest thatched pub and how we became Cambridge\'s unique Nepalese-British dining destination',
    url: 'https://oldcrowngirton.co.uk/about',
    siteName: 'The Old Crown Girton',
    locale: 'en_GB',
    type: 'website',
  },
};

export default async function AboutPage() {
  const m = await getMarketingSmart();
  const labels = m.buttons || {};
  const labelBookVisitOnline = labels.bookVisitOnline || 'Book Your Visit Online';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://oldcrowngirton.co.uk/about#about",
    "name": "About The Old Crown",
    "description": "The story and heritage of The Old Crown, Girton's historic thatched pub serving Nepalese and British cuisine",
    "mainEntity": {
      "@type": "Restaurant",
      "name": "The Old Crown",
      "foundingDate": "1930s",
      "description": "Historic thatched pub in Girton village, known as the largest thatched pub in the country",
      "specialty": "Nepalese cuisine and British pub classics"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RestaurantLayout>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-brand-700 to-brand-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 mb-6">
              The Story of The Old Crown: Historic Thatched Pub Heritage
            </h1>
            <p className="text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              Discover how Girton&apos;s largest thatched pub evolved from a traditional village inn 
              into Cambridge's unique destination for authentic Nepalese cuisine and British classics.
            </p>
          </div>
        </section>

        {/* Heritage Story Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-stout-700 mb-6">
                  A Historic Thatched Pub with a Modern Heart
                </h2>
                <p className="text-lg text-neutral-700 mb-6">
                  The Old Crown proudly stands as the <strong>largest thatched pub in the country</strong>, 
                  a distinctive architectural marvel that has been welcoming guests to <strong>Girton village</strong> 
                  since the 1930s. Our striking thatched roof and traditional English pub character 
                  create an atmosphere that's both timeless and uniquely memorable.
                </p>
                <p className="text-lg text-neutral-700 mb-6">
                  Located just 2 miles from <strong>Cambridge city centre</strong> on Girton&apos;s historic High Street, 
                  we've evolved from a simple village inn into something truly special - a place where 
                  authentic <strong>Nepalese cuisine</strong> meets beloved British pub traditions 
                  under our famous thatched roof.
                </p>
                <p className="text-lg text-brand-600">
                  Today, The Old Crown represents the perfect blend of heritage and innovation, 
                  serving our local community of Girton residents, <strong>Cambridge University</strong> students and staff, 
                  and visitors from across the region who seek authentic flavors in a historic setting.
                </p>
              </div>
              <div className="relative">
                <div className="bg-neutral-100 p-8 rounded-lg">
                  <div className="text-6xl mb-4 text-center">🏛️</div>
                  <h3 className="text-2xl font-bold text-brand-700 text-center mb-4">Historic Landmark</h3>
                  <ul className="space-y-3 text-neutral-700">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Built in the 1930s on historic foundations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Largest thatched pub roof in the UK</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Grade II listed architectural significance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Heart of Girton village for over 90 years</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="border-t border-neutral-200 pt-16">
              <h2 className="text-3xl font-display font-bold text-brand-700 text-center mb-12">
                Our Journey Through Time
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 font-bold">1930s</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-700 mb-2">The Foundation Years</h3>
                    <p className="text-brand-600">
                      The Old Crown was built to replace an earlier inn, featuring the distinctive 
                      <strong>thatched roof design</strong> that would become our signature. From day one, 
                      it served as Girton&apos;s central gathering place for villagers and travelers alike.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 font-bold">1960s-90s</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-700 mb-2">The Traditional Pub Era</h3>
                    <p className="text-brand-600">
                      For decades, The Old Crown operated as a classic English village pub, 
                      serving traditional ales and hearty pub grub to generations of Girton families. 
                      Our reputation for generous portions and warm hospitality grew throughout Cambridge.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 font-bold">2000s</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-700 mb-2">Culinary Evolution</h3>
                    <p className="text-brand-600">
                      Under various managements, The Old Crown experimented with different culinary directions, 
                      including a period as an upscale gastropub. Each era added to our rich tapestry 
                      while maintaining our essential village pub character.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 font-bold">Today</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-700 mb-2">The Nepalese-British Fusion</h3>
                    <p className="text-brand-600">
                      Under current management, we've discovered our unique identity: combining 
                      <strong>authentic Nepalese cuisine</strong> with traditional British pub classics. 
                      This fusion represents Cambridge's multicultural community while honoring our heritage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Girton Village Context */}
        <section className="py-16 bg-brand-50/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 text-center mb-12">
              Heart of Girton Village & Cambridge Community
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-neutral-50 rounded-lg">
                <div className="text-4xl mb-4">🏘️</div>
                <h3 className="text-xl font-bold text-brand-700 mb-4">Girton Village Heritage</h3>
                <p className="text-brand-600">
                  <strong>Girton</strong> has roots stretching back to Roman times, evolving into a charming 
                  village that perfectly balances historic character with modern convenience. 
                  Our pub has been a constant through this evolution.
                </p>
              </div>

              <div className="text-center p-6 bg-neutral-50 rounded-lg">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-brand-700 mb-4">Cambridge University Connection</h3>
                <p className="text-brand-600">
                  Just steps from <strong>Girton College</strong> (Cambridge's first women's college), 
                  we've welcomed generations of students, faculty, and visitors who appreciate 
                  both our historic atmosphere and international cuisine.
                </p>
              </div>

              <div className="text-center p-6 bg-neutral-50 rounded-lg">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-brand-700 mb-4">Community Hub</h3>
                <p className="text-brand-600">
                  From <strong>Girton Feast Week</strong> celebrations to weekly quiz nights, 
                  we're proud to host the moments that bring our community together. 
                  Every event adds to our rich social history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Nepalese Story */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-6">
                  Why Nepalese Cuisine? Our Unique Culinary Journey
                </h2>
                <p className="text-lg text-neutral-700 mb-6">
                  Our decision to serve <strong>authentic Nepalese food</strong> wasn't random - it reflects 
                  Cambridge's vibrant international community and our commitment to offering something 
                  truly special. In a region saturated with traditional pub food and standard curry houses, 
                  we saw an opportunity to introduce the distinct, refined flavors of Nepal.
                </p>
                <p className="text-lg text-neutral-700 mb-6">
                  <strong>Nepalese cuisine</strong> is uniquely positioned between Indian, Tibetan, and Chinese 
                  influences, creating dishes that are both familiar and wonderfully different. 
                  Our <strong>momos</strong> (traditional dumplings) and <strong>dal bhat</strong> 
                  (Nepal's national dish) offer authentic tastes of the Himalayas right here in Girton.
                </p>
                <p className="text-lg text-brand-600">
                  By maintaining our British pub classics alongside these Nepalese specialties, 
                  we ensure every guest finds something to love - whether you're a local seeking 
                  Sunday roast or an adventurous foodie discovering new flavors.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-accent-50 rounded-lg">
                  <h4 className="font-bold text-brand-700 mb-3">🍛 What Makes Nepalese Food Special?</h4>
                  <ul className="space-y-2 text-brand-600">
                    <li>• Fresh spices and aromatic herbs from the Himalayas</li>
                    <li>• Lighter, more refined than typical Indian curries</li>
                    <li>• Unique cooking techniques passed down generations</li>
                    <li>• Perfect balance of flavors and heat levels</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-accent-50 rounded-lg">
                  <h4 className="font-bold text-brand-700 mb-3">🏆 Recognition & Reviews</h4>
                  <ul className="space-y-2 text-brand-600">
                    <li>• Rated #1 restaurant in Girton on TripAdvisor</li>
                    <li>• 4.8/5 average rating across all platforms</li>
                    <li>• "Best Nepalese food in Cambridge" - customer reviews</li>
                    <li>• Featured in local food guides and recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values & Philosophy */}
        <section className="py-16 bg-neutral-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-8">
              Our Values & Philosophy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                <div className="p-6 bg-neutral-50 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2 flex items-center">
                    <span className="mr-3">🏠</span> Community First
                  </h3>
                  <p className="text-brand-600">
                    We&apos;re more than a restaurant - we&apos;re Girton&apos;s living room. Whether you&apos;re a regular 
                    or first-time visitor, you'll find a warm welcome and sense of belonging.
                  </p>
                </div>
                
                <div className="p-6 bg-neutral-50 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2 flex items-center">
                    <span className="mr-3">🌿</span> Authentic Quality
                  </h3>
                  <p className="text-brand-600">
                    From our traditional Nepalese spice blends to locally-sourced British ingredients, 
                    authenticity and quality guide every dish we serve.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-neutral-50 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2 flex items-center">
                    <span className="mr-3">👨‍👩‍👧‍👦</span> Family Friendly
                  </h3>
                  <p className="text-brand-600">
                    Families and furry friends are at the heart of what we do. Our welcoming environment 
                    ensures everyone feels comfortable and valued.
                  </p>
                </div>
                
                <div className="p-6 bg-neutral-50 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2 flex items-center">
                    <span className="mr-3">🌍</span> Cultural Bridge
                  </h3>
                  <p className="text-brand-600">
                    We celebrate Cambridge's international community by bringing together the best 
                    of British and Nepalese traditions under one historic roof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ About Us */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-brand-700 text-center mb-12">
              Frequently Asked Questions About The Old Crown
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">Is The Old Crown really the largest thatched pub?</h3>
                  <p className="text-brand-600">Yes! Our thatched roof covers the largest area of any pub in the country, making us a unique architectural landmark in Girton and beyond.</p>
                </div>
                
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">How long have you been serving Nepalese food?</h3>
                  <p className="text-brand-600">We introduced our Nepalese menu in recent years as part of our evolution. It quickly became our signature offering due to its authenticity and popularity.</p>
                </div>
                
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">Do you still serve traditional pub food?</h3>
                  <p className="text-brand-600">Absolutely! Alongside our Nepalese specialties, we maintain a full menu of British pub classics including fish & chips, Sunday roast, and hearty mains.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">What makes your location special?</h3>
                  <p className="text-brand-600">We're perfectly positioned in Girton village - close enough to Cambridge for easy access, but far enough to maintain peaceful village charm and free parking.</p>
                </div>
                
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">Do you host private events?</h3>
                  <p className="text-brand-600">Yes! Our historic setting and flexible spaces make us perfect for celebrations, business gatherings, and community events. Contact us to discuss your requirements.</p>
                </div>
                
                <div className="p-6 bg-neutral-100 rounded-lg">
                  <h3 className="font-bold text-brand-700 mb-2">Are you accessible for visitors with mobility needs?</h3>
                  <p className="text-brand-600">We're wheelchair accessible with accessible parking and facilities. Our ground floor dining areas ensure everyone can enjoy our historic pub atmosphere.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-brand-700 text-neutral-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Experience Our Story Yourself
            </h2>
            <p className="text-xl text-neutral-200 mb-8">
              Visit The Old Crown and become part of our continuing story. From our historic thatched roof 
              to our innovative cuisine, every detail tells the tale of Girton's unique pub.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-700 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg">
                {labelBookVisitOnline}
              </a>
              <Link href="/menu" className="bg-crimson-500 hover:bg-crimson-600 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg">
                Explore Our Menu
              </Link>
              <Link href="/events" className="bg-neutral-50 hover:bg-neutral-100 text-brand-700 font-bold py-4 px-8 rounded-lg text-lg">
                Upcoming Events
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-neutral-300">
              <p><strong>The Old Crown</strong> • 89 High Street, Girton, Cambridge CB3 0QQ</p>
              <p>Where heritage meets flavor • Since the 1930s</p>
            </div>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
