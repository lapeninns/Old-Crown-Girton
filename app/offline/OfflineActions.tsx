'use client';

export default function OfflineActions() {
  return (
    <div className="space-y-4">
      <button
        onClick={() => window.history.back()}
        className="w-full bg-crown-gold hover:bg-crown-gold-dark text-white font-medium py-3 px-6 rounded-full transition-colors"
      >
        Go Back
      </button>
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-transparent border-2 border-crown-gold text-crown-gold hover:bg-crown-gold hover:text-white font-medium py-3 px-6 rounded-full transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
