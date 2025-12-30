import dynamic from 'next/dynamic';
import RestaurantLayout from '@/components/restaurant/Layout';
import { FadeIn } from '@/components/animations/MotionWrappers';
import Link from '@/lib/debugLink';
import { getContactInfo } from '@/lib/restaurantData';
import { getSEOTags } from '@/libs/seo';

const BOOKING_URL = 'https://www.nabatable.com/restaurants/the-old-crown-girton/book';

const RestaurantHoursCard = dynamic(() => import('@/components/restaurant/RestaurantHoursCard'));
const InteractiveMap = dynamic(() => import('@/components/restaurant/InteractiveMap'));

export const metadata = getSEOTags({
  title: 'Book a Table | Old Crown Girton',
  description:
    'Plan your visit and reserve a table at The Old Crown Girton. Book online or call the team during opening hours.',
  canonicalUrlRelative: '/book-a-table',
  openGraph: {
    title: 'Book a Table at Old Crown Girton',
    description:
      'Plan your visit and reserve a table at The Old Crown Girton. Book online or call the team during opening hours.',
    url: 'https://oldcrowngirton.com/book-a-table',
  },
});

const BOOKING_HIGHLIGHTS = [
  'Authentic Nepalese & British pub classics',
  'Family & dog friendly spaces',
  'Free on-site parking in Girton',
  'Garden marquee & private hire options',
];

const BOOKING_TIPS = [
  {
    icon: '⏱️',
    text: 'Lunch reservations turn quickly—call if you are running late so we can keep your table.',
  },
  {
    icon: '🌶️',
    text: 'Mention dietary needs or spice preferences when you call and the kitchen will tailor dishes.',
  },
  {
    icon: '🥂',
    text: 'Celebrating? We can set up welcome drinks or reserve a cosy corner—just let us know.',
  },
  {
    icon: '♿',
    text: 'Accessibility needs or highchairs required? Mention it when you call so the team can prepare.',
  },
];

export default function BookATablePage() {
  const contact = getContactInfo();
  const phoneDisplay = contact.phone.display || '01223277217';
  const phoneDial = contact.phone.primary.replace(/\s+/g, '');
  const email = contact.email.bookings || contact.email.primary;
  const address = `${contact.address.street}, ${contact.address.area}, ${contact.address.city}, ${contact.address.postcode}`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      `,
        }}
      />
      <RestaurantLayout>
        <section
          className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16"
          aria-labelledby="book-table-hero-heading"
        >
          <div className="absolute inset-0 bg-black/10" />
          <FadeIn>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-100/80">
                Plan your visit
              </p>
              <h1
                id="book-table-hero-heading"
                className="mt-3 text-2xl md:text-3xl font-display font-bold leading-tight"
              >
                Book a Table at The Old Crown Girton
              </h1>
              <p className="mt-4 text-base md:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
                Secure your table for authentic Nepalese dishes, pub classics, garden gatherings, and milestone
                celebrations. Book online in moments or call us and we will confirm your reservation during opening
                hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {BOOKING_HIGHLIGHTS.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur"
                  >
                    <span aria-hidden="true" className="text-base text-white/80">✅</span>
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        <main className="space-y-16 bg-white pb-16">
          <FadeIn>
            <section className="pt-12" aria-labelledby="booking-options-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
                  <div className="card bg-white shadow-xl border border-brand-100">
                    <div className="card-body gap-6">
                      <RestaurantHoursCard />
                    </div>
                  </div>

                  <div className="card bg-white shadow-xl border border-brand-100">
                    <div className="card-body gap-6">
                      <div>
                        <h2 id="booking-options-heading" className="text-2xl font-display font-bold text-brand-700">
                          Book online or by phone
                        </h2>
                        <p className="mt-3 text-sm text-brand-600 leading-relaxed">
                          Reserve instantly online or call us and we will confirm your booking straight away during
                          opening hours.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <a
                          href={BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn bg-accent text-neutral-900 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          style={{ touchAction: 'manipulation' }}
                        >
                          🗓️ Book online ↗
                        </a>
                        <a
                          href={`tel:${phoneDial}`}
                          className="btn bg-brand-700 text-white hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          style={{ touchAction: 'manipulation' }}
                        >
                          📞 Call {phoneDisplay}
                        </a>
                      </div>
                      <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-brand-700">
                        <p className="font-semibold text-brand-700">Need help planning?</p>
                        <p className="mt-2 text-brand-600">
                          We are happy to advise on seating, celebrations, or accessibility needs. Mention any special
                          requests when you book.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="py-4" aria-labelledby="visit-info-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="card bg-white shadow-xl border border-brand-100">
                    <div className="card-body gap-4">
                      <div>
                        <h2 id="visit-info-heading" className="text-2xl font-display font-bold text-brand-700">
                          Find Us
                        </h2>
                        <p className="mt-2 text-sm text-brand-600">
                          {address}
                        </p>
                      </div>
                      <InteractiveMap
                        className="h-[260px] rounded-xl shadow-md overflow-hidden bg-neutral-50"
                        height="260px"
                        title="Old Crown Girton map"
                      />
                      <a
                        href={contact.address.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost justify-start px-0 text-brand-700 hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        style={{ touchAction: 'manipulation' }}
                      >
                        View directions on Google Maps ↗
                      </a>
                    </div>
                  </div>

                  <div className="card bg-white shadow-xl border border-brand-100">
                    <div className="card-body gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-brand-700">Contact the Team</h2>
                        <p className="mt-2 text-sm text-brand-600 leading-relaxed">
                          Questions about a booking, accessibility, allergies, or special requests? Get in touch and we
                          will help plan your visit.
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-brand-700">
                        <p>
                          <strong>Email:</strong>{' '}
                          <a href={`mailto:${email}`} className="link link-hover text-brand-600">
                            {email}
                          </a>
                        </p>
                        <p>
                          <strong>Phone:</strong>{' '}
                          <a href={`tel:${phoneDial}`} className="link link-hover text-brand-600">
                            {phoneDisplay}
                          </a>
                        </p>
                      </div>
                      <div className="mt-auto">
                        <Link
                          href="/contact"
                          className="btn btn-outline border-brand-300 text-brand-700 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          style={{ touchAction: 'manipulation' }}
                        >
                          Contact Page →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="py-4" aria-labelledby="booking-tips-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card bg-brand-700 text-white shadow-xl border border-brand-600">
                  <div className="card-body gap-6">
                    <h2 id="booking-tips-heading" className="text-2xl font-display font-bold">
                      Booking Tips
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {BOOKING_TIPS.map((tip) => (
                        <div
                          key={tip.text}
                          className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-white/90"
                        >
                          <div className="flex items-start gap-3">
                            <span aria-hidden="true" className="text-lg">
                              {tip.icon}
                            </span>
                            <p>{tip.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
