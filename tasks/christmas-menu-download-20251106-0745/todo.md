# Implementation Checklist

## Setup

- [x] Capture requirements and plan
- [x] Relocate Christmas menu PDF into `public/documents/` with descriptive name

## Hero CTA Update

- [x] Define `CHRISTMAS_MENU_PDF_PATH` (and filename constant if needed) in `app/christmas-menu/page.tsx`
- [x] Add download CTA button alongside existing booking buttons with accessible label and focus styles
- [x] Ensure layout remains responsive after adding third button

## Testing

- [ ] Run lint/tests if applicable (spot-check)
- [x] Manual QA in browser or DevTools once changes built

## Notes / Deviations

- Skipped automated lint/tests for this small UI change; highlight in final notes
