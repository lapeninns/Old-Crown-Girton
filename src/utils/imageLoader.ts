/* Lightweight image loader with simple caching.
   Prefer static imports where possible. This helper is for guarded dynamic access
   using predefined paths. */
class ComponentImageLoader {
  private imageCache = new Map<string, string>();

  async load(
    component: string,
    category: string,
    file: string
  ): Promise<string> {
    const key = `${component}/${category}/${file}`;
    if (this.imageCache.has(key)) return this.imageCache.get(key)!;
    try {
      // Note: This dynamic import works when the path is resolvable at build time.
      const mod = (await import(`@images/components/${component}/${category}/${file}`)) as { default: string };
      const url = (mod as any).default || (mod as any);
      this.imageCache.set(key, url);
      return url as string;
    } catch (e) {
      console.warn('Failed to load image:', key, e);
      return '';
    }
  }
}

export const imageLoader = new ComponentImageLoader();

