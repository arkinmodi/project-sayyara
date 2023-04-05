import { useEffect, useRef } from "react";

/**
 * Custom hook to store previous value
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/04/2023
 * @param {any} value - Previous value to be stored
 * @returns A ref to previous value
 */
export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
