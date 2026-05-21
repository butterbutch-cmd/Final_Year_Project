
// src/admin/hooks/usePolling.js
import { useEffect, useRef, useCallback } from "react";

/**
 * usePolling — fires `callback` immediately (optional) then on a fixed interval.
 *
 * @param {Function} callback  - async-safe function to call on each tick
 * @param {number}   interval  - polling interval in ms (default: 30 000)
 * @param {boolean}  immediate - call once on mount before first interval (default: true)
 *
 * @returns {{ stop: Function, restart: Function }}
 *
 * @example
 *   usePolling(fetchData, 30_000);
 */
const usePolling = (callback, interval = 30_000, immediate = true) => {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  // Keep the ref in sync so we never close over a stale callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop(); // clear any existing interval first
    if (immediate) {
      savedCallback.current();
    }
    timerRef.current = setInterval(() => {
      savedCallback.current();
    }, interval);
  }, [interval, immediate, stop]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    start();
    return stop; // cleanup on unmount
  }, [start, stop]);

  return { stop, restart };
};

export default usePolling;