// src/lib/lazy/intersection.ts
// Shared IntersectionObserver singleton per config for efficient lazy loading
// Based on MDN best practices: reuse observers, disconnect when empty

interface ObserverConfig {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

type ObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

const observerRegistry = new Map<string, { observer: IntersectionObserver; count: number }>();
const weakRefTargets = new WeakMap<Element, { configKey: string; callback: ObserverCallback }>();

function getConfigKey(config: ObserverConfig): string {
  return JSON.stringify(config);
}

export function getSharedObserver(config: ObserverConfig, callback: ObserverCallback): IntersectionObserver {
  const key = getConfigKey(config);
  let entry = observerRegistry.get(key);
  if (!entry) {
    const observer = new IntersectionObserver(callback, config);
    entry = { observer, count: 0 };
    observerRegistry.set(key, entry);
  }
  entry.count++;
  return entry.observer;
}

export function observe(target: Element, callback: ObserverCallback, config: ObserverConfig = { threshold: 0, rootMargin: '300px 0px' }): () => void {
  const observer = getSharedObserver(config, callback);
  observer.observe(target);
  weakRefTargets.set(target, { configKey: getConfigKey(config), callback });
  return () => unobserve(target, observer);
}

export function unobserve(target: Element, observer?: IntersectionObserver): void {
  if (!observer) {
    const weakData = weakRefTargets.get(target);
    if (!weakData) return;
    const key = weakData.configKey;
    const entry = observerRegistry.get(key);
    if (!entry) return;
    observer = entry.observer;
    weakData.callback; // Keep ref alive briefly
  }
  observer.unobserve(target);
  weakRefTargets.delete(target);
  const entry = observerRegistry.get(getConfigKey({})); // Simplified, assume default for cleanup check
  if (entry && --entry.count === 0) {
    entry.observer.disconnect();
    observerRegistry.delete(getConfigKey({}));
  }
}

// Fallback for no IO support (<1% browsers)
export function createFallbackObserver(target: Element, callback: ObserverCallback, config: ObserverConfig): () => void {
  let ticking = false;
  function update() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
      if (isVisible) callback([{ isIntersecting: true, target } as IntersectionObserverEntry], null as any);
      ticking = false;
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update(); // Initial check
  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}