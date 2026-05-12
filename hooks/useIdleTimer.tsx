import { useEffect, useCallback, useRef } from "react";

export const useIdleTimer = (timeoutInMinutes: number, onWarn: () => void, onIdle: () => void) => {
  const warnTime = (timeoutInMinutes - 1) * 60 * 1000;
  const idleTime = timeoutInMinutes * 60 * 1000;

  const warnTimer = useRef<NodeJS.Timeout | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (idleTimer.current) clearTimeout(idleTimer.current);

    warnTimer.current = setTimeout(onWarn, warnTime);
    idleTimer.current = setTimeout(onIdle, idleTime);
  }, [onWarn, onIdle, warnTime, idleTime]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleEvent = () => resetTimers();

    events.forEach((event) => window.addEventListener(event, handleEvent));
    resetTimers();

    return () => {
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach((event) => window.removeEventListener(event, handleEvent));
    };
  }, [resetTimers]);

  return { resetTimers };
};
