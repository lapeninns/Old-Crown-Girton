import { useEffect, useState } from 'react';
import { imageLoader } from '../utils/imageLoader';

type Spec = { category: string; file: string };

export function useComponentImages(component: string, specs: Spec[]) {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, Error>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const results: Record<string, string> = {};
      for (const { category, file } of specs) {
        try {
          const url = await imageLoader.load(component, category, file);
          results[`${category}/${file}`] = url;
        } catch (e) {
          setErrors((prev) => ({ ...prev, [`${category}/${file}`]: e as Error }));
        }
      }
      if (!cancelled) {
        setImages(results);
        setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [component, JSON.stringify(specs)]);

  const get = (category: string, file: string) => images[`${category}/${file}`];
  return { get, loading, errors } as const;
}

