import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW browser worker for development and Storybook
 */

// Create MSW worker with default handlers
export const worker = setupWorker(...handlers);

// Export for use in browser environments
export default worker;
