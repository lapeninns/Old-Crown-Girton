import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from '@/components/animations/MotionWrappers';
import Link from '@/lib/debugLink';

export const metadata = getSEOTags({
  title: "Terms of Service | Old Crown Girton - Restaurant Booking & Service Conditions",
  description: "Terms of service for Old Crown Girton covering restaurant bookings, table reservations, cancellations and dining policies for our Cambridge pub.",
  keywords: ["Old Crown Girton terms", "restaurant booking terms", "pub terms of service Cambridge", "dining terms conditions"],
  canonicalUrlRelative: "/tos",
  openGraph: {
    title: "Terms of Service | Old Crown Girton",
    description: "Terms of service for Old Crown Girton covering restaurant bookings, table reservations and dining policies.",
    url: "https://oldcrowngirton.com//tos",
  },
});

export default function TOS() {
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
            "@type": "WebPage",
            "@id": "https://oldcrowngirton.com//tos#webpage",
            "name": "Terms of Service - Old Crown Girton",
            "description": "Terms of service and conditions for Old Crown Girton restaurant bookings, reservations and dining services.",
            "url": "https://oldcrowngirton.com//tos",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Old Crown Girton",
              "url": "https://oldcrowngirton.com/"
            },
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
              }
            },
            "mainContentOfPage": {
              "@type": "WebPageElement",
              "cssSelector": "main"
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2"]
            }
          }
        ])}
        
        {/* Hero Section with consistent styling */}
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16" aria-labelledby="tos-hero-heading">
          <div className="absolute inset-0 bg-black/10"></div>
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="tos-hero-heading" className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                Terms of Service
              </h1>
              <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                Please read these terms carefully as they govern your use of our restaurant services and website.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Main content with consistent layout */}
        <main className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              {/* Navigation breadcrumb */}
              <nav className="mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-brand-600">
                  <li><Link href="/" className="hover:text-brand-700 transition-colors">Home</Link></li>
                  <li><span className="mx-2">/</span></li>
                  <li><span className="text-brand-500">Terms of Service</span></li>
                </ol>
              </nav>

              <article className="prose prose-lg prose-brand max-w-4xl mx-auto">
                <div className="bg-brand-50 p-6 rounded-lg mb-8">
                  <p className="text-sm text-brand-700 mb-0">
                    <strong>Last updated:</strong> September 1, 2025
                  </p>
                </div>

                <div className="space-y-8">
                  <section>
                    <p className="text-lg leading-relaxed text-neutral-700">
                      These Terms of Service govern your use of Old Crown Girton's website and services. By making a booking, placing an order, or using our site, you agree to these terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">1. Service Description</h2>
                    <p className="leading-relaxed">
                      We provide restaurant dining, event bookings, and online ordering services (where available). Details of services, menus, and prices are available on our website and may be subject to change.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">2. Booking & Payment Terms</h2>
                    <ul className="space-y-2">
                      <li>• Bookings may require contact details and/or payment information</li>
                      <li>• Payment is due at the time of service or as specified during booking</li>
                      <li>• We accept major credit/debit cards and other payment methods as listed</li>
                      <li>• All prices include applicable VAT</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">3. Cancellation & Refund Policy</h2>
                    <ul className="space-y-2">
                      <li>• Bookings may be cancelled up to 24 hours before the scheduled time for a full refund</li>
                      <li>• Late cancellations or no-shows may incur a cancellation fee</li>
                      <li>• Refunds for online orders are subject to our refund policy and UK consumer rights</li>
                      <li>• Special events or large group bookings may have different cancellation terms</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">4. Liability Limitations & Consumer Rights</h2>
                    <p className="leading-relaxed mb-4">
                      We are not liable for indirect, incidental, or consequential damages. However, nothing in these terms limits your statutory rights under the Consumer Rights Act 2015, including:
                    </p>
                    <ul className="space-y-2">
                      <li>• Right to receive services that are performed with reasonable care and skill</li>
                      <li>• Right to receive services that match their description</li>
                      <li>• Right to a remedy if services are not provided correctly</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      We strive to ensure all information is accurate but cannot guarantee uninterrupted service availability.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">5. Intellectual Property</h2>
                    <p className="leading-relaxed">
                      All website content, branding, and materials are the property of Old Crown Girton or its licensors. You may not reproduce, distribute, or use content without written permission.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">6. Acceptable Use</h2>
                    <p className="leading-relaxed mb-4">When using our services or website, you agree to:</p>
                    <ul className="space-y-2">
                      <li>• Provide accurate and truthful information</li>
                      <li>• Treat our staff, property, and other customers with respect</li>
                      <li>• Not engage in disruptive or unlawful behavior</li>
                      <li>• Comply with our house rules and any specific venue requirements</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">7. Privacy & Data Protection</h2>
                    <p className="leading-relaxed">
                      Your privacy is important to us. Please review our <Link href="/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">Privacy Policy</Link> to understand how we collect, use, and protect your personal information in accordance with UK GDPR and data protection laws.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">8. Dispute Resolution</h2>
                    <p className="leading-relaxed">
                        In case of disputes, please contact us directly at <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link>. We aim to resolve all issues amicably. If unresolved, disputes will be subject to the jurisdiction of the courts of England and Wales.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">9. Changes to Terms</h2>
                    <p className="leading-relaxed">
                      We may update these terms from time to time. Changes will be posted on our website with an updated effective date. Continued use of our services constitutes acceptance of revised terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">10. Governing Law</h2>
                    <p className="leading-relaxed">
                      These terms are governed by the laws of England and Wales.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">11. Contact Information</h2>
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <p className="leading-relaxed mb-4">
                        For questions or concerns about these terms, please contact:
                      </p>
                      <div className="space-y-1">
                        <p><strong>Old Crown Girton</strong></p>
                        <p>89 High Street, Girton, Cambridge CB3 0QQ</p>
                          <p>Email: <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link></p>
                        <p>Phone: <Link href="tel:01223277217" className="text-brand-600 hover:text-brand-700 underline">+44 1223 277217</Link></p>
                      </div>
                    </div>
                  </section>
                </div>
              </article>
            </FadeIn>
          </div>
        </main>
      </RestaurantLayout>
    </>
  );
}
