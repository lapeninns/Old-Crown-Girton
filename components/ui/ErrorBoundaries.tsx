"use client";

import React, { Component, ErrorInfo, ReactNode, useState } from "react";

// Enhanced Error Boundary with retry functionality
interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  maxRetries?: number;
  onRetry?: () => void;
}

interface EnhancedErrorBoundaryState {
  hasError: boolean;
  retryCount: number;
}

export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState> {
  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  public static getDerivedStateFromError(_: Error): Partial<EnhancedErrorBoundaryState> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("EnhancedErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    const { maxRetries = 0, onRetry } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState({ hasError: false, retryCount: retryCount + 1 });
      onRetry?.();
    }
  };

  public render() {
    const { hasError, retryCount } = this.state;
    const { children, fallback, maxRetries = 0 } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">We encountered an error while loading this content.</p>
          {retryCount < maxRetries && (
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again ({maxRetries - retryCount} attempts left)
            </button>
          )}
        </div>
      );
    }

    return children;
  }
}

// Suspense Fallback component with different loading types
interface SuspenseFallbackProps {
  type?: 'spinner' | 'text';
  message?: string;
  className?: string;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  type = 'spinner',
  message = 'Loading...',
  className = ''
}) => {

  if (type === 'text') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
