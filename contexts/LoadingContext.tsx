"use client";

import React, { createContext, useState, useCallback, useMemo } from "react";

interface LoadingContextType {
  isLoading: boolean;
  addLoadingTask: (taskId: string) => void;
  removeLoadingTask: (taskId: string) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());

  const addLoadingTask = useCallback((taskId: string) => {
    setLoadingTasks((prevTasks) => {
      const newTasks = new Set(prevTasks);
      newTasks.add(taskId);
      return newTasks;
    });
  }, []);

  const removeLoadingTask = useCallback((taskId: string) => {
    setLoadingTasks((prevTasks) => {
      const newTasks = new Set(prevTasks);
      newTasks.delete(taskId);
      return newTasks;
    });
  }, []);

  const isLoading = loadingTasks.size > 0;

  const value = useMemo(
    () => ({ isLoading, addLoadingTask, removeLoadingTask }),
    [isLoading, addLoadingTask, removeLoadingTask]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

// Hook to use the loading context
export const useLoading = (): LoadingContextType => {
  const context = React.useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
