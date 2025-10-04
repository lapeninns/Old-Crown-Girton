# Plan: DaisyUI Carousel Conversion

1. **Review Existing API Usage**
   - Confirm props `Showcase` passes and determine compatibility requirements for the new DaisyUI-based component.

2. **Design DaisyUI-Based Component Structure**
   - Map slides array to DaisyUI carousel markup with anchor navigation, ensuring unique IDs and proper previous/next linkage.
   - Decide on layout container (maintain full-height hero, ensure images cover area) and accessibility labels.

3. **Implement Component Changes**
   - Refactor `components/slideshow/DaisyUISlideshow.tsx` to remove stateful logic and render DaisyUI carousel markup using current slide data.
   - Retain existing exports and props signatures as needed for compatibility.

4. **Validate & Document**
   - Manually review for TypeScript/ESLint compatibility, ensure no unused imports, and confirm alt text/ARIA attributes present.
   - Update task notes with key outcomes or follow-ups if manual testing is required.
