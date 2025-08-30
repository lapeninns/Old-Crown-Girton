import { LazyMotion, domAnimation } from 'framer-motion';

export const MotionFeatures = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={domAnimation} strict={false}>{children}</LazyMotion>
);

export function markStart(name: string) {
  try { performance.mark(`${name}:start`); } catch {}
}

export function markEnd(name: string) {
  try {
    const start = `${name}:start`;
    performance.mark(`${name}:end`);
    performance.measure(name, start, `${name}:end`);
  } catch {}
}

export function setWillChange(el: HTMLElement | null, value: string = 'opacity, transform') {
  if (!el) return;
  try { el.style.willChange = value; } catch {}
}

export function clearWillChange(el: HTMLElement | null) {
  if (!el) return;
  try { el.style.willChange = 'auto'; } catch {}
}

export function observeFrameRate(durationMs = 1000): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0;
    let raf = 0;
    const start = performance.now();
    const loop = () => {
      frames++;
      if (performance.now() - start >= durationMs) {
        cancelAnimationFrame(raf);
        resolve((frames / durationMs) * 1000);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });
}

export default { MotionFeatures, markStart, markEnd, setWillChange, clearWillChange, observeFrameRate };
