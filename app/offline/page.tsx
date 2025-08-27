"use client";

import Link from "next/link";
import { useContent } from '@/hooks/useContent';

export default function OfflinePage() {
  const { data: content } = useContent();
  const offlineContent = content?.pages?.offline || {
    title: "You're Offline",
    subtitle: "Connection Lost",
    description: "It looks like you've lost your internet connection. Don't worry - you can still access some features.",
    availableFeatures: [
      "Previously viewed menu items",
      "Restaurant information", 
      "Contact details"
    ],
    buttons: {
      home: "Go Home",
      tryAgain: "Try Again",
      goBack: "Go Back"
    }
  };

  return (
    <section className="relative bg-neutral-50 text-neutral-900 min-h-screen w-full flex flex-col justify-center gap-8 items-center p-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-24 h-24 bg-brand-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-brand-100 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-brand-100 rounded-full opacity-20"></div>
      </div>

      {/* Main content */}
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
          {offlineContent.title}
        </h1>
        
        <p className="text-brand-600 mb-8 leading-relaxed">
          {offlineContent.description}
        </p>

        {/* Connection status */}
        <div className="bg-neutral-100 rounded-lg p-4 mb-8">
          <div 
            id="connection-status" 
            className="flex items-center justify-center text-sm font-medium"
          >
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Offline
          </div>
        </div>

        {/* Available features */}
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            {offlineContent.buttons.goBack}
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                clipRule="evenodd"
              />
            </svg>
            {offlineContent.buttons.tryAgain}
          </button>

          <Link href="/" className="btn btn-secondary btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
            {offlineContent.buttons.home}
          </Link>
        </div>
      </div>

      {/* Auto-reconnect script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateConnectionStatus() {
              const statusEl = document.getElementById('connection-status');
              if (navigator.onLine) {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Online - Reloading...';
                setTimeout(() => window.location.reload(), 1000);
              } else {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Offline';
              }
            }

            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
            
            // Check connection every 5 seconds
            setInterval(() => {
              if (navigator.onLine) {
                updateConnectionStatus();
              }
            }, 5000);
          `
        }}
      />
    </section>
  );
}