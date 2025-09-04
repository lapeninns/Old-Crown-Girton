"use client";

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface MenuFilterChipsProps {
  chips: FilterChip[];
  resultsCount: number | null;
}

/**
 * Optimized filter chips component for menu filtering
 * Shows active filters and results count
 */
export default function MenuFilterChips({ chips, resultsCount }: MenuFilterChipsProps) {
  if (chips.length === 0 && resultsCount === null) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-accent-200 bg-accent-50 text-accent-800 text-xs hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
          aria-label={`Remove filter ${chip.label}`}
        >
          <span>{chip.label}</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      ))}
      {resultsCount !== null && (
        <span className="ml-auto text-xs text-brand-600">
          {resultsCount} item{resultsCount === 1 ? '' : 's'} match
        </span>
      )}
      {/* Screen reader live region */}
      <span className="sr-only" aria-live="polite">
        {resultsCount !== null ? `${resultsCount} items match` : ''}
      </span>
    </div>
  );
}