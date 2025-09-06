// src/lib/lazy/loadQueue.ts
// Concurrency-capped queue for lazy loads to prevent thundering herd
// Uses AbortController for cancellation; cap at min(6, hardwareConcurrency)

class LoadQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;
  private maxConcurrent: number;
  private aborted = new Set<AbortController>();

  constructor() {
    this.maxConcurrent = Math.min(6, navigator.hardwareConcurrency || 4);
  }

  add(task: () => Promise<void>): AbortController {
    const controller = new AbortController();
    const wrappedTask = async () => {
      if (controller.signal.aborted) return;
      try {
        await task();
      } catch (e) {
        if (!controller.signal.aborted) console.warn('Load failed:', e);
      } finally {
        this.running--;
        this.processQueue();
      }
    };

    if (this.running < this.maxConcurrent && !controller.signal.aborted) {
      this.running++;
      wrappedTask();
    } else {
      this.queue.push(wrappedTask);
    }

    return controller;
  }

  private processQueue() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.running++;
        task();
      }
    }
  }

  abortAll() {
    this.queue = [];
    this.running = 0;
  }
}

export default LoadQueue;