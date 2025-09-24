import { redirect } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';

const BOOKING_URL = 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true';

export const metadata = getSEOTags({
  title: 'Book a Table | Old Crown Girton',
  description:
    'Book a table at The Old Crown Girton. We will take you to our secure Togo booking partner to reserve your spot.',
  canonicalUrlRelative: '/book-a-table',
  openGraph: {
    title: 'Reserve a Table at Old Crown Girton',
    description:
      'Secure your table at The Old Crown Girton via our trusted Togo booking partner.',
    url: 'https://oldcrowngirton.com/book-a-table',
  },
});

export default function BookATablePage() {
  redirect(BOOKING_URL);
}
