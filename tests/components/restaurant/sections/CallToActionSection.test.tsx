import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';

import CallToActionSection from '../../../../components/restaurant/sections/CallToActionSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  
  const createMotionComponent = (tag: string) => {
    return ({ children, ...props }: any) => {
      // Filter out motion-specific props to avoid React warnings
      const {
        whileHover,
        whileTap,
        whileInView,
        initial,
        animate,
        exit,
        transition,
        variants,
        viewport,
        onAnimationComplete,
        onAnimationStart,
        ...domProps
      } = props;
      
      return React.createElement(tag, domProps, children);
    };
  };
  
  return {
    motion: {
      div: createMotionComponent('div'),
      section: createMotionComponent('section'),
      a: createMotionComponent('a'),
    },
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, target, rel, ...props }: any) => {
    return (
      <a href={href} target={target} rel={rel} {...props}>
        {children}
      </a>
    );
  };
});

describe('CallToActionSection', () => {
  const mockCTAData = {
    headline: 'Ready to Experience Girton\'s Thatched Nepalese Pub?',
    description: 'Reserve a table, explore the menu or plan an event – we\'d love to host you.',
    buttons: [
      {
        text: 'View Menu',
        href: '/menu',
        variant: 'accent' as const,
        key: 'viewMenu'
      },
      {
        text: 'What\'s On',
        href: '/events',
        variant: 'brand' as const
      },
      {
        text: 'Book Online',
        href: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true',
        variant: 'crimson' as const,
        external: true
      }
    ]
  };

  it('renders headline and description correctly', () => {
    render(<CallToActionSection {...mockCTAData} />);

    expect(screen.getByText('Ready to Experience Girton\'s Thatched Nepalese Pub?')).toBeInTheDocument();
    expect(screen.getByText(/Reserve a table, explore the menu/)).toBeInTheDocument();
  });

  it('renders all CTA buttons with correct text', () => {
    render(<CallToActionSection {...mockCTAData} />);

    expect(screen.getByRole('link', { name: 'View Menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'What\'s On' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Book Online.*opens in new tab/ })).toBeInTheDocument();
  });

  it('applies correct href attributes to all buttons', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const menuLink = screen.getByRole('link', { name: 'View Menu' });
    const eventsLink = screen.getByRole('link', { name: 'What\'s On' });
    const bookingLink = screen.getByRole('link', { name: /Book Online/ });

    expect(menuLink).toHaveAttribute('href', '/menu');
    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(bookingLink).toHaveAttribute('href', 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true');
  });

  it('handles external links with proper security attributes', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const bookingLink = screen.getByRole('link', { name: /Book Online/ });
    expect(bookingLink).toHaveAttribute('target', '_blank');
    expect(bookingLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies correct button variant styling classes', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const menuLink = screen.getByRole('link', { name: 'View Menu' });
    const eventsLink = screen.getByRole('link', { name: 'What\'s On' });
    const bookingLink = screen.getByRole('link', { name: /Book Online/ });

    // Check accent variant
    expect(menuLink).toHaveClass('bg-accent-600', 'hover:bg-accent-700', 'focus:ring-accent-500');
    
    // Check brand variant
    expect(eventsLink).toHaveClass('bg-brand-700', 'hover:bg-brand-800', 'focus:ring-brand-500');
    
    // Check crimson variant
    expect(bookingLink).toHaveClass('bg-crimson-700', 'hover:bg-crimson-800', 'focus:ring-crimson-500');
  });

  it('shows external link indicator for external URLs', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const bookingLink = screen.getByRole('link', { name: /Book Online/ });
    expect(bookingLink).toHaveTextContent('↗');
  });

  it('detects external links automatically by URL pattern', () => {
    const dataWithAutoDetectedExternal = {
      ...mockCTAData,
      buttons: [
        {
          text: 'External Link',
          href: 'https://example.com',
          variant: 'accent' as const
        }
      ]
    };

    render(<CallToActionSection {...dataWithAutoDetectedExternal} />);

    const externalLink = screen.getByRole('link', { name: /External Link.*opens in new tab/ });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies proper accessibility attributes', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const menuLink = screen.getByRole('link', { name: 'View Menu' });
    const bookingLink = screen.getByRole('link', { name: /Book Online/ });

    expect(menuLink).toHaveAttribute('aria-label', 'View Menu');
    expect(bookingLink).toHaveAttribute('aria-label', 'Book Online (opens in new tab)');
  });

  it('renders semantic HTML structure', () => {
    const { container } = render(<CallToActionSection {...mockCTAData} />);
    
    const section = container.querySelector('section');
    const heading = container.querySelector('h2');

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('py-16', 'bg-accent/10');
    expect(heading).toHaveClass('font-display', 'font-bold', 'text-brand-700', 'h2');
  });

  it('includes focus management for accessibility', () => {
    render(<CallToActionSection {...mockCTAData} />);

    const buttons = screen.getAllByRole('link');
    buttons.forEach(button => {
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });
  });

  it('returns null when no headline provided', () => {
    const { container } = render(
      <CallToActionSection 
        headline="" 
        description="Test description" 
        buttons={mockCTAData.buttons} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when no buttons provided', () => {
    const { container } = render(
      <CallToActionSection 
        headline="Test headline" 
        description="Test description" 
        buttons={[]} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <CallToActionSection {...mockCTAData} className="custom-class" />
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('handles responsive button layout correctly', () => {
    const { container } = render(<CallToActionSection {...mockCTAData} />);
    
    const buttonContainer = container.querySelector('.flex');
    expect(buttonContainer).toHaveClass('flex-wrap', 'gap-4', 'justify-center');
  });

  it('uses button key for React key when available', () => {
    // This test verifies that the key prop is handled correctly
    // We can't directly test React keys, but we ensure no console warnings
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<CallToActionSection {...mockCTAData} />);
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});