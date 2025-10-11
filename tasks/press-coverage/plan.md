# Plan – Showcase Newspaper Feature

## 1. Model updates
- Extend `config/content/pages/home.json` with a `pressFeature` block (headline, summary, CTA label/href, optional quote) so homepage UI can stay content-driven.
- Update `app/page.tsx` to read the new block and pass it to the client shell; adjust prop typing accordingly.

## 2. Homepage UI
- Build an accessible `PressFeatureBanner` (likely in `components/restaurant/sections`) that renders the content block with clear “In the press” labeling, external link, and responsive styling.
- Integrate the banner into `ClientHomeContent` via an additional `ProgressiveSection`, positioned after the hero and before the about section for visibility, ensuring reduced-motion compatibility and touch-friendly hit target.

## 3. Blog entry
- Create a new short-form press post directory under `app/blog` with metadata, concise body copy, external link CTA, and minimal schema markup (`NewsArticle` / `BlogPosting` hybrid) referencing the Standard article.
- Add the post to the `blogPosts` list and introduce a “Press & Media” category in `app/blog/page.tsx`, updating filter mappings in `app/blog/_components/FilterableBlogSection.tsx` so the new category counts work.

## 4. Verification
- Reload the blog and homepage locally (storybook/dev or `next` preview) to eyeball layout and link behaviour.
- Spot-check accessibility basics (focus order, SR labels) and run `pnpm lint` to ensure the codebase stays clean.
