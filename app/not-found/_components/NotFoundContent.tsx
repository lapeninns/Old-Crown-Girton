'use client';

import { useNotFoundContent } from '../_content/useNotFoundContent';

export default function NotFoundContent() {
  const content = useNotFoundContent();
  
  if (!content) {
    return (
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-xl mx-auto mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-md w-full text-center">
      {/* 404 illustration */}
      <div className="p-6 bg-neutral-100 rounded-xl mb-6 inline-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Title and description */}
      <h1 className="text-3xl font-bold text-brand-800 mb-4 font-display">
        {content.ui.title}
      </h1>
      
      <p className="text-xl text-brand-600 mb-6 leading-relaxed">
        {content.ui.subtitle}
      </p>

      <p className="text-brand-600 mb-8 leading-relaxed">
        {content.ui.description}
      </p>

      {/* Suggestions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8">
        <h2 className="text-lg font-semibold text-brand-700 mb-4">
          {content.ui.suggestionsTitle}
        </h2>
        
        <div className="space-y-3 text-left">
          {content.ui.suggestions.map((suggestion: string, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-brand-600">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}