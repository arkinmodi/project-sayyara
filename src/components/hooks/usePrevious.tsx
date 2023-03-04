import { useEffect, useRef } from "react";

/**
 * Custom hook to store previous value
 */
export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
