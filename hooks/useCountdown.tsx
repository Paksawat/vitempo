import { playNotificationSound } from '@/lib/playNotificationSound';
import { useEffect, useRef, useState } from 'react';

export function useCountdown(workMs: number, breakMs: number) {
  const workSeconds = Math.floor(workMs / 1000);
  const breakSeconds = Math.floor(breakMs / 1000);

  const [seconds, setSeconds] = useState(workSeconds);
  const [running, setRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [cycle, setCycle] = useState(1);
  const [workCyclesCompleted, setWorkCyclesCompleted] = useState(0);
  const [state, setState] = useState('Focus time');

  const isWorkTimeRef = useRef(isWorkTime);
  const cycleRef = useRef(cycle);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasIncrementedRef = useRef(false); // Track if we've already incremented

  useEffect(() => {
    isWorkTimeRef.current = isWorkTime;
  }, [isWorkTime]);

  useEffect(() => {
    cycleRef.current = cycle;
  }, [cycle]);

  const start = () => {
    setRunning(true);
    playNotificationSound('start');
  };
  const stop = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setIsWorkTime(true);
    setSeconds(workSeconds);
    setCycle(1);
    setWorkCyclesCompleted(0);
    setState('Focus time');
    hasIncrementedRef.current = false;
  };

  // Skip function to jump to next phase immediately
  const skip = () => {
    clearInterval(intervalRef.current!);

    if (isWorkTimeRef.current) {
      // Skipping work → go to break (increment work cycles completed)
      if (!hasIncrementedRef.current) {
        hasIncrementedRef.current = true;
        setWorkCyclesCompleted((prev) => prev + 1);
      }
      setRunning(false);
      setIsWorkTime(false);
      setState(cycleRef.current < 5 ? 'Short break' : 'Long break');

      playNotificationSound('break');
      setSeconds(cycleRef.current < 5 ? breakSeconds : breakSeconds * 3);
    } else {
      // Skipping break → go to work (increment cycle)
      const nextCycle = cycleRef.current + 1;
      setRunning(false);
      setCycle(nextCycle);
      setIsWorkTime(true);
      setState('Focus time');
      playNotificationSound('start');
      setSeconds(workSeconds);
      hasIncrementedRef.current = false; // Reset for next work session
    }
  };

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);

          if (isWorkTimeRef.current) {
            // Work time ended → increment work cycles completed → switch to break
            if (!hasIncrementedRef.current) {
              hasIncrementedRef.current = true;
              setWorkCyclesCompleted((prev) => prev + 1);
            }
            setRunning(false);
            setIsWorkTime(false);
            setState(cycleRef.current < 5 ? 'Short break' : 'Long break');
            playNotificationSound('break');
            return cycleRef.current < 5 ? breakSeconds : breakSeconds * 3;
          } else {
            // Break ended → switch to next cycle work
            const nextCycle = cycleRef.current + 1;
            setState('Focus time');
            setRunning(false);
            setCycle(nextCycle);
            setIsWorkTime(true);

            playNotificationSound('start');
            hasIncrementedRef.current = false; // Reset for next work session
            return workSeconds;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [running, breakSeconds, workSeconds]);

  const formatted = (() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  })();

  const progress = (() => {
    const total = isWorkTime ? workSeconds : breakSeconds;
    return ((total - seconds) / total) * 100;
  })();

  return {
    seconds,
    formatted,
    progress,
    running,
    isWorkTime,
    cycle,
    cycleRef,
    workCyclesCompleted,
    state,
    start,
    stop,
    reset,
    skip,
  };
}
