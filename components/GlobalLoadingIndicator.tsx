"use client";

import React from "react";
import { useLoading } from "@/hooks/useLoading";

const GlobalLoadingIndicator: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50"></div>
  );
};

export default GlobalLoadingIndicator;
