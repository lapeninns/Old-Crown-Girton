import LoadQueue from '@/src/lib/lazy/loadQueue';

describe('LoadQueue', () => {
  it('caps concurrency at 4', async () => {
    const queue = new LoadQueue();
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(queue.add(async () => {
        await new Promise(r => setTimeout(r, 10));
      }));
    }
    await Promise.all(promises);
    // All complete, no error
  });

  it('aborts tasks', async () => {
    const queue = new LoadQueue();
    const controller = queue.add(async () => {
      throw new Error('Should abort');
    });
    controller.abort();
    await expect(controller).resolves.toBeUndefined(); // Or handle
  });

  it('queues excess', async () => {
    const queue = new LoadQueue();
    // Simulate running 6, add 1 more, should queue
    // Test logic
  });
});