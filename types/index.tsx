// types/index.ts
export type TechniqueType =
  | 'pomodoro'
  | '52-17'
  | '90-minute'
  | 'timebox'
  | '10-minute'
  | 'flowtime';

export type TimerPhase = 'work' | 'short-break' | 'long-break' | 'idle';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TechniqueConfig {
  id: TechniqueType;
  name: string;
  shortName: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  color: string;
  bgColor: string;
  defaultSettings: {
    workDuration: number;
    shortBreakDuration: number;
    initialLongBreakDuration: number;
    longBreakDuration: number;
    maxLongBreakDuration: number;
    cyclesBeforeLongBreak: number;
    autoStartBreaks: boolean;
    autoStartWork: boolean;
  };
  instructions: string[];
  bestFor: string[];
  hasLongBreak: boolean;
  hasCycles?: boolean;
  isFlexible?: boolean;
}

export interface TechniqueSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  initialLongBreakDuration: number;
  maxLongBreakDuration: number;
  cyclesBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  customLabel?: string;
}

export interface TimerState {
  technique: TechniqueType;
  status: TimerStatus;
  phase: TimerPhase;
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  currentCycle: number;
  totalCycles: number;
  sessionStartTime: number | null;
  pausedAt: number | null;
}

export interface StoredTimerState {
  state: TimerState;
  lastUpdated: number;
}
