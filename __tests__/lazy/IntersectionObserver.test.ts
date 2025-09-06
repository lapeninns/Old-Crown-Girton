import { getSharedObserver, observe, unobserve, createFallbackObserver } from '@/src/lib/lazy/intersection';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
(global as any).IntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect
}));

describe('Shared IntersectionObserver', () => {
  it('creates singleton per config', () => {
    const config1 = { rootMargin: '100px' };
    const config2 = { rootMargin: '200px' };
    getSharedObserver(config1, jest.fn());
    getSharedObserver(config1, jest.fn()); // Same
    getSharedObserver(config2, jest.fn()); // New
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(2);
  });

  it('observe returns unobserve fn', () => {
    const target = document.createElement('div');
    const cb = jest.fn();
    const unobs = observe(target, cb, { threshold: 0 });
    expect(mockObserve).toHaveBeenCalledWith(target);
    unobs();
    expect(mockUnobserve).toHaveBeenCalledWith(target);
  });

  it('disconnects when count 0', () => {
    const target1 = document.createElement('div');
    const target2 = document.createElement('div');
    const cb = jest.fn();
    const config = { rootMargin: '0px' };
    const obs1 = getSharedObserver(config, cb);
    observe(target1, cb, config);
    unobserve(target1, obs1);
    observe(target2, cb, config); // Count back to 1
    unobserve(target2, obs1); // Now 0, disconnect
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('fallback works without IO', () => {
    (global as any).IntersectionObserver = undefined;
    const target = document.createElement('div');
    const cb = jest.fn();
    const unobs = createFallbackObserver(target, cb, {});
    // Simulate scroll
    window.dispatchEvent(new Event('scroll'));
    setTimeout(() => {
      expect(cb).toHaveBeenCalled();
    }, 0);
    unobs();
    // Cleanup listeners
  });
});