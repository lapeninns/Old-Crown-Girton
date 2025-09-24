# Research: Book-a-Table Redirect Page

## Booking URL Convention
- The restaurant consistently uses the Togo booking platform at `https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true` (see `components/StickyCallButton.tsx`, `app/menu/page.tsx`, and multiple blog CTAs). Reusing the same URL keeps behaviour consistent and analytics integrations intact.

## Redirect Patterns in the Codebase
- No dedicated redirect pages currently exist, but Next.js App Router supports server-side redirects via `redirect()` from `next/navigation`. This helper throws a special error that Next catches, returning an HTTP 307 by default.
- Because our `/book-a-table` page will be a server component, we can call `redirect()` synchronously in the default export. No JSX rendering is required; the redirect occurs before any output. Example usage:
  ```ts
  import { redirect } from 'next/navigation';

  export default function Page() {
    redirect('https://example.com');
  }
  ```

## SEO & Metadata Considerations
- Even though the page redirects immediately, we should still provide metadata via `getSEOTags` to ensure crawlers understand intent. Title/description can mention that visitors are being routed to the booking partner.
- Canonical should point to `/book-a-table` so search engines recognise it as the official booking entry point (while the redirect handles human traffic).

## Navigation Exposure
- Current navigation (header/footer) uses static JSON (`public/data/nav.json`, `config/content.json`). Adding `/book-a-table` would require updating both sources plus checking navbar filters (`components/restaurant/Navbar.tsx` removes `/` and `/contact`). Not strictly required unless we want a dedicated nav link; we can keep the page discoverable via buttons/links elsewhere.

## Risks / Edge Cases
- Redirect loops: ensure no existing CTA already points to `/book-a-table`, otherwise we could end up redirecting back to the same route. As long as other CTAs continue pointing directly to the Togo URL or to this new page (but not both ways), we’re safe.
- Analytics/tracking: since this is a straight redirect, any query parameters from the incoming request will not be automatically forwarded. If future campaigns require tracking, we may need to append `searchParams` to the outgoing URL.
