import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server setup for Node.js environment (Jest tests)
 */

// Create MSW server with default handlers
export const server = setupServer(...handlers);

// Export for use in test setup files
export default server;
