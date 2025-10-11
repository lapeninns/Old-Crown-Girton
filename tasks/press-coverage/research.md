# Research – Press Coverage Feature

## Blog architecture
- Blog index (`app/blog/page.tsx`) hardcodes `featuredPost`, `blogPosts`, and `categories`. Adding a new entry requires updating the `blogPosts` list and extending `categories` plus slug mappings in `app/blog/_components/FilterableBlogSection.tsx`.
- Individual posts live at `app/blog/<slug>/page.tsx`, each exporting `metadata` via `getSEOTags`, wrapping content in `RestaurantLayout`, and defining a local `post` object with `title`, `excerpt`, `content`, `image`, and taxonomy fields. Many posts import `MotionDiv` from the dynamic motion helper and reuse assets from `Images.blog`.
- Post bodies are stored as HTML strings rendered with `dangerouslySetInnerHTML`, so short-format updates can be implemented by constraining the markup in the `content` string.

## Homepage structure
- The homepage (`app/page.tsx`) server-loads modular content (`getContentSmart`) and passes only `quickLinks`, `ctaSection`, and derived `ctaButtons` to the client shell (`components/ClientHomeContent.tsx`).
- `ClientHomeContent` orchestrates sections with a local `ProgressiveSection` wrapper. The hero (`Showcase`), about section, menu highlights, quick links, CTA, testimonials, takeaway, and location modules are rendered in-sequence without additional data props.
- Home quick links derive from `config/content/pages/home.json` (`sections.quickLinks`). Additional homepage copy should ideally be sourced from the same content manifest or another structured payload to stay consistent with existing content-driven patterns.

## Shared assets & utilities
- Image choices for blog cards are centralized in `src/lib/images.ts` under the `Images.blog` namespace (e.g., `thatchedExterior`, `localIngredients`). Reusing one of these avoids importing new media.
- External links typically use the `Link` shim from `@/lib/debugLink`, which supports absolute URLs while preserving Next.js routing benefits; provide `target="_blank"` and `rel="noopener noreferrer"` manually when needed.
- Framer Motion wrappers respect `prefers-reduced-motion`; new UI modules should follow the same pattern (opt for existing `ProgressiveSection` to avoid redundant animation logic).
