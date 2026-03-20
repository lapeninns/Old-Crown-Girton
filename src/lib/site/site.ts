import config from '@/config';
import restaurantConfig from '@/config/restaurant.json';

type DayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const DAY_TO_SCHEMA: Record<DayName, string> = {
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
};

function normalizeOrigin(value?: string) {
  const fallback = `https://${config.domainName}`;
  const raw = value || fallback;
  return raw.replace(/\/+$/, '');
}

export const SITE_ORIGIN = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL
);

export function siteUrl(path = '/') {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}

export function metadataBaseUrl() {
  return new URL(`${SITE_ORIGIN}/`);
}

export const siteMetadata = {
  name: 'The Old Crown Girton',
  title: 'The Old Crown Girton | Historic Thatched Pub & Nepalese Restaurant',
  description:
    'Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics. Book: 01223277217',
  domainName: config.domainName,
  locale: 'en-GB',
  publisher: 'Lapen Inns',
  defaultSocialImage: siteUrl('/opengraph-image.png'),
};

export const restaurantFacts = {
  name: 'The Old Crown Girton',
  alternateName: 'Old Crown Girton',
  tagline: 'Historic Thatched Pub & Nepalese Restaurant',
  description:
    'Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics.',
  telephone: restaurantConfig.phone,
  email: 'oldcrown@lapeninns.com',
  cuisines: ['Nepalese', 'British Pub Food'],
  priceRange: '££',
  acceptsReservations: true,
  address: {
    streetAddress: restaurantConfig.address.street,
    addressLocality: restaurantConfig.address.city,
    addressRegion: restaurantConfig.address.state,
    postalCode: restaurantConfig.address.zip,
    addressCountry: 'GB',
  },
  geo: {
    latitude: 52.2425913,
    longitude: 0.0814946,
  },
  social: {
    facebook: 'https://www.facebook.com/oldcrowngirton',
    instagram: 'https://www.instagram.com/theoldcrowngirton',
  },
  logo: siteUrl('/images/brand/OldCrownLogo.png'),
  images: [
    siteUrl('/images/brand/OldCrownLogo.png'),
    siteUrl('/images/slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg'),
    siteUrl('/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg'),
  ],
  menuUrl: siteUrl('/menu'),
  bookingUrl: siteUrl('/book-a-table'),
  mapUrl: siteUrl('/contact'),
};

type OpeningHoursSpecification = {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

function isClosedRange(range: string) {
  return range.trim().toLowerCase() === 'closed';
}

export function getOpeningHoursSpecifications(
  service: 'bar' | 'kitchen' = 'bar'
): OpeningHoursSpecification[] {
  const schedule = restaurantConfig.hours[service];

  return (Object.entries(schedule) as Array<[DayName, string]>).flatMap(([day, hours]) => {
    if (!hours || isClosedRange(hours)) {
      return [];
    }

    return hours.split(',').flatMap((range) => {
      const [opens, closes] = range.split('-').map((value) => value.trim());

      if (!opens || !closes) {
        return [];
      }

      return [
        {
          '@type': 'OpeningHoursSpecification' as const,
          dayOfWeek: [DAY_TO_SCHEMA[day]],
          opens,
          closes,
        },
      ];
    });
  });
}
