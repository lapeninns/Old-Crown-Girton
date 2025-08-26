import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NutritionModal from '../../../components/menu/NutritionModal';
import type { Menu } from '../../../src/lib/data/schemas';

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

describe('NutritionModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    item: mockMenuItem,
    isOpen: true,
    onClose: mockOnClose
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock focus methods
    HTMLElement.prototype.focus = jest.fn();
  });

  it('does not render when isOpen is false', () => {
    render(<NutritionModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render when item is null', () => {
    render(<NutritionModal {...defaultProps} item={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal when isOpen is true and item is provided', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Nutrition Information')).toBeInTheDocument();
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'nutrition-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'nutrition-description');
  });

  it('displays nutritional values section', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByText('Nutritional Values')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fat')).toBeInTheDocument();
  });

  it('displays allergen information when available', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByText('Allergen Information')).toBeInTheDocument();
    expect(screen.getByText('Please be aware:')).toBeInTheDocument();
  });

  it('displays key ingredients section', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByText('Key Ingredients')).toBeInTheDocument();
  });

  it('displays dietary information when available', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByText('Dietary Information')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Spicy')).toBeInTheDocument();
    expect(screen.queryByText('Vegan')).not.toBeInTheDocument();
    expect(screen.queryByText('Gluten Free')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close nutrition information');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when footer close button is clicked', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const footerCloseButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(footerCloseButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles Escape key press', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    fireEvent.keyDown(modal, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus within modal', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    
    // Test that tab events are handled
    fireEvent.keyDown(modal, { key: 'Tab' });
    
    // Should not call onClose (focus should be trapped)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles shift+tab for backward focus navigation', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    
    // Test that shift+tab events are handled
    fireEvent.keyDown(modal, { key: 'Tab', shiftKey: true });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('displays disclaimer text', () => {
    render(<NutritionModal {...defaultProps} />);
    
    expect(screen.getByText(/Disclaimer:/)).toBeInTheDocument();
    expect(screen.getByText(/Nutritional information is approximate/)).toBeInTheDocument();
  });

  it('handles item without dietary information', () => {
    const itemWithoutDietary = { ...mockMenuItem };
    delete (itemWithoutDietary as any).dietary;
    
    render(<NutritionModal {...defaultProps} item={itemWithoutDietary} />);
    
    // Should still render but without dietary section
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Dietary Information')).not.toBeInTheDocument();
  });

  it('generates nutrition information based on dietary preferences', () => {
    const veganItem = {
      ...mockMenuItem,
      dietary: { vegan: true, vegetarian: true }
    };
    
    render(<NutritionModal {...defaultProps} item={veganItem} />);
    
    // Should show both vegan and vegetarian badges
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
  });

  it('has tabindex for keyboard accessibility', () => {
    render(<NutritionModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('tabIndex', '-1');
  });
});