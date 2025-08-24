/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from "next/link";
import { Metadata } from 'next';
import { getMarketingSmart } from '@/src/lib/data/server-loader';

export const metadata: Metadata = {
  title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
  description: 'Explore our authentic Nepalese menu featuring momos, dal bhat & curries, plus traditional British pub classics. Takeaway available. Book: 01223 276027',
  keywords: 'Nepalese menu Cambridge, authentic Nepalese food Girton, momos Cambridge, dal bhat, curry takeaway Cambridge, pub food menu Girton, Sunday roast menu',
  openGraph: {
    title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
    description: 'Discover our unique menu combining authentic Nepalese cuisine with traditional British pub favorites at Girton\'s historic thatched pub',
    url: 'https://oldcrowngirton.co.uk/menu',
    siteName: 'The Old Crown Girton',
    locale: 'en_GB',
    type: 'website',
  },
};

export default async function MenuPage() {
  const m = await getMarketingSmart();
  const labels = m.buttons || {};
  const labelBookOnline = labels.bookOnline || 'Book Online';
  const labelOrderTakeaway = labels.orderTakeaway || 'Order Takeaway';
  const labelBookRoastOnline = labels.bookRoastOnline || 'Book Sunday Roast Online';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": "https://oldcrowngirton.co.uk/menu#menu",
    "name": "The Old Crown Menu",
    "description": "Authentic Nepalese cuisine and traditional British pub classics",
    "inLanguage": "en-GB",
    "menuSection": [
      {
        "@type": "MenuSection",
        "name": "Nepalese Specialties",
        "description": "Authentic dishes from the heart of Nepal",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Chicken Momo",
            "description": "Traditional Nepalese dumplings filled with seasoned chicken, served with signature tomato chutney",
            "offers": {
              "@type": "Offer",
              "price": "8.95",
              "priceCurrency": "GBP"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Dal Bhat",
            "description": "Nepal's national dish featuring lentil soup, basmati rice, and seasonal vegetables",
            "offers": {
              "@type": "Offer",
              "price": "12.50",
              "priceCurrency": "GBP"
            }
          }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "British Pub Classics",
        "description": "Traditional favorites made with quality ingredients",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Fish & Chips",
            "description": "Fresh cod in golden beer batter with hand-cut chips and mushy peas",
            "offers": {
              "@type": "Offer",
              "price": "14.50",
              "priceCurrency": "GBP"
            }
          }
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
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-brand-700 to-brand-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Our Menu: Authentic Nepalese & Traditional British Cuisine
            </h1>
            <p className="text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the unique flavors of Nepal alongside your favorite pub classics at Girton&apos;s 
              historic thatched pub. Every dish made fresh with authentic recipes and quality ingredients.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-700 text-white font-bold py-3 px-6 rounded-lg">
                {labelBookOnline}
              </a>
              <a href="tel:01223276027" className="bg-crimson-500 hover:bg-crimson-600 text-white font-bold py-3 px-6 rounded-lg">
                📞 {labelOrderTakeaway}: 01223 276027
              </a>
            </div>
          </div>
        </section>

        {/* Menu Navigation */}
        <section className="py-8 bg-neutral-100/30 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Nepalese Specialties', href: '#nepalese' },
                { name: 'British Pub Classics', href: '#pub-classics' },
                { name: 'Starters & Sides', href: '#starters' },
                { name: 'Desserts', href: '#desserts' },
                { name: 'Drinks', href: '#drinks' },
                { name: 'Sunday Roast', href: '#sunday-roast' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 bg-white hover:bg-accent hover:text-white rounded-lg text-brand-700 font-semibold transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Nepalese Specialties Section */}
        <section id="nepalese" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-4">
                Authentic Nepalese Specialties
              </h2>
              <p className="text-lg text-brand-600 max-w-3xl mx-auto">
                Experience the rich, aromatic flavors of the Himalayas. Our <strong>authentic Nepalese menu</strong> 
                features traditional recipes passed down through generations, using fresh spices and time-honored cooking techniques.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Signature Dishes */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-brand-700 mb-6 border-b-2 border-accent-500 pb-2">
                  Signature Dishes
                </h3>

                <div className="p-6 bg-neutral-100/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-brand-700">Chicken Momo</h4>
                    <span className="text-lg font-bold text-foreground-strong">£8.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Traditional <strong>Nepalese dumplings</strong> filled with seasoned chicken and fresh herbs, 
                    steamed to perfection and served with our signature spicy tomato chutney. A must-try authentic dish!
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-marigold-100 text-marigold-800 rounded">Medium Spice</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten, Soy</span>
                  </div>
                </div>

                <div className="p-6 bg-neutral-100/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-brand-700">Dal Bhat</h4>
                    <span className="text-lg font-bold text-foreground-strong">£12.50</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    <strong>Nepal's national dish</strong> - a complete meal featuring aromatic lentil soup, fluffy basmati rice, 
                    seasonal vegetables, pickles, and papad. Nutritious, satisfying, and authentically prepared.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-cardamom-100 text-cardamom-800 rounded">Vegetarian</span>
                    <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded">Mild Spice</span>
                  </div>
                </div>

                <div className="p-6 bg-neutral-100/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-brand-700">Vegetable Thali</h4>
                    <span className="text-lg font-bold text-accent">£13.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    A complete <strong>vegetarian feast</strong> with multiple seasonal curries, dal, rice, 
                    fresh bread, pickles, and yogurt. Perfect for sharing and exploring diverse Nepalese flavors.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-cardamom-100 text-cardamom-800 rounded">Vegetarian</span>
                    <span className="px-2 py-1 bg-marigold-100 text-marigold-800 rounded">Medium Spice</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten, Dairy</span>
                  </div>
                </div>
              </div>

              {/* Curries & Mains */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-stout-700 mb-6 border-b-2 border-accent-500 pb-2">
                  Nepalese Curries & Mains
                </h3>

                <div className="p-6 bg-brand-50/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Lamb Curry (Khasi Ko Masu)</h4>
                    <span className="text-lg font-bold text-foreground-strong">£16.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Tender lamb slow-cooked in aromatic <strong>Himalayan spices</strong> with fresh herbs, 
                    onions, and tomatoes. Rich, hearty, and bursting with authentic flavors.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-crimson-100 text-crimson-800 rounded">Hot Spice</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Dairy</span>
                  </div>
                </div>

                <div className="p-6 bg-brand-50/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Chicken Curry (Kukhura Ko Masu)</h4>
                    <span className="text-lg font-bold text-foreground-strong">£14.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Free-range chicken cooked in traditional Nepalese style with ginger, garlic, and warm spices. 
                    Comfort food at its finest from the foothills of the Himalayas.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-marigold-100 text-marigold-800 rounded">Medium Spice</span>
                  </div>
                </div>

                <div className="p-6 bg-brand-50/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Vegetable Momo</h4>
                    <span className="text-lg font-bold text-foreground-strong">£7.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    <strong>Vegetarian dumplings</strong> filled with fresh seasonal vegetables and herbs, 
                    steamed and served with tangy tomato chutney. Light yet satisfying.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-cardamom-100 text-cardamom-800 rounded">Vegetarian</span>
                    <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded">Mild Spice</span>
                  </div>
                </div>

                {/* Call-out box */}
                <div className="p-6 bg-accent/10 rounded-lg border-l-4 border-accent">
                  <h4 className="font-bold text-stout-700 mb-2">🌶️ Spice Guide</h4>
                  <p className="text-sm text-brand-600">
                    <strong>Mild:</strong> Gentle warmth, family-friendly • 
                    <strong>Medium:</strong> Balanced heat with flavor • 
                    <strong>Hot:</strong> For spice lovers! We can adjust heat levels on request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* British Pub Classics Section */}
        <section id="pub-classics" className="py-16 bg-brand-50/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-stout-700 mb-4">
                Traditional British Pub Classics
              </h2>
              <p className="text-lg text-brand-600 max-w-3xl mx-auto">
                Alongside our Nepalese specialties, we serve all your favorite <strong>pub classics</strong> 
                made with quality local ingredients and traditional recipes. Comfort food at its best!
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-stout-700 mb-6 border-b-2 border-accent-500 pb-2">
                  House Favorites
                </h3>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Beer Battered Fish & Chips</h4>
                    <span className="text-lg font-bold text-foreground-strong">£14.50</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Fresh cod in our signature golden beer batter, served with hand-cut chips, mushy peas, 
                    and tartar sauce. A classic done properly!
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten, Fish</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Grilled Salmon</h4>
                    <span className="text-lg font-bold text-foreground-strong">£18.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Pan-seared salmon fillet with seasonal vegetables, new potatoes, and herb butter. 
                    Fresh, healthy, and expertly prepared.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Fish, Dairy</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Steak & Ale Pie</h4>
                    <span className="text-lg font-bold text-foreground-strong">£15.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Tender chunks of beef slow-cooked in local ale with vegetables, encased in golden pastry. 
                    Served with mashed potatoes and seasonal greens.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-stout-700 mb-6 border-b-2 border-accent-500 pb-2">
                  Hearty Mains
                </h3>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">8oz Ribeye Steak</h4>
                    <span className="text-lg font-bold text-foreground-strong">£22.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Prime British beef cooked to your liking, served with hand-cut chips, 
                    grilled tomato, and your choice of peppercorn or mushroom sauce.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Dairy</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Homemade Burger</h4>
                    <span className="text-lg font-bold text-foreground-strong">£13.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    100% British beef patty with lettuce, tomato, red onion, and chips. 
                    Add cheese, bacon, or our signature chutney for extra flavor.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-stout-700">Vegetarian Wellington</h4>
                    <span className="text-lg font-bold text-foreground-strong">£14.95</span>
                  </div>
                  <p className="text-brand-600 mb-3">
                    Roasted vegetables, nuts, and herbs wrapped in golden puff pastry. 
                    Served with roasted vegetables and vegetarian gravy.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-cardamom-100 text-cardamom-800 rounded">Vegetarian</span>
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">Contains: Gluten, Nuts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sunday Roast Section */}
        <section id="sunday-roast" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-stout-700 mb-8">
              Sunday Roast at The Old Crown
            </h2>
            <div className="bg-accent/10 p-8 rounded-lg">
              <div className="text-6xl mb-4">🍖</div>
              <h3 className="text-2xl font-bold text-stout-700 mb-4">Traditional Sunday Roast</h3>
              <p className="text-lg text-brand-600 mb-6">
                Every Sunday, we serve traditional <strong>Sunday roast</strong> with your choice of beef, lamb, 
                pork, or chicken. All served with Yorkshire pudding, roast potatoes, seasonal vegetables, 
                and our homemade gravy.
              </p>
              <div className="text-2xl font-bold text-foreground-strong mb-4">£16.95 - £19.95</div>
              <p className="text-sm text-brand-600 mb-6">
                <strong>Served:</strong> Sundays 12:00 - 21:00 (or until sold out)<br/>
                <strong>Booking recommended</strong> especially for larger groups
              </p>
              <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-3 px-6 rounded-lg">
                {labelBookRoastOnline}
              </a>
            </div>
          </div>
        </section>

        {/* Dietary Information & FAQ */}
        <section className="py-16 bg-brand-50/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-stout-700 text-center mb-12">
              Menu Information & Dietary Requirements
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">Are there vegetarian options on the Nepalese menu?</h3>
                  <p className="text-brand-600">Yes! We offer dal bhat, vegetable momo, vegetable thali, and several vegetarian curries. All clearly marked on our menu.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">Can you adjust spice levels?</h3>
                  <p className="text-brand-600">Absolutely! Our chefs can adjust spice levels for most Nepalese dishes. Just let your server know your preference when ordering.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">Do you have a children's menu?</h3>
                  <p className="text-brand-600">Yes, we offer mild Nepalese dishes and traditional pub favorites sized for children, including fish & chips, chicken nuggets, and pasta.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">What about gluten-free options?</h3>
                  <p className="text-brand-600">Many of our Nepalese curries are naturally gluten-free. We also offer gluten-free alternatives for fish & chips and other pub classics.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">Is takeaway available for all menu items?</h3>
                  <p className="text-brand-600">Yes! All our dishes are available for takeaway. Call 01223 276027 to place your order. Collection typically ready in 20-30 minutes.</p>
                </div>
                
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-bold text-stout-700 mb-2">How authentic is your Nepalese food?</h3>
                  <p className="text-brand-600">Our Nepalese dishes use traditional recipes and cooking methods, with spices imported directly from Nepal for authentic flavors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-stout-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Try Our Unique Menu?
            </h2>
            <p className="text-xl text-neutral-200 mb-8">
              Book a table or order takeaway to experience the best of Nepal and Britain at Girton's historic thatched pub.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg">
                {labelBookOnline}
              </a>
              <a href="tel:01223276027" className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-4 px-8 rounded-lg text-lg">
                {labelOrderTakeaway}
              </a>
              <Link href="/about" className="bg-white hover:bg-neutral-100 text-stout-700 font-bold py-4 px-8 rounded-lg text-lg">
                Learn Our Story
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-neutral-300">
              <p><strong>Address:</strong> 89 High Street, Girton, Cambridge CB3 0QQ</p>
              <p><strong>Kitchen Hours:</strong> Daily 12:00-22:00 (22:30 Fri/Sat, 21:30 Sun)</p>
            </div>
          </div>
        </section>
      </RestaurantLayout>
    </>
  );
}
