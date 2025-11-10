// Core timer hook
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerState,
  TimerStatus,
  TimerPhase,
  TechniqueSettings,
  TechniqueType,
} from '@/types';
import {
  minutesToSeconds,
  getNextPhase,
  shouldAutoStart,
  updateDocumentTitle,
  playNotificationSound,
} from '@/lib/timerUtils';

interface UseTimerProps {
  technique: TechniqueType;
  settings: TechniqueSettings;
  onPhaseComplete?: (phase: TimerPhase) => void;
  onSessionComplete?: () => void;
}

interface UseTimerReturn {
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  skip: () => void;
}

export function useTimer({
  technique,
  settings,
  onPhaseComplete,
  onSessionComplete,
}: UseTimerProps): UseTimerReturn {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer state
  const getInitialState = useCallback((): TimerState => {
    return {
      technique,
      status: 'idle',
      phase: 'idle',
      timeRemaining: minutesToSeconds(settings.workDuration),
      totalTime: minutesToSeconds(settings.workDuration),
      currentCycle: 0,
      totalCycles: settings.cyclesBeforeLongBreak || 1,
      sessionStartTime: null,
      pausedAt: null,
    };
  }, [technique, settings]);

  const [state, setState] = useState<TimerState>(getInitialState);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update document title
  useEffect(() => {
    updateDocumentTitle(
      state.timeRemaining,
      state.phase,
      state.status === 'running',
      'Focus Timer'
    );
  }, [state.timeRemaining, state.phase, state.status]);

  // Timer tick logic
  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTimeRemaining = prev.timeRemaining - 1;

          // Time's up - transition to next phase
          if (newTimeRemaining <= 0) {
            playNotificationSound('complete');
            onPhaseComplete?.(prev.phase);

            const nextPhase = getNextPhase(
              prev.phase,
              prev.currentCycle,
              settings.cyclesBeforeLongBreak,
              settings.cyclesBeforeLongBreak > 0
            );

            // Determine next phase duration
            let nextDuration: number;
            if (nextPhase === 'work') {
              nextDuration = minutesToSeconds(settings.workDuration);
            } else if (nextPhase === 'long-break') {
              nextDuration = minutesToSeconds(settings.longBreakDuration);
            } else {
              nextDuration = minutesToSeconds(settings.shortBreakDuration);
            }

            // Increment cycle if completing a work phase
            const newCycle =
              prev.phase === 'work'
                ? (prev.currentCycle + 1) %
                  (settings.cyclesBeforeLongBreak || 1)
                : prev.currentCycle;

            // Check if we should auto-start next phase
            const autoStart = shouldAutoStart(
              nextPhase,
              settings.autoStartBreaks,
              settings.autoStartWork
            );

            // If completed full cycle (all work + breaks), trigger session complete
            if (
              prev.phase === 'long-break' ||
              (prev.phase === 'short-break' && !settings.cyclesBeforeLongBreak)
            ) {
              onSessionComplete?.();
            }

            return {
              ...prev,
              phase: nextPhase as TimerPhase,
              status: autoStart ? 'running' : 'idle',
              timeRemaining: nextDuration,
              totalTime: nextDuration,
              currentCycle: newCycle,
            };
          }

          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [state.status, settings, onPhaseComplete, onSessionComplete]);

  // Start timer
  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'running',
      phase: prev.phase === 'idle' ? 'work' : prev.phase,
      timeRemaining:
        prev.phase === 'idle'
          ? minutesToSeconds(settings.workDuration)
          : prev.timeRemaining,
      totalTime:
        prev.phase === 'idle'
          ? minutesToSeconds(settings.workDuration)
          : prev.totalTime,
      sessionStartTime: Date.now(),
      currentCycle: prev.phase === 'idle' ? 1 : prev.currentCycle,
    }));
    playNotificationSound('start');
  }, [settings.workDuration]);

  // Pause timer
  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'paused',
      pausedAt: Date.now(),
    }));
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'running',
      pausedAt: null,
    }));
  }, []);

  // Stop timer
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(getInitialState());
  }, [getInitialState]);

  // Reset timer
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(getInitialState());
  }, [getInitialState]);

  // Skip to next phase
  const skip = useCallback(() => {
    setState((prev) => {
      const nextPhase = getNextPhase(
        prev.phase,
        prev.currentCycle,
        settings.cyclesBeforeLongBreak,
        settings.cyclesBeforeLongBreak > 0
      );

      let nextDuration: number;
      if (nextPhase === 'work') {
        nextDuration = minutesToSeconds(settings.workDuration);
      } else if (nextPhase === 'long-break') {
        nextDuration = minutesToSeconds(settings.longBreakDuration);
      } else {
        nextDuration = minutesToSeconds(settings.shortBreakDuration);
      }

      const newCycle =
        prev.phase === 'work'
          ? (prev.currentCycle + 1) % (settings.cyclesBeforeLongBreak || 1)
          : prev.currentCycle;

      return {
        ...prev,
        phase: nextPhase as TimerPhase,
        status: 'idle',
        timeRemaining: nextDuration,
        totalTime: nextDuration,
        currentCycle: newCycle,
      };
    });
  }, [settings]);

  return {
    state,
    start,
    pause,
    resume,
    stop,
    reset,
    skip,
  };
}
