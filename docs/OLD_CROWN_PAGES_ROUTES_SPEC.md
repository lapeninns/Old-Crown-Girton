# Old Crown Girton — Pages & Routes Specification

Snapshot date (UTC): 2026-01-30
Base URL: https://oldcrowngirton.com

## 1) Scope & Assumptions

- This document captures the **public marketing site** for Old Crown Girton as observed on the live domain on the snapshot date above.
- Pages are treated as **static/SSR marketing routes** with content authored in a CMS or flat content store (implementation choice is out of scope).
- Where the live site links to external services (booking, press, maps), those are considered **first-class dependencies** and must be preserved.
- Seasonal pages are included as **time-bound routes** (e.g., Christmas, Curry & Carols). If removed in the future, record as legacy/archived.

## 2) Sitemap (Public Routes)

```
/
|-- /menu
|-- /menu-information
|-- /takeaway-menu
|-- /about
|-- /events
|   |-- /events/curry-and-carols
|-- /curry-and-carols-menu
|-- /book-a-table
|-- /press
|-- /contact
|-- /blog
|   |-- /blog/authentic-momo-dumplings-nepalese-cuisine
|   |-- /blog/evening-standard-country-pub-of-the-week
|   |-- /blog/business-lunch-cambridge-guide
|   |-- /blog/dog-friendly-dining-guide
|   |-- /blog/student-guide-cambridge-university
|   |-- /blog/perfect-sunday-roast-guide
|   |-- /blog/largest-thatched-pub-history
|   |-- /blog/ultimate-sports-viewing-guide
|   |-- /blog/local-suppliers-fresh-ingredients
|   |-- /blog/nepalese-cuisine-journey
|-- /christmas-menu
|-- /tos
|-- /privacy-policy
|
|-- Assets / Downloads
|   |-- /documents/old-crown-girton-christmas-menu.pdf
|   |-- /takeaway-menu/old-crown-takeaway-menu.jpg
```

## 3) Global Layout & Navigation

### 3.1 Header

- **Logo** (left), links to `/`.
- **Primary nav** (desktop): Home, Menu, About, Events, Book a Table, Press, Contact, Blog.
- **Primary CTA**: "Book a Table" (right-aligned button) linking to external booking provider.
- **Mobile nav**: Hamburger toggles a full-screen menu with the same nav items and booking CTA.
- **Seasonal banner (conditional)**: Appears on some pages (e.g., "Christmas 2025" promo) linking to `/christmas-menu`.

### 3.2 Footer

- **Contact**: Phone, email, address.
- **Opening hours**: Dynamic component (shows "Loading..." initially).
- **Social links**: Facebook, Instagram.
- **Legal**: Terms of Service (`/tos`), Privacy Policy (`/privacy-policy`).
- **Allergen note**: "Please inform us of any food allergies before ordering."

### 3.3 Global Dependencies

- **Booking provider**: `https://www.nabatable.com/` (standard table bookings).
- **Christmas / seasonal booking**: `https://togo.uk.com/` (used for Christmas menu booking CTA).
- **Press coverage**: `https://www.standard.co.uk/` and other external press links.
- **Food Standards Agency**: `https://ratings.food.gov.uk/` link from Press page.
- **Maps**: Google Maps links for directions.

## 4) Route Specifications

> Each route lists purpose, sections, key CTAs, data/asset requirements, and dependencies. All routes should render with semantic headings, accessible navigation, and visible focus states.

### 4.1 `/` — Home

- **Purpose**: Primary brand landing, featuring highlights (menu, heritage, reviews, events).
- **Primary CTAs**: Book a Table (external), View Menu (`/menu`), Order Takeaway (phone/`/takeaway-menu`).
- **Sections**:
  - Hero slider with feature cards (EV Charging, Parking, Road-Trip Ready, Inside the Old Crown, Live Sports).
  - Press highlight (Evening Standard feature).
  - Welcome/positioning (Nepalese + British pub concept).
  - Signature dishes carousel (momo, gurkha chicken, mixed grill, seasonal veg).
  - Reviews/testimonials.
  - Community & Events teaser → `/events`.
  - Heritage & Story teaser → `/about`.
  - Takeaway highlight → `/takeaway-menu`.
  - Find Us: address, map embed, opening hours.
