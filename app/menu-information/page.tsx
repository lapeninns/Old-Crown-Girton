import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from '@/components/animations/MotionWrappers';
import MenuInfoCollapse from '@/components/menu/MenuInfoCollapse';
import Link from '@/lib/debugLink';

export const metadata = getSEOTags({
  title: "Menu Information & Dietary Requirements | Old Crown Girton - Allergens, Dietary Options & Food Safety",
  description: "Comprehensive allergen information, dietary requirements, and menu transparency for Old Crown Girton. We comply with UK Food Information Regulations 2014 and Natasha's Law.",
  keywords: ["Old Crown Girton allergens", "dietary requirements Cambridge", "gluten free restaurant", "vegetarian Girton", "food allergies", "menu information", "Natasha's Law compliance"],
  canonicalUrlRelative: "/menu-information",
  openGraph: {
    title: "Menu Information & Dietary Requirements | Old Crown Girton",
    description: "Complete allergen information and dietary options at Old Crown Girton. Safe dining for all dietary requirements.",
    url: "https://oldcrowngirton.com//menu-information",
  },
});

const faqItems = [
  {
    title: "What allergen information do you provide?",
    content: (
      <div className="space-y-4">
        <p>
          We comply with UK Food Information Regulations 2014 and provide comprehensive allergen information for all 14 major allergens:
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">The 14 Major Allergens:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-700">
            <ul className="space-y-1">
              <li>• Cereals containing gluten (wheat, rye, barley, oats)</li>
              <li>• Crustaceans (prawns, crabs, lobsters)</li>
              <li>• Eggs</li>
              <li>• Fish</li>
              <li>• Peanuts</li>
              <li>• Soybeans</li>
              <li>• Milk (including lactose)</li>
            </ul>
            <ul className="space-y-1">
              <li>• Tree nuts (almonds, hazelnuts, walnuts, etc.)</li>
              <li>• Celery (including celeriac)</li>
              <li>• Mustard</li>
              <li>• Sesame seeds</li>
              <li>• Sulphur dioxide and sulphites (&gt;10mg/kg or 10mg/l)</li>
              <li>• Lupin</li>
              <li>• Molluscs (mussels, oysters, squid)</li>
            </ul>
          </div>
        </div>
        <p>
          All allergen information is available in writing on our menu and our trained staff can provide detailed information about ingredients and preparation methods.
        </p>
      </div>
    )
  },
  {
    title: "How do you prevent cross-contamination?",
    content: (
      <div className="space-y-4">
        <p>
          We take cross-contamination seriously and follow strict kitchen protocols:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Kitchen Safety Measures:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Separate preparation areas for allergen-free dishes</li>
            <li>• Dedicated utensils and equipment for gluten-free preparation</li>
            <li>• Thorough cleaning between preparing dishes with different allergens</li>
            <li>• Staff hand washing protocols between handling different ingredients</li>
            <li>• Separate storage containers with clear labelling</li>
            <li>• Fresh oil for gluten-free frying (chips, etc.)</li>
            <li>• Regular staff training on allergen handling</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Important:</strong> While we take every precaution, we cannot guarantee a completely allergen-free environment. Please inform us of any severe allergies when booking or ordering.
        </p>
      </div>
    )
  },
  {
    title: "Are you compliant with Natasha's Law?",
    content: (
      <div className="space-y-4">
        <p>
          Yes, we fully comply with Natasha's Law (Prepacked for Direct Sale regulations) that came into effect on 1 October 2021.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Our PPDS Compliance:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• All prepacked food made on-site has full ingredient labelling</li>
            <li>• Allergenic ingredients are clearly emphasised on labels</li>
            <li>• Product names and ingredient lists are displayed prominently</li>
            <li>• Sandwiches, salads, and pre-made items all carry proper labels</li>
            <li>• Takeaway containers are properly labelled</li>
            <li>• Labels remain with the product until consumption</li>
          </ul>
        </div>
        <p>
          This ensures you have all the information needed to make safe food choices, especially for items like pre-made sandwiches, salads, and packaged takeaway meals.
        </p>
      </div>
    )
  },
  {
    title: "What vegetarian and vegan options do you offer?",
    content: (
      <div className="space-y-4">
        <p>
          We offer extensive vegetarian and vegan options across our menu, clearly marked with 'V' (vegetarian) and 'VE' (vegan) symbols.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indiagreen-50 border border-indiagreen-200 rounded-lg p-4">
            <h4 className="font-semibold text-indiagreen-800 mb-2">Vegetarian Options:</h4>
            <ul className="text-sm text-indiagreen-700 space-y-1">
              <li>• Traditional Nepalese vegetable curries</li>
              <li>• Stuffed tandoori mushrooms</li>
              <li>• Vegetable momos (Nepalese dumplings)</li>
              <li>• Dal dishes and lentil curries</li>
              <li>• Paneer-based dishes</li>
              <li>• Vegetable biryanis and pilafs</li>
              <li>• Fresh salads and sides</li>
            </ul>
          </div>
          <div className="bg-marigold-50 border border-marigold-200 rounded-lg p-4">
            <h4 className="font-semibold text-marigold-800 mb-2">Vegan Options:</h4>
            <ul className="text-sm text-marigold-700 space-y-1">
              <li>• Plant-based Nepalese curries</li>
              <li>• Vegetable momos (dairy-free version)</li>
              <li>• Coconut-based curries</li>
              <li>• Vegan naans and breads</li>
              <li>• Mixed vegetable dishes</li>
              <li>• Plant-based protein options</li>
              <li>• Fresh fruit desserts</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Note:</strong> We can modify many dishes to be vegan-friendly. Please ask our staff about plant-based alternatives for milk, ghee, and other dairy products.
        </p>
      </div>
    )
  },
  {
    title: "Do you offer gluten-free options?",
    content: (
      <div className="space-y-4">
        <p>
          Yes, we have many naturally gluten-free dishes and can accommodate gluten-free requirements with proper precautions.
        </p>
        <div className="bg-cardamom-50 border border-cardamom-200 rounded-lg p-4">
          <h4 className="font-semibold text-cardamom-800 mb-2">Gluten-Free Options (marked 'GF'):</h4>
          <ul className="text-sm text-cardamom-700 space-y-1">
            <li>• Rice-based dishes and biryanis</li>
            <li>• Most curries and dal preparations</li>
            <li>• Tandoori meats and vegetables</li>
            <li>• Grilled fish and meat dishes</li>
            <li>• Fresh salads (check dressings)</li>
            <li>• Certain starters and snacks</li>
            <li>• Gluten-free naan alternatives available</li>
          </ul>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">Gluten-Free Precautions:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• We use separate fryers for gluten-free items</li>
            <li>• Dedicated preparation areas to avoid cross-contamination</li>
            <li>• Staff trained on gluten-free handling procedures</li>
            <li>• Fresh cooking oil for gluten-free dishes</li>
            <li>• Careful ingredient sourcing and verification</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Important:</strong> Please inform us when booking if you require gluten-free options, especially for severe coeliac disease, so we can take extra precautions.
        </p>
      </div>
    )
  },
  {
    title: "Can you accommodate religious dietary requirements?",
    content: (
      <div className="space-y-4">
        <p>
          We respect and accommodate various religious dietary requirements. Please inform us of your specific needs when booking.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">General Accommodations:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• No pork products in many dishes</li>
              <li>• Vegetarian and vegan options available</li>
              <li>• Alcohol-free food preparation options</li>
              <li>• Separate preparation for religious requirements</li>
              <li>• Ingredient transparency and disclosure</li>
            </ul>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="font-semibold text-teal-800 mb-2">Special Requests:</h4>
            <ul className="text-sm text-teal-700 space-y-1">
              <li>• Kosher-style preparation (advance notice required)</li>
              <li>• Jain dietary requirements (no root vegetables)</li>
              <li>• Buddhist dietary preferences</li>
              <li>• Custom meal preparation for specific needs</li>
              <li>• Consultation with our head chef available</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Please note:</strong> While we accommodate religious dietary requirements, we are not a certified halal or kosher establishment. We recommend discussing your specific requirements with our team when booking.
        </p>
      </div>
    )
  },
  {
    title: "What children's options and dietary considerations do you provide?",
    content: (
      <div className="space-y-4">
        <p>
          We welcome families and provide various options suitable for children with different dietary needs and preferences.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Kids' Menu Highlights:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Mild curry options with reduced spice levels</li>
            <li>• Plain rice and naan bread</li>
            <li>• Chicken tikka (popular with children)</li>
            <li>• British classics like fish and chips</li>
            <li>• Smaller portion sizes available</li>
            <li>• Fresh fruit options for dessert</li>
            <li>• Dairy-free and gluten-free options</li>
          </ul>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h4 className="font-semibold text-pink-800 mb-2">Special Considerations:</h4>
          <ul className="text-sm text-pink-700 space-y-1">
            <li>• Nut-free options (please specify if severe allergy)</li>
            <li>• No artificial colours in many dishes</li>
            <li>• Reduced sodium options available</li>
            <li>• Lactose-free alternatives</li>
            <li>• Baby food heating facilities available</li>
            <li>• High chairs and child-friendly seating</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Family dining:</strong> Our staff are experienced in helping families find suitable options for children. Don't hesitate to ask about modifying dishes or preparation methods.
        </p>
      </div>
    )
  },
  {
    title: "Do you provide nutritional information?",
    content: (
      <div className="space-y-4">
        <p>
          We provide comprehensive nutritional information to help you make informed choices about your dining experience.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Available Information:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Approximate calorie content per dish</li>
            <li>• Protein, carbohydrate, and fat content</li>
            <li>• Sodium levels (important for heart health)</li>
            <li>• Fibre content information</li>
            <li>• Sugar content where relevant</li>
            <li>• Vitamin and mineral highlights</li>
            <li>• Portion size guidance</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Health-Conscious Options:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Low-sodium dishes available</li>
            <li>• Diabetic-friendly options (low sugar, complex carbs)</li>
            <li>• Heart-healthy choices with good fats</li>
            <li>• High-protein options for fitness goals</li>
            <li>• Lighter portions and sides available</li>
            <li>• Fresh, unprocessed ingredient focus</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Request information:</strong> Detailed nutritional information is available upon request. Our staff can provide specific details about ingredients and preparation methods to help with dietary planning.
        </p>
      </div>
    )
  },
  {
    title: "How do I request special dietary accommodations?",
    content: (
      <div className="space-y-4">
        <p>
          We're committed to accommodating your dietary needs safely and deliciously. Here's how to ensure we can serve you properly:
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-800 mb-2">When Booking:</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Call us directly at <strong>+44 1223 277217</strong> to discuss requirements</li>
            <li>• Specify any severe allergies or medical dietary needs</li>
            <li>• Mention the number of people with dietary requirements</li>
            <li>• Ask about specific dishes or ingredients you're unsure about</li>
            <li>• Request advance preparation if needed (24-48 hours notice)</li>
          </ul>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h4 className="font-semibold text-cyan-800 mb-2">When Ordering:</h4>
          <ul className="text-sm text-cyan-700 space-y-1">
            <li>• Inform your server about any allergies or dietary restrictions</li>
            <li>• Ask to speak with the kitchen manager for severe allergies</li>
            <li>• Request ingredient lists for dishes you're considering</li>
            <li>• Confirm preparation methods (e.g., separate fryer for gluten-free)</li>
            <li>• Don't hesitate to ask questions about any dish</li>
          </ul>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h4 className="font-semibold text-rose-800 mb-2">Emergency Contacts:</h4>
          <p className="text-sm text-rose-700">
            If you have severe allergies that could result in anaphylaxis, please ensure you carry your medication and inform our staff immediately. We maintain clear protocols for emergency situations and can assist in contacting emergency services if needed.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "What about takeaway and delivery orders?",
    content: (
      <div className="space-y-4">
        <p>
          We maintain the same high standards for allergen safety and dietary accommodations for all takeaway and delivery orders.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-emerald-800 mb-2">Takeaway & Delivery Safety:</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• All containers are clearly labelled with allergen information</li>
            <li>• Separate packaging for allergen-free items</li>
            <li>• Written allergen information included with orders</li>
            <li>• Temperature-controlled delivery for food safety</li>
            <li>• Clear ingredient lists available by phone or online</li>
            <li>• Special dietary requirements noted on order tickets</li>
          </ul>
        </div>
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
          <h4 className="font-semibold text-lime-800 mb-2">Ordering Process:</h4>
          <ul className="text-sm text-lime-700 space-y-1">
            <li>• Mention dietary requirements when placing phone orders</li>
            <li>• Online ordering includes allergen information fields</li>
            <li>• Confirmation calls for complex dietary requirements</li>
            <li>• Kitchen notifications for special preparation needs</li>
            <li>• Double-checking procedures before dispatch</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Distance selling compliance:</strong> As required by UK regulations, we provide allergen information both when you place your order and when the food is delivered or collected.
        </p>
      </div>
    )
  },
  {
    title: "How often do you update your menu and seasonal ingredients?",
    content: (
      <div className="space-y-4">
        <p>
          We regularly review and update our menu to reflect seasonal availability, customer preferences, and new dietary options.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Menu Updates:</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Seasonal specials introduced quarterly</li>
            <li>• Fresh ingredient sourcing affects daily availability</li>
            <li>• New dietary options added based on customer feedback</li>
            <li>• Traditional recipes maintained year-round</li>
            <li>• Special event menus for holidays and celebrations</li>
            <li>• Local sourcing when possible for freshness</li>
          </ul>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h4 className="font-semibold text-teal-800 mb-2">Staying Informed:</h4>
          <ul className="text-sm text-teal-700 space-y-1">
            <li>• Website menu updated within 24 hours of changes</li>
            <li>• Social media announcements for new items</li>
            <li>• Staff training on all menu changes and allergen updates</li>
            <li>• Customer notifications for discontinued favourite items</li>
            <li>• Regular review of allergen information accuracy</li>
          </ul>
        </div>
        <p className="text-sm text-neutral-600">
          <strong>Always check:</strong> If you have specific dietary requirements, we recommend calling ahead to confirm current menu options and ingredient availability, especially during busy periods or seasonal transitions.
        </p>
      </div>
    )
  }
];

export default function MenuInformationPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://oldcrowngirton.com//menu-information#faqpage",
            "name": "Menu Information & Dietary Requirements - Old Crown Girton",
            "description": "Comprehensive allergen information, dietary requirements, and food safety information for Old Crown Girton restaurant.",
            "url": "https://oldcrowngirton.com//menu-information",
            "mainEntity": faqItems.map((item, index) => ({
              "@type": "Question",
              "@id": `https://oldcrowngirton.com//menu-information#faq-${index}`,
              "name": item.title,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": typeof item.content === 'string' ? item.content : item.title // Simplified for schema
              }
            })),
            "about": {
              "@type": "LocalBusiness",
              "name": "Old Crown Girton",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "89 High Street",
                "addressLocality": "Girton",
                "addressRegion": "Cambridgeshire",
                "postalCode": "CB3 0QQ",
                "addressCountry": "GB"
              },
              "telephone": "+441223277217",
              "email": "oldcrown@lapeninns.com",
              "servesCuisine": ["Nepalese", "British", "Indian"],
              "priceRange": "$$"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://oldcrowngirton.com//menu-information#webpage",
            "name": "Menu Information & Dietary Requirements",
            "description": "Complete guide to allergens, dietary options and food safety at Old Crown Girton",
            "url": "https://oldcrowngirton.com//menu-information",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Old Crown Girton",
              "url": "https://oldcrowngirton.com/"
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2", ".faq-question"]
            }
          }
        ])}
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-16 md:py-20" aria-labelledby="menu-info-hero-heading">
          <div className="absolute inset-0 bg-black/10"></div>
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="menu-info-hero-heading" className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                Menu Information & Dietary Requirements
              </h1>
              <p className="text-lg md:text-xl text-brand-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Your safety and dining satisfaction are our priorities. Find comprehensive information about allergens, dietary options, and our commitment to food safety compliance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">UK Food Regulations 2014 Compliant</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Natasha's Law Certified</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">14 Allergen Information</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Emergency Contact Banner */}
        <section className="bg-red-50 border-l-4 border-red-400 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Severe Allergies:</strong> If you have life-threatening allergies, please call us at{' '}
                  <Link href="tel:01223277217" className="font-medium underline hover:no-underline">
                    +44 1223 277217
                  </Link>{' '}
                  before visiting to discuss safety protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation breadcrumb */}
        <nav className="bg-white py-4 border-b" aria-label="Breadcrumb">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-2 text-sm text-brand-600">
              <li><Link href="/" className="hover:text-brand-700 transition-colors">Home</Link></li>
              <li><span className="mx-2">/</span></li>
              <li><span className="text-brand-500">Menu Information</span></li>
            </ol>
          </div>
        </nav>

        {/* Main FAQ Content */}
        <main className="bg-neutral-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="mb-8 text-center">
                <p className="text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                  We are committed to providing safe, transparent, and inclusive dining experiences. Our comprehensive FAQ covers everything you need to know about allergens, dietary accommodations, and food safety practices.
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 12.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Allergen Safety</h3>
                  <p className="text-sm text-neutral-600">14 major allergens clearly identified and cross-contamination prevention protocols</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Dietary Options</h3>
                  <p className="text-sm text-neutral-600">Vegetarian, vegan, gluten-free, and religious dietary requirements accommodated</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Legal Compliance</h3>
                  <p className="text-sm text-neutral-600">Full compliance with UK Food Information Regulations and Natasha's Law</p>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <MenuInfoCollapse items={faqItems} />
              </div>

              {/* Contact Information */}
              <div className="mt-12 bg-brand-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-brand-700 mb-2">
                    Still Have Questions?
                  </h2>
                  <p className="text-neutral-700">
                    Our team is here to help ensure your dining experience is safe and enjoyable.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-brand-700 mb-2">Call Us</h3>
                    <p className="text-neutral-600 mb-1">Speak directly with our team</p>
                    <Link href="tel:01223277217" className="text-lg font-bold text-brand-600 hover:text-brand-700">
                      +44 1223 277217
                    </Link>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-brand-700 mb-2">Email Us</h3>
                    <p className="text-neutral-600 mb-1">Send us your dietary requirements</p>
                    <Link href="mailto:oldcrown@lapeninns.com" className="text-lg font-bold text-brand-600 hover:text-brand-700">
                      oldcrown@lapeninns.com
                    </Link>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-600">
                    <strong>Location:</strong> 89 High Street, Girton, Cambridge CB3 0QQ
                  </p>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="mt-8 text-center">
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                  This information is regularly reviewed and updated to ensure accuracy. While we take every precaution to prevent cross-contamination, 
                  we cannot guarantee a completely allergen-free environment. Please consult with our staff for the most current information about 
                  ingredients and preparation methods. Last updated: September 1, 2025.
                </p>
              </div>
            </FadeIn>
          </div>
        </main>
      </RestaurantLayout>
    </>
  );
}