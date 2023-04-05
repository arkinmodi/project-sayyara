import { useEffect, useState } from "react";

/**
 * Custom hook to store network state
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 03/04/2023
 * @returns React hook of network state
 */
export const useNetwork = (): boolean => {
  const [isOnline, setNetwork] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("offline", () =>
        setNetwork(window.navigator.onLine)
      );
      window.addEventListener("online", () =>
        setNetwork(window.navigator.onLine)
      );
    }
  }, []);
  return isOnline;
};