- **Dependencies**: External booking provider, review widgets, Google Maps.
- **SEO**: Title and description centered on Old Crown Girton pub/restaurant; OpenGraph image.

### 4.2 `/menu` — Menu (Interactive)

- **Purpose**: Display full menu with sections and dietary badges.
- **Primary CTAs**: View Menu Information (`/menu-information`), Book a Table, Takeaway menu.
- **Sections / Features**:
  - Menu category index: Starters, Momo, Soup and Salads, Main Course, Biryani and Rice, Dosa, Side Dish, Speciality, Desserts.
  - Dish cards with prices and dietary indicators (V/VG/GF etc.).
  - Search/filter controls (if provided by CMS/JS).
- **Dependencies**: External booking provider; internal link to allergen info.
- **SEO**: Indexable; include structured menu metadata if possible.

### 4.3 `/menu-information` — Allergens & Dietary Info

- **Purpose**: Compliance and allergy guidance.
- **Core Content**:
  - Food allergy/intolerance notice.
  - 14 major allergens list: cereals containing gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, nuts, celery, mustard, sesame, sulphur dioxide/sulphites, lupin, molluscs.
  - Cross-contamination handling and kitchen policy.
  - Natasha’s Law compliance statement.
  - Dietary guidance (veg/vegan/halal/gluten-free) and contact instructions.
- **Primary CTAs**: Call/email for dietary needs.
- **Dependencies**: None (static content).
- **SEO**: Mark as informational; keep accessible heading structure.

### 4.4 `/takeaway-menu` — Takeaway

- **Purpose**: Downloadable takeaway menu and instructions.
- **Primary CTAs**: Download menu asset; call to order.
- **Core Content**:
  - Short ordering instructions and pickup guidance.
  - Allergen note and dietary warning.
  - Download link to `/takeaway-menu/old-crown-takeaway-menu.jpg`.
- **Dependencies**: Telephone ordering; static asset download.

### 4.5 `/about` — About / Heritage

- **Purpose**: Story, heritage, and positioning.
- **Core Content**:
  - Historical background (formerly The Baker’s Arms; thatched pub heritage).
  - Renovation/ownership and the Nepalese + British menu narrative.
  - Commitment to community and hospitality.
- **Primary CTAs**: Book a Table.
- **SEO**: Historical and local keywords (Girton, Cambridge, thatched pub).

### 4.6 `/events` — Events & Sports

- **Purpose**: Promote live sports viewing and private events.
- **Primary CTAs**: Contact/Book event; view menus.
- **Core Content**:
  - Live sports coverage (Sky Sports, BT Sport, Amazon Prime, TNT Sport, ESPN).
  - Private events and celebrations (birthdays, corporate events, family gatherings).
  - Family-friendly positioning.
  - CTA block for seasonal events (e.g., Curry & Carols).
- **Dependencies**: External booking/contact; optional event landing pages.

#### 4.6.1 `/events/curry-and-carols`

- **Purpose**: Seasonal event landing page for Curry & Carols.
- **Core Content**:
  - Event description, date/time, location.
  - Pricing and booking instructions.
  - CTA to view menu and reserve table.
- **Primary CTAs**: View menu (`/curry-and-carols-menu`), Reserve/Book (external).

#### 4.6.2 `/curry-and-carols-menu`

- **Purpose**: Menu page specific to Curry & Carols event.
- **Core Content**:
  - Set menu items for the event.
  - Booking CTA.
- **Dependencies**: External booking provider (if present).

### 4.7 `/book-a-table` — Booking Guidance

- **Purpose**: Central booking CTA and instructions.
- **Primary CTAs**: Book Online (external), Call to book.
- **Core Content**:
  - Short copy encouraging bookings.
  - Contact alternatives (phone/email).
- **Dependencies**: `https://www.nabatable.com/`.

### 4.8 `/press` — Press & Media

