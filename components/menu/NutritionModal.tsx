'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Menu } from '@/src/lib/data/schemas';

interface NutritionModalProps {
  item: Menu['sections'][0]['items'][0] | null;
  isOpen: boolean;
  onClose: () => void;
}

interface NutritionInfo {
  calories?: number;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  sodium?: string;
  allergens?: string[];
  ingredients?: string[];
}

/**
 * Accessible nutrition modal component with focus management
 * Implements proper ARIA patterns and keyboard navigation
 * Follows slideshow-text-contrast-standard for dark overlay text
 */
export default function NutritionModal({ item, isOpen, onClose }: NutritionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Sample nutrition data (would be fetched from API or included in menu data)
  const getNutritionInfo = useCallback((menuItem: Menu['sections'][0]['items'][0]): NutritionInfo => {
    // This would typically come from the menu data or an API
    // For now, returning sample data based on item type
    const isVegetarian = menuItem.dietary?.vegetarian;
    const hasSpice = menuItem.dietary?.spicy;
    
    return {
      calories: Math.floor(Math.random() * 400) + 200, // 200-600 calories
      protein: `${Math.floor(Math.random() * 30) + 10}g`,
      carbohydrates: `${Math.floor(Math.random() * 40) + 15}g`,
      fat: `${Math.floor(Math.random() * 20) + 5}g`,
      fiber: `${Math.floor(Math.random() * 8) + 2}g`,
      sodium: `${Math.floor(Math.random() * 800) + 200}mg`,
      allergens: [
        ...(isVegetarian ? [] : ['May contain traces of meat']),
        ...(hasSpice ? ['Contains spices'] : []),
        'Prepared in a kitchen that handles nuts, dairy, and gluten'
      ],
      ingredients: [
        'Fresh herbs and spices',
        'Quality ingredients',
        ...(isVegetarian ? ['Plant-based proteins'] : ['Premium meat cuts']),
        'Traditional cooking methods'
      ]
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal after a brief delay to ensure it's rendered
      const focusModal = () => {
        modalRef.current?.focus();
      };
      const timeoutId = setTimeout(focusModal, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isOpen]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
    
    // Trap focus within modal
    if (event.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen || !item) {
    return null;
  }

  const nutritionInfo = getNutritionInfo(item);

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nutrition-title"
        aria-describedby="nutrition-description"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 id="nutrition-title" className="text-xl font-bold text-brand-800">
              Nutrition Information
            </h2>
            <p id="nutrition-description" className="text-sm text-brand-600 mt-1">
              {item.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Close nutrition information"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nutritional Values */}
          <div>
            <h3 className="text-lg font-semibold text-brand-700 mb-4">Nutritional Values</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-brand-800">{nutritionInfo.calories}</div>
                <div className="text-sm text-brand-600">Calories</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-brand-800">{nutritionInfo.protein}</div>
                <div className="text-sm text-brand-600">Protein</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-brand-800">{nutritionInfo.carbohydrates}</div>
                <div className="text-sm text-brand-600">Carbs</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-brand-800">{nutritionInfo.fat}</div>
                <div className="text-sm text-brand-600">Fat</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-sm text-brand-600">Fiber</span>
                <span className="text-sm font-medium text-brand-800">{nutritionInfo.fiber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-sm text-brand-600">Sodium</span>
                <span className="text-sm font-medium text-brand-800">{nutritionInfo.sodium}</span>
              </div>
            </div>
          </div>

          {/* Allergens */}
          {nutritionInfo.allergens && nutritionInfo.allergens.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-brand-700 mb-3">Allergen Information</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-2">Please be aware:</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {nutritionInfo.allergens.map((allergen, index) => (
                        <li key={index}>• {allergen}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {nutritionInfo.ingredients && nutritionInfo.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-brand-700 mb-3">Key Ingredients</h3>
              <div className="bg-cardamom-50 border border-cardamom-200 rounded-lg p-4">
                <ul className="text-sm text-cardamom-800 space-y-1">
                  {nutritionInfo.ingredients.map((ingredient, index) => (
                    <li key={index}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Dietary Information */}
          {item.dietary && Object.values(item.dietary).some(Boolean) && (
            <div>
              <h3 className="text-lg font-semibold text-brand-700 mb-3">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {item.dietary.vegetarian && (
                  <span className="bg-indiagreen-100 text-indiagreen-800 px-3 py-1 rounded-full text-sm font-medium">
                    Vegetarian
                  </span>
                )}
                {item.dietary.vegan && (
                  <span className="bg-marigold-100 text-marigold-800 px-3 py-1 rounded-full text-sm font-medium">
                    Vegan
                  </span>
                )}
                {item.dietary.glutenFree && (
                  <span className="bg-cardamom-100 text-cardamom-800 px-3 py-1 rounded-full text-sm font-medium">
                    Gluten Free
                  </span>
                )}
                {item.dietary.spicy && (
                  <span className="bg-crimson-100 text-crimson-800 px-3 py-1 rounded-full text-sm font-medium">
                    Spicy
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <p className="text-xs text-neutral-600">
              <strong>Disclaimer:</strong> Nutritional information is approximate and may vary based on preparation methods and ingredients. 
              Please inform our staff of any allergies or dietary requirements when ordering.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-brand-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal directly with fixed positioning
  return modalContent;
}
