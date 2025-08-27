"use client";

import { useOfflineContent } from '../_content/useOfflineContent';

export default function OfflineFeatures() {
  const content = useOfflineContent();
  
  if (!content) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8">
      <h2 className="text-lg font-semibold text-brand-700 mb-4">
        {content.features.title}
      </h2>
      
      <div className="space-y-3 text-left">
        {content.features.availableFeatures.map((feature: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm text-brand-600">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}