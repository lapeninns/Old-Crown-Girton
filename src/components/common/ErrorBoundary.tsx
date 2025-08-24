"use client";
import React from "react";
import { useContent } from "@/hooks/useContent";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

type State = { hasError: boolean };

function DefaultErrorFallback() {
  const { data: content } = useContent();
  const errorMessage = content?.global?.ui?.messages?.error || 'Something went wrong loading this section.';
  
  return (
    <div className="p-6 bg-crimson-50 text-crimson-700 rounded">
      {errorMessage}
    </div>
  );
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary", { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}
