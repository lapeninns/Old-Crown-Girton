"use client";

import { useOfflineContent } from '../_content/useOfflineContent';

export default function OfflineStatus() {
  const content = useOfflineContent();
  
  if (!content) {
    return (
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-xl mx-auto mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative z-10 max-w-md w-full text-center">
      {/* Offline icon */}
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
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M18.364 5.636L5.636 18.364"
          />
        </svg>
      </div>

      {/* Title and description */}
      <h1 className="text-3xl font-bold text-brand-800 mb-4 font-display">
        {content.ui.title}
      </h1>
      
      <p className="text-brand-600 mb-8 leading-relaxed">
        {content.ui.description}
      </p>

      {/* Connection status */}
      <div className="bg-neutral-100 rounded-lg p-4 mb-8">
        <div 
          id="connection-status" 
          className="flex items-center justify-center text-sm font-medium"
        >
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {content.ui.connectionStatus.offline}
        </div>
      </div>
    </div>
  );
}