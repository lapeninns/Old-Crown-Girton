"use client";

import React from "react";

const ErrorFallback: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800"
      role="alert"
    >
      <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
      <p className="mb-4">
        We are sorry, but an unexpected error occurred. Please try again later.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
