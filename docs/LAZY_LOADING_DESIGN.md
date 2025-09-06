# Lazy Loading V2 Design Document

## WHY (Root Cause from Analysis)
Current impl fragmented: Per-component IO instances leak memory (e.g., 100 imgs = 100 observers). No concurrency cap risks thundering herd on slow nets. CLS from unreserved placeholders. No shared observers or adaptive margins. Symptoms: Premature loads in bg tabs (Chrome issue), CLS 0.08, LCP 2.1s mobile.

## WHAT (Proposed Architecture)
- **Primary: Shared IO Singleton** (intersection.ts): getObserver(config) returns/caches per root/margin/threshold. Observe(el, cb), unobserve(el), auto-disconnect if empty (WeakMap for registry).
- **Concurrency: LoadQueue** (loadQueue.ts): Class with maxConcurrent= min(6, navigator.hardwareConcurrency || 4). add(task: () => Promise) with AbortController; queue excess, promote near-viewport.
- **Adaptive:** rootMargin = slow net/saveData ? '100px' : '300px'; threshold=0 for instant. Network listener for changes.
- **Native Integration:** Prefer loading='lazy'/decoding='async' for imgs; IO for components/dynamic. fetchpriority='high' for priority=true (LCP).
- **CLS Prevention:** Enforce style={{aspectRatio: '16/9'}} or CSS contain-intrinsic-size on placeholders. No animate-pulse for critical.
- **Fallback:** If !'IntersectionObserver' in window (rare, <1%), use scroll/resize passive listeners + rAF + debounce(100ms) for boundingClientRect checks.
- **Component API:** Enhance AdaptiveImage/LazyComponent: props {root?, rootMargin?, threshold=0, once=true, priority=false, onVisible}. For dynamic: wrap in LazyComponent with queue.add(import()).
- **Scheduling:** requestIdleCallback for non-priority loads; abort on unmount/offscreen. Respect reduced motion (skip animations).
- **Error/Retry:** 2 retries with exponential backoff (100ms, 300ms); fallback src on fail.
- **Lifecycle:** useEffect: observe on mount, unobserve on load/unmount. WeakRef for memory.
- **Feature Flag:** if (process.env.NEXT_PUBLIC_LAZY_V2 !== 'true') use old impl.

## Diagrams
Observer Lifecycle:
```
Mount -> getSharedObserver(config) [cache hit/miss] -> observe(el, onVisible) 
  ↓ visible (isIntersecting)
queue.add( () => new AbortController().signal ? load() : abort ) [cap check: if <max, run; else queue]
  ↓ loaded
unobserve(el) -> if registry.empty, disconnect observer
Unmount -> unobserve
```

Queue Flow:
```
add(task) -> if running < maxConcurrent && !aborted: run(task); else push queue
on complete: running--, shift queue if any
on abort/unmount: controller.abort(), remove from running/queue
```

## Integration with Next.js
- Dynamic imports: queue.add(() => import(component).then(mod => setComp(mod.default)))
- Images: Use native <img> with IO trigger for src set (avoid next/image for control, but add AVIF support via srcset).
- SSR: Placeholders server-rendered; client hydrates with lazy.
- Partial Prerendering (Next 14+): Lazy sections stream after shell (use for below-fold).
- Streaming: LazyComponent in Suspense boundaries.

## Constraints Addressed
- Bundle: Native, +2kB utils. Measure post-build.
- No Breaking: Old props backward compat via flag.
- TS Strict: Full types for hook/queue.
- Metrics: Target LCP no regress, CLS<0.1 via reserved space.

## Rollout
- Flag: NEXT_PUBLIC_LAZY_V2=true in .env.
- Canary: 5% traffic (Vercel), monitor vitals/error logs.
- Ramp: 10% -> 50% -> 100% if p75 LCP stable.
- Rollback: Flag off.

Verification: Post-impl, npm run build (diff <5kB), tests pass, E2E vitals improved.