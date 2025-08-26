import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuItemCard from '../../../components/menu/MenuItemCard';
import type { Menu } from '../../../src/lib/data/schemas';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, sizes, ...imageProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...imageProps} alt={props.alt} style={fill ? { width: '100%', height: '100%' } : undefined} />;
  },
}));

const mockMenuItem: Menu['sections'][0]['items'][0] = {
  id: 'test-item-1',
  name: 'Test Dish',
  description: 'A delicious test dish',
  price: {
    amount: 12.99,
    currency: 'GBP'
  },
  available: true,
  dietary: {
    vegetarian: true,
    glutenFree: false,
    vegan: false,
    spicy: true
  },
  tags: ['popular']
};

describe('MenuItemCard', () => {
  const defaultProps = {
    item: mockMenuItem,
    section: 'starters',
    searchTerm: '',
    className: ''
  };

  it('renders menu item correctly', () => {
    render(<MenuItemCard {...defaultProps} />);
    
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
    expect(screen.getByText('A delicious test dish')).toBeInTheDocument();
    expect(screen.getByText('£12.99')).toBeInTheDocument();
  });

  it('displays dietary badges correctly', () => {
    render(<MenuItemCard {...defaultProps} />);
    
    expect(screen.getByText('V')).toBeInTheDocument(); // Vegetarian
    expect(screen.getByText('🌶️')).toBeInTheDocument(); // Spicy
    expect(screen.queryByText('GF')).not.toBeInTheDocument(); // Not gluten free
    expect(screen.queryByText('VE')).not.toBeInTheDocument(); // Not vegan
  });

  it('displays spice level from tags correctly', () => {
    const spicyItem = {
      ...mockMenuItem,
      tags: ['spice-2']
    };
    
    render(<MenuItemCard {...defaultProps} item={spicyItem} />);
    
    // Should display 2 chili peppers for spice level 2
    expect(screen.getByText('🌶️🌶️')).toBeInTheDocument();
    
    // Check aria-label for accessibility
    const spiceElement = screen.getByLabelText('Spice level 2 out of 3');
    expect(spiceElement).toBeInTheDocument();
  });

  it('displays different spice levels correctly', () => {
    const spiceLevel3Item = {
      ...mockMenuItem,
      tags: ['spice-3']
    };
    
    render(<MenuItemCard {...defaultProps} item={spiceLevel3Item} />);
    
    // Should display 3 chili peppers for spice level 3
    expect(screen.getByText('🌶️🌶️🌶️')).toBeInTheDocument();
    expect(screen.getByLabelText('Spice level 3 out of 3')).toBeInTheDocument();
  });



  it('highlights search terms in name and description', () => {
    render(<MenuItemCard {...defaultProps} searchTerm="Test" />);
    
    const highlightedElements = screen.getAllByText('Test');
    expect(highlightedElements.length).toBeGreaterThan(0);
    
    // Check if any of the highlighted elements has the highlight class
    const hasHighlight = highlightedElements.some(element => 
      element.tagName === 'MARK'
    );
    expect(hasHighlight).toBe(true);
  });

  it('renders without price when price is not provided', () => {
    const itemWithoutPrice = { ...mockMenuItem };
    delete (itemWithoutPrice as any).price;
    
    render(<MenuItemCard {...defaultProps} item={itemWithoutPrice} />);
    
    expect(screen.queryByText(/£/)).not.toBeInTheDocument();
  });

  it('handles different currency formats', () => {
    const itemWithUSD = {
      ...mockMenuItem,
      price: { amount: 15.99, currency: 'USD' as const }
    };
    
    render(<MenuItemCard {...defaultProps} item={itemWithUSD} />);
    expect(screen.getByText('US$15.99')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MenuItemCard {...defaultProps} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', 'Menu item: Test Dish');
  });

  it('applies custom className', () => {
    const { container } = render(<MenuItemCard {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders image with correct alt text', () => {
    render(<MenuItemCard {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Dish - starters from Old Crown Girton');
  });
});