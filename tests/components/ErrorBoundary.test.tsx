import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/src/components/common/ErrorBoundary';

function Boom() {
  throw new Error('Kaboom');
}

describe('ErrorBoundary', () => {
  test('renders fallback on error', () => {
    // Suppress expected console errors during this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const Fallback = React.createElement('div', null, 'fallback');
    const ui = React.createElement(ErrorBoundary as any, { fallback: Fallback, children: React.createElement(Boom as any, null) });
    render(ui as any);
    expect(screen.getByText('fallback')).toBeInTheDocument();
    
    // Restore console.error
    consoleSpy.mockRestore();
  });
});