- **Purpose**: Press highlights and factual summary.
- **Core Content**:
  - Food Standards Agency rating (link to ratings site).
  - Press highlights (Evening Standard, Cambridge/Varsity features).
  - Quick facts list (largest thatched pub, centuries of history, Nepalese cuisine).
- **Primary CTAs**: External press links; press contact.
- **Dependencies**: External news outlets, FSA site.

### 4.9 `/contact` — Contact & Directions

- **Purpose**: Direct contact and visit information.
- **Core Content**:
  - Phone, email, address: 89 High Street, Girton, Cambridge CB3 0QD (as displayed on site).
  - Amenities (parking, dog-friendly, Wi-Fi, EV charging).
  - Directions link to Google Maps.
- **Primary CTAs**: Call, email, get directions.

### 4.10 `/blog` — Blog Index

- **Purpose**: Content hub with editorial posts.
- **Core Content**:
  - Featured post hero card.
  - Post list cards with title, summary, tag, read time.
  - Newsletter/signup block.
- **Primary CTAs**: Read post; subscribe.

### 4.11 `/blog/[slug]` — Blog Post Template

- **Purpose**: Long-form editorial content.
- **Core Structure**:
  - Hero image, title, read time, category tag.
  - Body content with headings and images.
  - CTA to Book a Table.
  - Back to Blog link.
- **Accessibility**: Use semantic headings (H1 for title, H2/H3 for sections), alt text on images.
- **As-of snapshot slugs**:
  - `/blog/authentic-momo-dumplings-nepalese-cuisine`
  - `/blog/evening-standard-country-pub-of-the-week`
  - `/blog/business-lunch-cambridge-guide`
  - `/blog/dog-friendly-dining-guide`
  - `/blog/student-guide-cambridge-university`
  - `/blog/perfect-sunday-roast-guide`
  - `/blog/largest-thatched-pub-history`
  - `/blog/ultimate-sports-viewing-guide`
  - `/blog/local-suppliers-fresh-ingredients`
  - `/blog/nepalese-cuisine-journey`

### 4.12 `/christmas-menu` — Seasonal Menu

- **Purpose**: Seasonal festive menu landing.
- **Primary CTAs**: Download menu PDF, book online (external).
- **Core Content**:
  - Intro copy and festive imagery.
  - Set menu sections and pricing.
  - Download link to `/documents/old-crown-girton-christmas-menu.pdf`.
  - Background music playback widget (optional; respect prefers-reduced-motion).
- **Dependencies**: External booking provider `https://togo.uk.com/`.

### 4.13 `/tos` — Terms of Service

- **Purpose**: Legal terms.
- **Core Content**:
  - Reservations, cancellations, liability, use of site.
  - Governing law and contact information.

### 4.14 `/privacy-policy` — Privacy Policy

- **Purpose**: GDPR/Privacy compliance.
- **Core Content**:
  - Data collection and usage.
  - Cookies, third-party services, user rights.
  - Contact for data requests.

## 5) Assets & Downloads

- `/documents/old-crown-girton-christmas-menu.pdf` — Christmas menu PDF.
- `/takeaway-menu/old-crown-takeaway-menu.jpg` — Takeaway menu image.

## 6) Redirects / Legacy / Non-Canonical

- No live legacy routes confirmed in this snapshot. If older WordPress routes are required, capture and list them here with status codes and redirect targets.

## 7) SEO & Accessibility Baselines

- **SEO**: Each page should have unique title, description, OpenGraph/Twitter metadata, canonical URL.
- **A11y**: Keyboard navigable, visible focus, semantic headings, meaningful link text, ARIA only when required.
- **Performance**: Avoid CLS on images; set width/height or aspect ratios on hero/media components.

## 8) Data / Content Model (Suggested Fields)

- **Global**: site_name, phone, email, address, social_links, booking_url.
- **Menu**: categories[], items[] (name, description, price, dietary_flags, section).
- **Events**: title, date/time, description, booking_url, menu_url, hero_image.
- **Blog**: title, slug, excerpt, read_time, tags, hero_image, body.
- **Seasonal**: theme_name, active_date_range, hero_image, menu_asset, booking_url.
