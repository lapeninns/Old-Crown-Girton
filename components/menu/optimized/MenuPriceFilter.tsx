"use client";

interface PriceRange {
  min: number;
  max: number;
}

interface MenuPriceFilterProps {
  value: PriceRange;
  range: PriceRange;
  onChange: (priceRange: PriceRange) => void;
}

/**
 * Optimized price range filter component
 * Includes dual-range slider and number inputs
 */
export default function MenuPriceFilter({ value, range, onChange }: MenuPriceFilterProps) {
  const parseNumber = (val: string, fallback: number) => {
    if (val === '' || val === null || val === undefined) return fallback;
    const n = parseFloat(val);
    return Number.isNaN(n) ? fallback : n;
  };

  const handleMinChange = (val: string) => {
    const raw = parseNumber(val, range.min);
    const nextMin = Math.min(Math.max(raw, range.min), value.max);
    onChange({ ...value, min: nextMin });
  };

  const handleMaxChange = (val: string) => {
    const raw = parseNumber(val, range.max);
    const nextMax = Math.max(Math.min(raw, range.max), value.min);
    onChange({ ...value, max: nextMax });
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-brand-700 mb-2">Price Range</h3>
      
      {/* Number inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="min-price" className="sr-only">Minimum price</label>
          <input
            id="min-price"
            type="number"
            step={0.5}
            min={range.min}
            max={value.max}
            value={value.min}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Min £"
          />
        </div>
        <div>
          <label htmlFor="max-price" className="sr-only">Maximum price</label>
          <input
            id="max-price"
            type="number"
            step={0.5}
            min={value.min}
            max={range.max}
            value={value.max}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Max £"
          />
        </div>
      </div>

      {/* Dual-range slider */}
      <div className="mt-3">
        <div className="relative h-6">
          {/* Track background */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded bg-neutral-200" />
          
          {/* Selected range highlight */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-accent-500"
            style={{
              left: `${((value.min - range.min) / (range.max - range.min)) * 100}%`,
              right: `${(1 - (value.max - range.min) / (range.max - range.min)) * 100}%`,
            }}
          />
          
          {/* Min thumb */}
          <input
            aria-label="Minimum price slider"
            type="range"
            min={range.min}
            max={range.max}
            step={0.5}
            value={value.min}
            onChange={(e) => handleMinChange(e.target.value)}
            className="absolute inset-0 w-full h-6 bg-transparent cursor-pointer appearance-none"
          />
          
          {/* Max thumb overlay */}
          <input
            aria-label="Maximum price slider"
            type="range"
            min={range.min}
            max={range.max}
            step={0.5}
            value={value.max}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="absolute inset-0 w-full h-6 bg-transparent cursor-pointer appearance-none"
            style={{ WebkitAppearance: 'none' as any }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-brand-600 mt-1">
          <span>£{range.min}</span>
          <span>£{range.max}</span>
        </div>
      </div>
    </div>
  );
}