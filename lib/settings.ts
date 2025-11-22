// Pomodoro Technique Settings Configuration
import { TechniqueSettings } from '@/types';

/**
 * Pomodoro settings interface
 */
export interface PomodoroSettings extends TechniqueSettings {
  autoCheckTasksOnCompletion: boolean;
}

/**
 * Flowtime settings interface
 */
export interface FlowtimeSettings extends TechniqueSettings {
  autoCheckTasksOnCompletion: boolean;
  breakRatio: number; // Ratio of work time to break time (e.g. 5 means 5 minutes work = 1 minute break)
  useFixedBreak: boolean; // Whether to use a fixed break duration instead of ratio
}

/**
 * Default Pomodoro settings
 * All durations are stored in milliseconds
 */
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25 * 60 * 1000, // 25 minutes in milliseconds
  shortBreakDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
  longBreakDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  initialLongBreakDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  maxLongBreakDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
  cyclesBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  autoCheckTasksOnCompletion: false,
};

/**
 * Default Flowtime settings
 */
export const DEFAULT_FLOWTIME_SETTINGS: FlowtimeSettings = {
  workDuration: 0, // Not used for flowtime limits, but good for initial state
  shortBreakDuration: 5 * 60 * 1000, // Default break suggestion
  longBreakDuration: 0,
  initialLongBreakDuration: 0,
  maxLongBreakDuration: 0,
  cyclesBeforeLongBreak: 0,
  autoStartBreaks: false,
  autoStartWork: false,
  autoCheckTasksOnCompletion: false,
  breakRatio: 5,
  useFixedBreak: false,
};

/**
 * Valid ranges for Pomodoro settings (in minutes for UI display)
 * Settings are stored in milliseconds internally
 */
export const POMODORO_SETTINGS_RANGES = {
  workDuration: {
    min: 1,
    max: 60,
    step: 1,
    unit: 'minutes' as const,
  },
  shortBreakDuration: {
    min: 1,
    max: 15,
    step: 1,
    unit: 'minutes' as const,
  },
  longBreakDuration: {
    min: 10,
    max: 60,
    step: 5,
    unit: 'minutes' as const,
  },
  cyclesBeforeLongBreak: {
    min: 2,
    max: 8,
    step: 1,
  },
} as const;

/**
 * Get default Pomodoro settings
 */
export function getDefaultPomodoroSettings(): PomodoroSettings {
  return { ...DEFAULT_POMODORO_SETTINGS };
}

/**
 * Validate a Pomodoro setting value
 * Durations are validated in milliseconds, but ranges are in minutes
 */
export function validatePomodoroSetting<K extends keyof PomodoroSettings>(
  key: K,
  value: PomodoroSettings[K]
): boolean {
  switch (key) {
    case 'workDuration':
      return (
        typeof value === 'number' &&
        value >= POMODORO_SETTINGS_RANGES.workDuration.min * 60 * 1000 &&
        value <= POMODORO_SETTINGS_RANGES.workDuration.max * 60 * 1000
      );
    case 'shortBreakDuration':
      return (
        typeof value === 'number' &&
        value >= POMODORO_SETTINGS_RANGES.shortBreakDuration.min * 60 * 1000 &&
        value <= POMODORO_SETTINGS_RANGES.shortBreakDuration.max * 60 * 1000
      );
    case 'longBreakDuration':
      return (
        typeof value === 'number' &&
        value >= POMODORO_SETTINGS_RANGES.longBreakDuration.min * 60 * 1000 &&
        value <= POMODORO_SETTINGS_RANGES.longBreakDuration.max * 60 * 1000
      );
    case 'cyclesBeforeLongBreak':
      return (
        typeof value === 'number' &&
        value >= POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.min &&
        value <= POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.max
      );
    case 'autoStartBreaks':
    case 'autoStartWork':
    case 'autoCheckTasksOnCompletion':
      return typeof value === 'boolean';
    case 'initialLongBreakDuration':
    case 'maxLongBreakDuration':
      return typeof value === 'number' && value > 0;
    default:
      return true;
  }
}

/**
 * Clamp a setting value to its valid range
 * Durations are in milliseconds
 */
export function clampPomodoroSetting<K extends keyof PomodoroSettings>(
  key: K,
  value: number
): number {
  switch (key) {
    case 'workDuration':
      return Math.max(
        POMODORO_SETTINGS_RANGES.workDuration.min * 60 * 1000,
        Math.min(POMODORO_SETTINGS_RANGES.workDuration.max * 60 * 1000, value)
      );
    case 'shortBreakDuration':
      return Math.max(
        POMODORO_SETTINGS_RANGES.shortBreakDuration.min * 60 * 1000,
        Math.min(POMODORO_SETTINGS_RANGES.shortBreakDuration.max * 60 * 1000, value)
      );
    case 'longBreakDuration':
      return Math.max(
        POMODORO_SETTINGS_RANGES.longBreakDuration.min * 60 * 1000,
        Math.min(POMODORO_SETTINGS_RANGES.longBreakDuration.max * 60 * 1000, value)
      );
    case 'cyclesBeforeLongBreak':
      return Math.max(
        POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.min,
        Math.min(POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.max, value)
      );
    default:
      return value;
  }
}

