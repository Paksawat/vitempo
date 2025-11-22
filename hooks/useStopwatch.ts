import { playNotificationSound } from '@/lib/playNotificationSound';
import { useEffect, useRef, useState } from 'react';

export function useStopwatch(
  autoStartBreaks: boolean = false,
  autoStartWork: boolean = false
) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [state, setState] = useState('Focus time');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartBreaksRef = useRef(autoStartBreaks);
  const autoStartWorkRef = useRef(autoStartWork);
  const shouldAutoStartRef = useRef(false);

  // Update auto-start refs
  useEffect(() => {
    autoStartBreaksRef.current = autoStartBreaks;
    autoStartWorkRef.current = autoStartWork;
  }, [autoStartBreaks, autoStartWork]);

  // Handle auto-start
  useEffect(() => {
    if (shouldAutoStartRef.current && !running) {
      shouldAutoStartRef.current = false;
      if (isWorkTime && autoStartWorkRef.current) {
        setRunning(true);
      } else if (!isWorkTime && autoStartBreaksRef.current) {
        setRunning(true);
      }
    }
  }, [isWorkTime, running]);

  const start = () => {
    setRunning(true);
    if (seconds === 0) {
      playNotificationSound('start');
    }
  };

  const stop = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    // Don't reset phase, just time
  };

  const switchPhase = () => {
    setRunning(false);
    setSeconds(0);
    
    if (isWorkTime) {
      // Switching to break
      setIsWorkTime(false);
      setState('Break time');
      playNotificationSound('break');
      if (autoStartBreaksRef.current) {
        shouldAutoStartRef.current = true;
      }
    } else {
      // Switching to work
      setIsWorkTime(true);
      setState('Focus time');
      playNotificationSound('start');
      if (autoStartWorkRef.current) {
        shouldAutoStartRef.current = true;
      }
    }
  };

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatted = (() => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  })();

  return {
    seconds,
    formatted,
    running,
    isWorkTime,
    state,
    start,
    stop,
    reset,
    switchPhase,
  };
}
