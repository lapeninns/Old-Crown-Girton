import React from 'react';
import { render, screen } from '@testing-library/react';
import MenuCTASection from '../../../components/restaurant/sections/MenuCTASection';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <section className={className} {...props}>{children}</section>
    ),
    h2: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <p className={className} {...props}>{children}</p>
    ),
    div: ({ children, className, variants, initial, whileInView, viewport, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    )
  }
}));

describe('MenuCTASection', () => {
  const mockButtons = [
    {
      text: 'Book Online',
      href: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true',
      variant: 'primary' as const,
      external: true
    },
    {
      text: 'Order Takeaway: 01223277217',
      href: 'tel:01223 277217',
      variant: 'secondary' as const,
      external: false
    },
    {
      text: 'Learn Our Story',
      href: '/about',
      variant: 'tertiary' as const,
      external: false
    }
  ];

  const defaultProps = {
    buttons: mockButtons,
    allergenNotice: 'Please inform us of any allergies or dietary requirements when ordering.'
  };

  it('renders title and description with default values', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    expect(screen.getByText('Ready to Try Our Unique Menu?')).toBeInTheDocument();
    expect(screen.getByText(/Book a table or order takeaway to experience/)).toBeInTheDocument();
  });

  it('renders custom title and description when provided', () => {
    render(
      <MenuCTASection
        {...defaultProps}
        title="Custom Title"
        description="Custom description text"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders all buttons correctly', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    expect(screen.getByRole('link', { name: /book online/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /order takeaway/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn our story/i })).toBeInTheDocument();
  });

  it('applies correct button styling variants', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    const bookButton = screen.getByRole('link', { name: /book online/i });
    const orderButton = screen.getByRole('link', { name: /order takeaway/i });
    const storyButton = screen.getByRole('link', { name: /learn our story/i });
    
    // Primary variant (accent colors)
    expect(bookButton).toHaveClass('bg-accent', 'hover:bg-accent-700', 'text-white');
    
    // Secondary variant (crimson colors)
    expect(orderButton).toHaveClass('bg-crimson-600', 'hover:bg-crimson-800', 'text-white');
    
    // Tertiary variant (white background)
    expect(storyButton).toHaveClass('bg-white', 'hover:bg-neutral-100', 'text-stout-700');
  });

  it('handles external links correctly', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    const externalLink = screen.getByRole('link', { name: /book online/i });
    expect(externalLink).toHaveAttribute('href', 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Should have external indicator
    expect(externalLink).toHaveTextContent('↗');
  });

  it('handles internal links correctly', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    const internalLink = screen.getByRole('link', { name: /learn our story/i });
    expect(internalLink).toHaveAttribute('href', '/about');
    expect(internalLink).not.toHaveAttribute('target');
    expect(internalLink).not.toHaveAttribute('rel');
    
    // Should not have external indicator
    expect(internalLink).not.toHaveTextContent('↗');
  });

  it('renders allergen notice when provided', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    expect(screen.getByText('Please inform us of any allergies or dietary requirements when ordering.')).toBeInTheDocument();
  });

  it('does not render allergen notice when not provided', () => {
    render(<MenuCTASection buttons={mockButtons} />);
    
    expect(screen.queryByText(/allergies or dietary requirements/)).not.toBeInTheDocument();
  });

  it('returns null when buttons array is empty', () => {
    const { container } = render(<MenuCTASection buttons={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when buttons is undefined', () => {
    const { container } = render(<MenuCTASection buttons={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <MenuCTASection {...defaultProps} className="custom-cta-class" />
    );
    expect(container.firstChild).toHaveClass('custom-cta-class');
  });

  it('handles buttons with missing variant gracefully', () => {
    const buttonsWithMissingVariant = [
      {
        text: 'Default Button',
        href: '/test',
        variant: undefined as any,
        external: false
      }
    ];

    render(<MenuCTASection buttons={buttonsWithMissingVariant} />);
    
    const button = screen.getByRole('link', { name: /default button/i });
    // Should default to primary styling
    expect(button).toHaveClass('bg-accent', 'hover:bg-accent-700', 'text-white');
  });

  it('has proper semantic HTML structure', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    // Should be wrapped in a section
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Should have proper heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Ready to Try Our Unique Menu?');
  });

  it('maintains button order', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('Book Online');
    expect(links[1]).toHaveTextContent('Order Takeaway: 01223277217');
    expect(links[2]).toHaveTextContent('Learn Our Story');
  });

  it('has proper accessibility attributes', () => {
    render(<MenuCTASection {...defaultProps} />);
    
    const links = screen.getAllByRole('link');
    
    // All links should have focus styles
    links.forEach(link => {
      expect(link).toHaveClass('focus:outline-none', 'focus-visible:ring-4');
    });
  });
});