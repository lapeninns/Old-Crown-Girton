import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MenuSearchFilter from '../../../components/menu/MenuSearchFilter';
import type { Menu } from '../../../src/lib/data/schemas';

const mockSections: Menu['sections'] = [
  {
    id: 'starters',
    name: 'Starters',
    description: 'Delicious appetizers',
    items: [
      {
        id: 'item-1',
        name: 'Chicken Wings',
        description: 'Spicy chicken wings',
        price: { amount: 8.99, currency: 'GBP' },
        available: true,
        dietary: { spicy: true },
        tags: ['popular']
      },
      {
        id: 'item-2',
        name: 'Vegetable Soup',
        description: 'Fresh vegetable soup',
        price: { amount: 6.50, currency: 'GBP' },
        available: true,
        dietary: { vegetarian: true, vegan: true },
        tags: ['healthy']
      }
    ]
  },
  {
    id: 'mains',
    name: 'Main Courses',
    description: 'Hearty main dishes',
    items: [
      {
        id: 'item-3',
        name: 'Fish and Chips',
        description: 'Classic British dish',
        price: { amount: 14.99, currency: 'GBP' },
        available: true,
        dietary: { glutenFree: false },
        tags: ['classic']
      }
    ]
  }
];

describe('MenuSearchFilter', () => {
  const mockOnFilterChange = jest.fn();
  const defaultProps = {
    sections: mockSections,
    onFilterChange: mockOnFilterChange,
    className: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders search input', () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const filterButton = screen.getByText('Filters');
    expect(filterButton).toBeInTheDocument();
  });

  it('expands filter options when filter button is clicked', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);
    
    expect(screen.getByText('Dietary Options')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });

  it('calls onFilterChange when search term is entered', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    
    // Fast-forward past the debounce delay
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'starters',
            items: expect.arrayContaining([
              expect.objectContaining({ name: 'Chicken Wings' })
            ])
          })
        ]),
        'chicken'
      );
    });
  });

  it('filters by dietary options', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    // Expand filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);
    
    // Check vegetarian filter
    const vegetarianCheckbox = screen.getByLabelText(/vegetarian/i);
    fireEvent.click(vegetarianCheckbox);
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'starters',
            items: expect.arrayContaining([
              expect.objectContaining({ name: 'Vegetable Soup' })
            ])
          })
        ]),
        ''
      );
    });
  });

  it('shows active filter count', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    // Add search term
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.change(searchInput, { target: { value: 'soup' } });
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Active filter badge
    });
  });

  it('clears search when clear button is clicked', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.change(searchInput, { target: { value: 'chicken' } });
    
    // Wait for clear button to appear
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
    });
    
    expect(searchInput).toHaveValue('');
  });

  it('shows clear all button when filters are active', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
  });

  it('clears all filters when clear all button is clicked', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      const clearAllButton = screen.getByText('Clear all');
      fireEvent.click(clearAllButton);
    });
    
    expect(searchInput).toHaveValue('');
    
    // Wait for the clear action to complete
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenLastCalledWith(mockSections, '');
    });
  });

  it('filters by price range', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    // Expand filters
    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);
    
    // Change max price
    const maxPriceInput = screen.getByLabelText('Maximum price');
    fireEvent.change(maxPriceInput, { target: { value: '10' } });
    
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            items: expect.not.arrayContaining([
              expect.objectContaining({ name: 'Fish and Chips' }) // Should be filtered out (£14.99 > £10)
            ])
          })
        ]),
        ''
      );
    });
  });

  it('debounces search input', async () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search menu items...');
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 'c' } });
    fireEvent.change(searchInput, { target: { value: 'ch' } });
    fireEvent.change(searchInput, { target: { value: 'chi' } });
    
    // Should not call onFilterChange yet
    expect(mockOnFilterChange).not.toHaveBeenCalled();
    
    // Fast-forward past debounce delay
    jest.advanceTimersByTime(300);
    
    // Should only call once with final value
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.any(Array),
        'chi'
      );
    });
  });

  it('has proper accessibility attributes', () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveAttribute('aria-label', 'Search menu items by name or description');
    
    const filterButton = screen.getByRole('button', { name: /filters/i });
    expect(filterButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('maintains accessibility when filters are expanded', () => {
    render(<MenuSearchFilter {...defaultProps} />);
    
    const filterButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filterButton);
    
    expect(filterButton).toHaveAttribute('aria-expanded', 'true');
    expect(filterButton).toHaveAttribute('aria-controls', 'filter-options');
  });

  it('applies custom className', () => {
    const { container } = render(<MenuSearchFilter {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});