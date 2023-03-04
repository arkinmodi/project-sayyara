import { useEffect, useState } from "react";

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
