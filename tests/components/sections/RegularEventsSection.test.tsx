import React from 'react';
import { render, screen } from '@testing-library/react';
import RegularEventsSection from '../../../components/restaurant/sections/RegularEventsSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, whileInView, viewport, whileHover, itemScope, itemType, ...props }: any) => (
      <div className={className} itemScope={itemScope} itemType={itemType} {...props}>{children}</div>
    ),
    span: ({ children, className, initial, whileInView, transition, viewport, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    h3: ({ children, className, initial, whileInView, transition, viewport, itemProp, ...props }: any) => (
      <h3 className={className} itemProp={itemProp} {...props}>{children}</h3>
    ),
    p: ({ children, className, initial, whileInView, transition, viewport, itemProp, ...props }: any) => (
      <p className={className} itemProp={itemProp} {...props}>{children}</p>
    )
  }
 ,
  useReducedMotion: () => false
}));

describe('RegularEventsSection', () => {
  type TestEvent = {
    title?: string;
    description?: string;
    frequency?: string;
    icon?: string;
    startDate?: string;
    endDate?: string | undefined;
  };

  const mockEvents: TestEvent[] = [
    {
      title: 'Weekly Pub Quiz',
      description: 'Community teams, students & locals — general knowledge + themed rounds.',
      frequency: 'Thursday 8:00 PM',
      icon: '🧠',
      startDate: '2025-08-14T20:00:00+01:00',
      endDate: undefined
    } as TestEvent,
    {
      title: 'Curry & Community Night',
      description: 'Celebrate our Nepalese kitchen: featured dish & mild family option.',
      frequency: 'Wednesday Evening',
      icon: '🌶️',
      startDate: '2025-08-15T19:00:00+01:00',
      endDate: '2025-08-15T22:00:00+01:00'
    } as TestEvent,
    {
      title: 'Live Sports Highlights',
      description: 'Key football & rugby fixtures on screen – garden when weather allows.',
      frequency: 'Major fixtures schedule',
      icon: '⚽',
      startDate: '2025-08-16T15:00:00+01:00'
    } as TestEvent
  ];

  it('renders all events correctly', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    // Check all titles are rendered
    expect(screen.getByText('Weekly Pub Quiz')).toBeInTheDocument();
    expect(screen.getByText('Curry & Community Night')).toBeInTheDocument();
    expect(screen.getByText('Live Sports Highlights')).toBeInTheDocument();
    
    // Check all descriptions are rendered
    expect(screen.getByText(/Community teams, students & locals/)).toBeInTheDocument();
    expect(screen.getByText(/Celebrate our Nepalese kitchen/)).toBeInTheDocument();
    expect(screen.getByText(/Key football & rugby fixtures/)).toBeInTheDocument();
    
    // Check all frequencies are rendered
    expect(screen.getByText('Thursday 8:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Wednesday Evening')).toBeInTheDocument();
    expect(screen.getByText('Major fixtures schedule')).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    expect(screen.getByText('🧠')).toBeInTheDocument();
    expect(screen.getByText('🌶️')).toBeInTheDocument();
    expect(screen.getByText('⚽')).toBeInTheDocument();
  });

  it('includes schema.org markup', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    // Check for itemScope and itemType attributes
    const eventElements = document.querySelectorAll('[itemScope]');
    expect(eventElements.length).toBe(3);
    
    const schemaTypes = document.querySelectorAll('[itemType="https://schema.org/Event"]');
    expect(schemaTypes.length).toBe(3);
    
    // Check for itemProp attributes
    expect(document.querySelectorAll('[itemProp="name"]').length).toBe(3);
    expect(document.querySelectorAll('[itemProp="description"]').length).toBe(3);
    expect(document.querySelectorAll('[itemProp="eventSchedule"]').length).toBe(3);
  });

  it('includes schema metadata for start and end dates', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    // Check for startDate meta tags
    const startDateMetas = document.querySelectorAll('meta[itemProp="startDate"]');
    expect(startDateMetas.length).toBe(3);
    expect(startDateMetas[0]).toHaveAttribute('content', '2025-08-14T20:00:00+01:00');
    
    // Check for endDate meta tag (only the second event has endDate)
    const endDateMetas = document.querySelectorAll('meta[itemProp="endDate"]');
    expect(endDateMetas.length).toBe(1);
    expect(endDateMetas[0]).toHaveAttribute('content', '2025-08-15T22:00:00+01:00');
    
  // Visible formatted dates should be present
  expect(screen.getByText(/14 Aug 2025/)).toBeInTheDocument();
  expect(screen.getByText(/15 Aug 2025/)).toBeInTheDocument();
  });

  it('filters out events with missing required properties', () => {
  const eventsWithMissing: TestEvent[] = [
      {
        title: 'Complete Event',
        description: 'Complete description',
        frequency: 'Every day',
        icon: '✅'
      },
      {
        title: 'Missing Description',
        frequency: 'Sometimes',
        icon: '❌'
      },
      {
        description: 'Missing Title',
        frequency: 'Never',
        icon: '❌'
      },
      {
        title: 'Missing Frequency',
        description: 'Missing frequency',
        icon: '❌'
      }
    ];

    render(<RegularEventsSection events={eventsWithMissing} />);

    // Only the complete event should be rendered
    expect(screen.getByText('Complete Event')).toBeInTheDocument();
    expect(screen.getByText('Complete description')).toBeInTheDocument();
    expect(screen.getByText('Every day')).toBeInTheDocument();

    // Incomplete events should not be rendered
    expect(screen.queryByText('Missing Description')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Missing Frequency')).not.toBeInTheDocument();
  });

  it('returns null when events array is empty', () => {
    const { container } = render(<RegularEventsSection events={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when events is undefined', () => {
    const { container } = render(<RegularEventsSection events={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <RegularEventsSection events={mockEvents} className="custom-events-class" />
    );
    expect(container.firstChild).toHaveClass('custom-events-class');
  });

  it('handles events without icons gracefully', () => {
  const eventsWithoutIcons = mockEvents.map((event: TestEvent): TestEvent => ({ ...event, icon: undefined }));
    
    render(<RegularEventsSection events={eventsWithoutIcons} />);
    
    // Events should still render without icons
    expect(screen.getByText('Weekly Pub Quiz')).toBeInTheDocument();
    expect(screen.getByText('Curry & Community Night')).toBeInTheDocument();
    expect(screen.getByText('Live Sports Highlights')).toBeInTheDocument();
  });

  it('maintains event order', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    const eventTitles = screen.getAllByRole('heading', { level: 3 });
    expect(eventTitles[0]).toHaveTextContent('Weekly Pub Quiz');
    expect(eventTitles[1]).toHaveTextContent('Curry & Community Night');
    expect(eventTitles[2]).toHaveTextContent('Live Sports Highlights');
  });

  it('has proper accessibility attributes', () => {
    render(<RegularEventsSection events={mockEvents} />);
    
    // Icons should have aria-hidden
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBe(3);
    
    // Events should have proper semantic structure
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBe(3);
  });
});