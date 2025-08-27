"use client";

import { useContent } from '@/hooks/useContent';

export default function OfflineFeatures() {
  const { data: content } = useContent();
  const offlineContent = content?.pages?.offline || {
    availableFeatures: [
      "Previously viewed menu items",
      "Restaurant information", 
      "Contact details"
    ]
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8">
      <h2 className="text-lg font-semibold text-brand-700 mb-4">
        Available Offline:
      </h2>
      
      <div className="space-y-3 text-left">
        {offlineContent.availableFeatures.map((feature: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm text-brand-600">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}