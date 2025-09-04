"use client";

interface DietaryOptions {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
}

interface MenuDietaryFiltersProps {
  options: DietaryOptions;
  onChange: (key: keyof DietaryOptions) => void;
}

/**
 * Optimized dietary filters component
 * Extracted from MenuSearchFilter for better performance
 */
export default function MenuDietaryFilters({ options, onChange }: MenuDietaryFiltersProps) {
  const dietaryLabels: Record<keyof DietaryOptions, string> = {
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'Gluten Free',
    spicy: 'Spicy'
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-brand-700 mb-2">Dietary Options</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={() => onChange(key as keyof DietaryOptions)}
              className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-brand-600">
              {dietaryLabels[key as keyof DietaryOptions]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}