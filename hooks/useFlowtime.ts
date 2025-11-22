import { playNotificationSound } from '@/lib/playNotificationSound';
import { useEffect, useRef, useState } from 'react';

export function useFlowtime(
  breakRatio: number = 5,
  autoStartBreaks: boolean = false,
  autoStartWork: boolean = false,
  useFixedBreak: boolean = false,
  fixedBreakDuration: number = 5 * 60 * 1000 // ms
) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [state, setState] = useState('Focus time');
  
  // Store the duration of the last work session to display during break if needed
  const [lastWorkDuration, setLastWorkDuration] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartBreaksRef = useRef(autoStartBreaks);
  const autoStartWorkRef = useRef(autoStartWork);
  const shouldAutoStartRef = useRef(false);
  const breakRatioRef = useRef(breakRatio);
  const useFixedBreakRef = useRef(useFixedBreak);
  const fixedBreakDurationRef = useRef(fixedBreakDuration);

  // Update refs
  useEffect(() => {
    autoStartBreaksRef.current = autoStartBreaks;
    autoStartWorkRef.current = autoStartWork;
    breakRatioRef.current = breakRatio;
    useFixedBreakRef.current = useFixedBreak;
    fixedBreakDurationRef.current = fixedBreakDuration;
  }, [autoStartBreaks, autoStartWork, breakRatio, useFixedBreak, fixedBreakDuration]);

  // Handle auto-start
  useEffect(() => {
    if (shouldAutoStartRef.current && !running) {
      shouldAutoStartRef.current = false;
      if (phase === 'work' && autoStartWorkRef.current) {
        setRunning(true);
      } else if (phase === 'break' && autoStartBreaksRef.current) {
        setRunning(true);
      }
    }
  }, [phase, running]);

  const start = () => {
    setRunning(true);
    if (seconds === 0 && phase === 'work') {
      playNotificationSound('start');
    }
  };

  const stop = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setPhase('work');
    setState('Focus time');
  };

  const switchPhase = () => {
    setRunning(false);
    
    if (phase === 'work') {
      // Switching to break
      const workDuration = seconds;
      setLastWorkDuration(workDuration);
      
      let calculatedBreak: number;
      
      if (useFixedBreakRef.current) {
        // Use fixed break duration (convert ms to seconds)
        calculatedBreak = Math.floor(fixedBreakDurationRef.current / 1000);
      } else {
        // Calculate break duration: workDuration / breakRatio
        // Ensure at least 1 second break
        calculatedBreak = Math.max(1, Math.floor(workDuration / breakRatioRef.current));
      }
      
      setSeconds(calculatedBreak);
      setPhase('break');
      setState('Break time');
      playNotificationSound('break');
      
      if (autoStartBreaksRef.current) {
        shouldAutoStartRef.current = true;
      }
    } else {
      // Switching to work
      setSeconds(0);
      setPhase('work');
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
      setSeconds((prev) => {
        if (phase === 'work') {
          // Count up
          return prev + 1;
        } else {
          // Count down
          if (prev <= 1) {
            // Break ended
            clearInterval(intervalRef.current!);
            setRunning(false);
            playNotificationSound('start'); // Or a specific 'break ended' sound
            
            // Automatically switch back to work phase setup (but wait for start)
            // Or stay in break at 0? Let's switch to work phase ready to start
            setPhase('work');
            setState('Focus time');
            setSeconds(0);
            
            if (autoStartWorkRef.current) {
              shouldAutoStartRef.current = true;
            }
            return 0;
          }
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phase]);

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
    phase,
    state,
    start,
    stop,
    reset,
    switchPhase,
    lastWorkDuration,
  };
}
