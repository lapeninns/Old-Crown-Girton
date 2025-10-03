import { getSEOTags, renderSchemaTags } from "@/libs/seo";
import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn } from '@/components/animations/MotionWrappers';
import Link from '@/lib/debugLink';

export const metadata = getSEOTags({
  title: "Privacy Policy | Old Crown Girton - Data Protection & GDPR Compliance",
  description: "Privacy policy for Old Crown Girton outlining data handling for restaurant bookings, enquiries and website usage. GDPR compliant data protection policy.",
  keywords: ["Old Crown Girton privacy policy", "restaurant data protection", "GDPR compliance Cambridge", "pub privacy policy"],
  canonicalUrlRelative: "/privacy-policy",
  openGraph: {
    title: "Privacy Policy | Old Crown Girton",
    description: "Privacy policy for Old Crown Girton outlining data handling for restaurant bookings, enquiries and website usage.",
    url: "https://oldcrowngirton.com//privacy-policy",
  },
});

export default function PrivacyPolicy() {
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
            "@id": "https://oldcrowngirton.com//privacy-policy#webpage",
            "name": "Privacy Policy - Old Crown Girton",
            "description": "Privacy policy and data protection information for Old Crown Girton restaurant bookings, enquiries and website usage.",
            "url": "https://oldcrowngirton.com//privacy-policy",
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
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16" aria-labelledby="privacy-hero-heading">
          <div className="absolute inset-0 bg-black/10"></div>
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="privacy-hero-heading" className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                Your privacy matters to us. Learn how we collect, use, and protect your personal information.
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
                  <li><span className="text-brand-500">Privacy Policy</span></li>
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
                      This Privacy Policy explains how Old Crown Girton, located in Girton, Cambridge, UK, collects, uses, and protects your personal information in accordance with UK GDPR, the Data Protection Act 2018, and other applicable laws.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">1. Data Collection Practices</h2>
                    <p className="leading-relaxed mb-4">We may collect the following information:</p>
                    <ul className="space-y-2">
                      <li><strong>Personal Information:</strong> Name, contact details, booking information, dietary preferences (if provided)</li>
                      <li><strong>Payment Data:</strong> Card details (processed securely via third-party payment processors; we do not store full card numbers)</li>
                      <li><strong>Cookies & Usage Data:</strong> Device information, IP address, browsing activity, preferences</li>
                      <li><strong>Marketing Preferences:</strong> Newsletter sign-ups, event participation</li>
                      <li><strong>Order/Delivery Data:</strong> Address, order details (if using delivery platforms)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">2. Legal Basis for Processing</h2>
                    <p className="leading-relaxed mb-4">We process your data under the following lawful bases:</p>
                    <ul className="space-y-2">
                      <li><strong>Contract:</strong> To fulfill reservations, orders, or service requests</li>
                      <li><strong>Consent:</strong> For marketing communications and optional cookies</li>
                      <li><strong>Legal Obligation:</strong> Compliance with tax, health & safety, or regulatory requirements</li>
                      <li><strong>Legitimate Interests:</strong> Service improvement, fraud prevention, business analytics</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">3. Data Retention & Deletion</h2>
                    <ul className="space-y-2">
                      <li>• Personal data is retained only as long as necessary for the purpose collected</li>
                      <li>• Booking/payment data: retained for up to 7 years for legal/accounting purposes</li>
                      <li>• Marketing data: retained until you withdraw consent</li>
                      <li>• Analytics data: typically retained for 26 months</li>
                      <li>• You may request deletion of your data at any time (subject to legal exceptions)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">4. Third-Party Integrations</h2>
                    <p className="leading-relaxed mb-4">We may share data with:</p>
                    <ul className="space-y-2">
                      <li><strong>Payment Processors:</strong> (e.g., Stripe, Square) for secure transactions</li>
                      <li><strong>Delivery Platforms:</strong> (e.g., Deliveroo, Uber Eats) for order fulfillment</li>
                      <li><strong>Marketing Tools:</strong> (e.g., Mailchimp) for newsletters and communications</li>
                      <li><strong>Website Analytics:</strong> (e.g., Google Analytics) for site improvement</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      All third parties are contractually required to comply with UK data protection laws and maintain appropriate security measures.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">5. Your Rights Under UK GDPR</h2>
                    <p className="leading-relaxed mb-4">You have the right to:</p>
                    <ul className="space-y-2">
                      <li><strong>Access:</strong> Request copies of your personal data</li>
                      <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                      <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                      <li><strong>Restriction:</strong> Limit how we process your data</li>
                      <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                      <li><strong>Withdraw consent:</strong> Remove consent for marketing or optional processing</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                 To exercise your rights, contact us at <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link>.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">6. Cookie Policy & Consent Management</h2>
                    <p className="leading-relaxed mb-4">We use cookies to enhance your experience and analyze site usage:</p>
                    <ul className="space-y-2">
                      <li><strong>Essential cookies:</strong> Required for site operation and security</li>
                      <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
                      <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      You can manage cookie preferences via our website's cookie banner or your browser settings. Disabling certain cookies may affect site functionality.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">7. Data Security</h2>
                    <p className="leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your data, including:
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li>• Encryption of sensitive data in transit and at rest</li>
                      <li>• Regular security assessments and updates</li>
                      <li>• Access controls and staff training</li>
                      <li>• Secure hosting and backup procedures</li>
                    </ul>
                    <p className="leading-relaxed mt-4">
                      While we take security seriously, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">8. International Data Transfers</h2>
                    <p className="leading-relaxed">
                      Some of our service providers may process data outside the UK/EEA. When this occurs, we ensure adequate protection through approved transfer mechanisms such as adequacy decisions or standard contractual clauses.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">9. Children's Privacy</h2>
                    <p className="leading-relaxed">
                      Our services are not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">10. Updates to This Policy</h2>
                    <p className="leading-relaxed">
                      We may update this policy from time to time. Material changes will be notified via email (where possible) or prominent notice on our website. The updated version will be effective immediately upon posting.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-display font-bold text-brand-700 mb-4">11. Contact Information & Data Protection Officer</h2>
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <p className="leading-relaxed mb-4">
                        For data protection queries, to exercise your rights, or to make a complaint:
                      </p>
                      <div className="space-y-1 mb-4">
                        <p><strong>Data Protection Officer</strong></p>
                        <p>Old Crown Girton</p>
                        <p>89 High Street, Girton, Cambridge CB3 0QQ</p>
                        <p>Email: <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link></p>
                          <p>Email: <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link></p>
                          <p>Email: <Link href="mailto:oldcrown@lapeninns.com" className="text-brand-600 hover:text-brand-700 underline">oldcrown@lapeninns.com</Link></p>
                        <p>Phone: <Link href="tel:01223277217" className="text-brand-600 hover:text-brand-700 underline">+44 1223 277217</Link></p>
                      </div>
                      <p className="text-sm leading-relaxed">
                        You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues:
                      </p>
                      <div className="text-sm space-y-1 mt-2">
                        <p><strong>ICO</strong> - <Link href="https://ico.org.uk" className="text-brand-600 hover:text-brand-700 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</Link></p>
                        <p>Phone: +44 1223 277217</p>
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
