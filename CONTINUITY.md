# Continuous Improvement Log

This file tracks significant architectural changes, refactors, and performance improvements to ensure context is preserved across sessions.

- **2025-12-30**: Refactored `API Client` to use `AxiosApiClient` and `ToastNotificationService` for better abstraction and testing.
- **2025-12-30**: Implemented comprehensive speed and loading optimizations:
  - **Parallel Data Fetching**: Updated `app/page.tsx` to use `Promise.all` for fetching marketing and content data concurrently.
  - **Reusable Skeletons**: Created a dedicated `components/skeletons` directory with atomic and molecular skeleton components (`Skeleton.tsx`, `HomeSkeletons.tsx`, `MenuSkeletons.tsx`) to replace inconsistent inline loading states.
  - **Simplified Loading Logic**: Removed artificial delays and complex "progressive loading" overhead from `ClientHomeContent.tsx`, relying on native React Suspense for faster and smoother UX.
  - **Menu Page Optimization**: Updated `app/menu/page.tsx` and `MenuHero.tsx` to use the new skeleton components.
- **2025-12-30**: Fixed 27-second server-side timeout by disabling the unreachable Content API in `data/prod/config.json` (`cms.enabled: false`). This forces the use of local filesystem data, eliminating the `AbortError` and "Slow content API request" warnings.
- **2025-12-30**: Fixed "Restaurant & Bar Opening Time struggling to load" in development environment. Identified recursive API call issue where `RestaurantSmartLoader` attempted to fetch from `localhost` within the same server instance. Disabled CMS in `data/dev/config.json` (`cms.enabled: false`) to force filesystem loading, ensuring instant resolution of opening hours data.
