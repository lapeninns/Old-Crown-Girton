'use client';

export default function OfflineActions() {
  return (
    <div className="space-y-4">
      <button
        onClick={() => window.history.back()}
  className="w-full bg-accent hover:bg-accent-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
      >
        Go Back
      </button>
      <button
        onClick={() => window.location.reload()}
  className="w-full bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium py-3 px-6 rounded-full transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
