import React from 'react';
import { render, screen } from '@testing-library/react';
import StoryTimelineSection from '../../../components/restaurant/sections/StoryTimelineSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <section className={className} {...props}>{children}</section>
    ),
    p: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <p className={className} {...props}>{children}</p>
    ),
    h2: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    div: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    )
  }
}));

describe('StoryTimelineSection', () => {
  const mockTimeline = [
    {
      period: 'Historic Beginnings',
      title: 'The Village Heart',
      description: 'For centuries, The Old Crown has been at the heart of Girton village life.'
    },
    {
      period: 'Culinary Evolution',
      title: 'Changing Times',
      description: 'The pub adapted to different culinary trends over the years.'
    },
    {
      period: 'Today',
      title: 'Modern Era',
      description: 'Today we combine traditional and contemporary approaches.'
    }
  ];

  const mockProps = {
    title: 'Our Story',
    introduction: 'Located in the picturesque village of Girton, we have a rich history.',
    timeline: mockTimeline
  };

  it('renders title and introduction correctly', () => {
    render(<StoryTimelineSection {...mockProps} />);
    
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText('Located in the picturesque village of Girton, we have a rich history.')).toBeInTheDocument();
  });

  it('renders all timeline periods correctly', () => {
    render(<StoryTimelineSection {...mockProps} />);
    
    // Check all periods are rendered
    expect(screen.getByText('Historic Beginnings:')).toBeInTheDocument();
    expect(screen.getByText('Culinary Evolution:')).toBeInTheDocument();
    expect(screen.getByText('Today:')).toBeInTheDocument();
    
    // Check all titles are rendered
    expect(screen.getByText('The Village Heart')).toBeInTheDocument();
    expect(screen.getByText('Changing Times')).toBeInTheDocument();
    expect(screen.getByText('Modern Era')).toBeInTheDocument();
    
    // Check all descriptions are rendered
    expect(screen.getByText(/For centuries, The Old Crown has been at the heart/)).toBeInTheDocument();
    expect(screen.getByText(/The pub adapted to different culinary trends/)).toBeInTheDocument();
    expect(screen.getByText(/Today we combine traditional and contemporary/)).toBeInTheDocument();
  });

  it('filters out timeline items with missing properties', () => {
    const timelineWithMissing = [
      {
        period: 'Complete Period',
        title: 'Complete Title',
        description: 'Complete description'
      },
      {
        period: 'Missing Title',
        description: 'Has description but no title'
      },
      {
        title: 'Missing Period',
        description: 'Has title but no period'
      },
      {
        period: 'Missing Description',
        title: 'Has title and period'
      }
    ];

    render(
      <StoryTimelineSection
        title="Test Story"
        introduction="Test introduction"
        timeline={timelineWithMissing}
      />
    );

    // Only the complete period should be rendered
    expect(screen.getByText('Complete Period:')).toBeInTheDocument();
    expect(screen.getByText('Complete Title')).toBeInTheDocument();
    expect(screen.getByText('Complete description')).toBeInTheDocument();

    // Incomplete periods should not be rendered
    expect(screen.queryByText('Missing Title:')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing Period')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing Description:')).not.toBeInTheDocument();
  });

  it('returns null when timeline is empty', () => {
    const { container } = render(
      <StoryTimelineSection
        title="Test Story"
        introduction="Test introduction"
        timeline={[]}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when timeline is undefined', () => {
    const { container } = render(
      <StoryTimelineSection
        title="Test Story"
        introduction="Test introduction"
        timeline={undefined as any}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <StoryTimelineSection
        {...mockProps}
        className="custom-timeline-class"
      />
    );
    expect(container.firstChild).toHaveClass('custom-timeline-class');
  });

  it('has proper semantic HTML structure', () => {
    render(<StoryTimelineSection {...mockProps} />);
    
    // Should be wrapped in a section
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Should have proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Our Story');
  });

  it('handles timeline with single item', () => {
    const singleTimeline = [mockTimeline[0]];
    
    render(
      <StoryTimelineSection
        title="Single Story"
        introduction="Single introduction"
        timeline={singleTimeline}
      />
    );

    expect(screen.getByText('Historic Beginnings:')).toBeInTheDocument();
    expect(screen.getByText('The Village Heart')).toBeInTheDocument();
  });

  it('maintains timeline order', () => {
    render(<StoryTimelineSection {...mockProps} />);
    
    const timelineItems = screen.getAllByText(/:$/);
    expect(timelineItems[0]).toHaveTextContent('Historic Beginnings:');
    expect(timelineItems[1]).toHaveTextContent('Culinary Evolution:');
    expect(timelineItems[2]).toHaveTextContent('Today:');
  });
});