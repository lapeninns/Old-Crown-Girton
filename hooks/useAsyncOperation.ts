"use client";

import { useState, useEffect, useCallback } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export const useAsyncOperation = <T,>(
  asyncFunction: () => Promise<T>
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [asyncFunction]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, retry: execute };
};
