import dynamic from 'next/dynamic';
import RestaurantLayout from '@/components/restaurant/Layout';
import { FadeIn } from '@/components/animations/MotionWrappers';
import Link from '@/lib/debugLink';
import { getContactInfo } from '@/lib/restaurantData';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/src/lib/seo/schema';
import {
  buttonRecipe,
  contentPanelRecipe,
  ctaPanelRecipe,
  glassPanelRecipe,
  heroChipRecipe,
  heroChipRowClassName,
  mapFrameRecipe,
  pageHeroDescriptionRecipe,
  pageHeroEyebrowRecipe,
  pageHeroInnerClassName,
  pageHeroOverlayClassName,
  pageHeroSectionRecipe,
  pageHeroTitleRecipe,
  panelTextRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  softPanelRecipe,
  subsectionTitleRecipe,
} from '@/src/design-system';

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

const BOOK_A_TABLE_PAGE_TITLE = 'Book a Table | Old Crown Girton';
const BOOK_A_TABLE_PAGE_DESCRIPTION =
  'Plan your visit and reserve a table at The Old Crown Girton. Book online or call the team during opening hours.';

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
        {renderSchemaTags([
          buildWebPageSchema({
            path: '/book-a-table',
            title: BOOK_A_TABLE_PAGE_TITLE,
            description: BOOK_A_TABLE_PAGE_DESCRIPTION,
          }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Book a Table', path: '/book-a-table' },
          ]),
        ])}
        <section
          className={pageHeroSectionRecipe()}
          aria-labelledby="book-table-hero-heading"
        >
          <div className={pageHeroOverlayClassName} />
          <FadeIn>
            <div className={pageHeroInnerClassName}>
              <p className={pageHeroEyebrowRecipe()}>
                Plan your visit
              </p>
              <h1
                id="book-table-hero-heading"
                className={pageHeroTitleRecipe('mt-3')}
              >
                Book a Table at The Old Crown Girton
              </h1>
              <p className={pageHeroDescriptionRecipe('mt-4')}>
                Secure your table for authentic Nepalese dishes, pub classics, garden gatherings, and milestone
                celebrations. Book online in moments or call us and we will confirm your reservation during opening
                hours.
              </p>
              <div className={heroChipRowClassName}>
                {BOOKING_HIGHLIGHTS.map((highlight) => (
                  <span
                    key={highlight}
                    className={heroChipRecipe()}
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
            <section className={`pt-12 ${sectionShellClassName}`} aria-labelledby="booking-options-heading">
              <div className={sectionInnerClassName}>
                <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
                  <div className={contentPanelRecipe('gap-6')}>
                      <RestaurantHoursCard />
                  </div>

                  <div className={contentPanelRecipe('gap-6')}>
                      <div>
                        <h2 id="booking-options-heading" className={subsectionTitleRecipe()}>
                          Book online or by phone
                        </h2>
                        <p className={panelTextRecipe('mt-3')}>
                          Reserve instantly online or call us and we will confirm your booking straight away during
                          opening hours.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <a
                          href={BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonRecipe({ variant: 'accent', size: 'md', className: 'text-stout-950' })}
                          style={{ touchAction: 'manipulation' }}
                        >
                          🗓️ Book online ↗
                        </a>
                        <a
                          href={`tel:${phoneDial}`}
                          className={buttonRecipe({ variant: 'brand', size: 'md' })}
                          style={{ touchAction: 'manipulation' }}
                        >
                          📞 Call {phoneDisplay}
                        </a>
                      </div>
                      <div className={softPanelRecipe('text-sm text-brand-700')}>
                        <p className="font-semibold text-brand-700">Need help planning?</p>
                        <p className="mt-2 text-brand-600">
                          We are happy to advise on seating, celebrations, or accessibility needs. Mention any special
                          requests when you book.
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="py-4" aria-labelledby="visit-info-heading">
              <div className={sectionInnerClassName}>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className={contentPanelRecipe('gap-4')}>
                      <div>
                        <h2 id="visit-info-heading" className={subsectionTitleRecipe()}>
                          Find Us
                        </h2>
                        <p className={panelTextRecipe('mt-2')}>
                          {address}
                        </p>
                      </div>
                      <InteractiveMap
                        className={mapFrameRecipe('h-[260px]')}
                        height="260px"
                        title="Old Crown Girton map"
                      />
                      <a
                        href={contact.address.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonRecipe({ variant: 'ghost', size: 'sm', className: 'justify-start px-0' })}
                        style={{ touchAction: 'manipulation' }}
                      >
                        View directions on Google Maps ↗
                      </a>
                  </div>

                  <div className={contentPanelRecipe('gap-4')}>
                      <div>
                        <h2 className={subsectionTitleRecipe()}>Contact the Team</h2>
                        <p className={panelTextRecipe('mt-2')}>
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
                          className={buttonRecipe({ variant: 'outline', size: 'md' })}
                          style={{ touchAction: 'manipulation' }}
                        >
                          Contact Page →
                        </Link>
                      </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <section className="py-4" aria-labelledby="booking-tips-heading">
              <div className={sectionInnerClassName}>
                <div className={ctaPanelRecipe('gap-6')}>
                    <h2 id="booking-tips-heading" className={subsectionTitleRecipe('text-white')}>
                      Booking Tips
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {BOOKING_TIPS.map((tip) => (
                        <div
                          key={tip.text}
                          className={glassPanelRecipe('p-4 text-sm')}
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
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
