import React from 'react';
import { render } from '@testing-library/react';
import { expect } from '@jest/globals';

// Test barrel exports
import { QuickLinksSection, CallToActionSection } from '../../../../components/restaurant/sections';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('Restaurant Sections Barrel Exports', () => {
  it('exports QuickLinksSection component correctly', () => {
    expect(QuickLinksSection).toBeDefined();
    expect(typeof QuickLinksSection).toBe('function');
  });

  it('exports CallToActionSection component correctly', () => {
    expect(CallToActionSection).toBeDefined();
    expect(typeof CallToActionSection).toBe('function');
  });

  it('can render QuickLinksSection from barrel export', () => {
    const mockLinks = [
      {
        title: 'Test Link',
        description: 'Test description',
        link: '/test',
        linkText: 'Test →'
      }
    ];

    const { container } = render(<QuickLinksSection links={mockLinks} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('can render CallToActionSection from barrel export', () => {
    const mockData = {
      headline: 'Test Headline',
      description: 'Test description',
      buttons: [
        {
          text: 'Test Button',
          href: '/test',
          variant: 'accent' as const
        }
      ]
    };

    const { container } = render(<CallToActionSection {...mockData} />);
    expect(container.firstChild).not.toBeNull();
  });
});