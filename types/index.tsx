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
  defaultSettings: TechniqueSettings;
  instructions: string[];
  bestFor: string[];
  hasLongBreak: boolean;
  hasCycles?: boolean;
  isFlexible?: boolean; // For flowtime
}

export interface TechniqueSettings {
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
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
