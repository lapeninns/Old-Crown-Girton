import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';

import QuickLinksSection from '../../../../components/restaurant/sections/QuickLinksSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('QuickLinksSection', () => {
  const mockLinks = [
    {
      title: 'Community & Events',
      description: 'Quiz nights, seasonal gatherings & live sports – see what\'s coming up.',
      link: '/events',
      linkText: 'View Events →'
    },
    {
      title: 'Heritage & Story',
      description: 'Discover how our thatched village pub evolved into a Nepalese + British hub.',
      link: '/about',
      linkText: 'Explore Heritage →'
    },
    {
      title: 'Our Menu',
      description: 'Authentic Nepalese dishes alongside classic pub favorites.',
      link: '/menu',
      linkText: 'View Menu →'
    }
  ];

  it('renders all quick links with correct content', () => {
    render(<QuickLinksSection links={mockLinks} />);

    // Check that all links are rendered
    expect(screen.getByText('Community & Events')).toBeInTheDocument();
    expect(screen.getByText('Heritage & Story')).toBeInTheDocument();
    expect(screen.getByText('Our Menu')).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText(/Quiz nights, seasonal gatherings/)).toBeInTheDocument();
    expect(screen.getByText(/Discover how our thatched village pub/)).toBeInTheDocument();
    expect(screen.getByText(/Authentic Nepalese dishes/)).toBeInTheDocument();

    // Check link texts
    expect(screen.getByText('View Events →')).toBeInTheDocument();
    expect(screen.getByText('Explore Heritage →')).toBeInTheDocument();
    expect(screen.getByText('View Menu →')).toBeInTheDocument();
  });

  it('renders correct href attributes for all links', () => {
    render(<QuickLinksSection links={mockLinks} />);

    const eventsLink = screen.getByRole('link', { name: /Community & Events: View Events/ });
    const aboutLink = screen.getByRole('link', { name: /Heritage & Story: Explore Heritage/ });
    const menuLink = screen.getByRole('link', { name: /Our Menu: View Menu/ });

    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(menuLink).toHaveAttribute('href', '/menu');
  });

  it('applies responsive grid classes correctly', () => {
    const { container } = render(<QuickLinksSection links={mockLinks} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('gap-8', 'md:grid-cols-3');
  });

  it('applies proper accessibility attributes', () => {
    render(<QuickLinksSection links={mockLinks} />);

    const eventsLink = screen.getByRole('link', { name: /Community & Events: View Events/ });
    expect(eventsLink).toHaveAttribute('aria-label', 'Community & Events: View Events →');
  });

  it('renders section with semantic HTML structure', () => {
    const { container } = render(<QuickLinksSection links={mockLinks} />);
    
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('py-12', 'bg-white', 'lazy-section');
  });

  it('returns null when no links provided', () => {
    const { container } = render(<QuickLinksSection links={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when links is undefined', () => {
    const { container } = render(<QuickLinksSection links={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <QuickLinksSection links={mockLinks} className="custom-class" />
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('handles hover states with proper CSS classes', () => {
    const { container } = render(<QuickLinksSection links={mockLinks} />);
    
    const cards = container.querySelectorAll('.p-6');
    cards.forEach(card => {
      expect(card).toHaveClass('hover:bg-neutral/60', 'transition-colors', 'duration-200');
    });
  });

  it('renders proper typography hierarchy', () => {
    render(<QuickLinksSection links={mockLinks} />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
    
    headings.forEach(heading => {
      expect(heading).toHaveClass('font-display', 'font-bold', 'text-xl', 'text-brand-700');
    });
  });
});