'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { setMute } from '@/lib/playNotificationSound';
import { TechniqueConfig } from '@/types';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PomodoroSettings, DEFAULT_POMODORO_SETTINGS } from '@/lib/settings';
import { msToSeconds } from '@/lib/timerUtils';
import TimerControls from './TimerControls';
import TimerHeader from './TimerHeader';
import TaskManager from './TaskManager';
import PomodoroSettingsModal from './PomodoroSettingsModal';

interface PomodoroTimerProps {
  data: TechniqueConfig;
}

// Helper function to migrate old settings format (minutes) to new format (milliseconds)
function migrateSettings(
  settings: PomodoroSettings | Partial<PomodoroSettings>
): PomodoroSettings {
  // Check if settings are in old format (values < 1000 are likely minutes)
  const isOldFormat =
    typeof settings.workDuration === 'number' &&
    settings.workDuration !== undefined &&
    settings.workDuration < 1000 &&
    settings.workDuration > 0;

  if (isOldFormat && settings.workDuration !== undefined) {
    // Convert from minutes to milliseconds
    return {
      ...DEFAULT_POMODORO_SETTINGS,
      ...settings,
      workDuration: settings.workDuration * 60 * 1000,
      shortBreakDuration: (settings.shortBreakDuration || 5) * 60 * 1000,
      longBreakDuration: (settings.longBreakDuration || 15) * 60 * 1000,
      initialLongBreakDuration:
        (settings.initialLongBreakDuration || 15) * 60 * 1000,
      maxLongBreakDuration: (settings.maxLongBreakDuration || 30) * 60 * 1000,
    };
  }

  return { ...DEFAULT_POMODORO_SETTINGS, ...settings } as PomodoroSettings;
}

export default function PomodoroTimer({ data }: PomodoroTimerProps) {
  // Load settings from localStorage (loads synchronously on client)
  const [rawSettings, setRawSettings] = useLocalStorage<
    PomodoroSettings | Partial<PomodoroSettings>
  >('pomodoro-settings', DEFAULT_POMODORO_SETTINGS);

  // Migrate old format to new format if needed and get final settings
  const settings = migrateSettings(rawSettings);

  // Save migrated settings back if migration occurred (one-time migration)
  useEffect(() => {
    const migrated = migrateSettings(rawSettings);
    // Check if migration is needed (old format detected)
    const needsMigration =
      typeof rawSettings.workDuration === 'number' &&
      rawSettings.workDuration < 1000 &&
      rawSettings.workDuration > 0;

    if (needsMigration) {
      setRawSettings(migrated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrapper for setSettings that ensures we're working with the migrated format
  const updateSettings = (newSettings: PomodoroSettings) => {
    setRawSettings(newSettings);
  };

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after first render to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always use migrated settings (which includes localStorage values on client)
  // This ensures both the hook and display use the same values
  const effectiveSettings = settings;

  const {
    seconds,
    formatted,
    progress,
    running,
    isWorkTime,
    cycle,
    workCyclesCompleted,
    state,
    start,
    stop,
    reset,
    skip,
  } = useCountdown(
    effectiveSettings.workDuration, // Already in milliseconds
    effectiveSettings.shortBreakDuration, // Already in milliseconds
    effectiveSettings.autoStartBreaks, // Auto-start breaks
    effectiveSettings.autoStartWork // Auto-start work sessions
  );

  // Ensure timer displays correct duration from localStorage on initial load
  // Reset when mounted to sync with localStorage settings
  useEffect(() => {
    if (mounted && !running) {
      // Reset to ensure timer uses the correct localStorage settings
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Reset timer when duration settings change (only if not running)
  useEffect(() => {
    if (mounted && !running) {
      reset();
    }
    console.log(effectiveSettings.workDuration);
    console.log(formatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveSettings.workDuration,
    effectiveSettings.shortBreakDuration,
    mounted,
  ]);

  const [muted, setMuted] = useState(false);
  // Determine total seconds based on current phase (convert from milliseconds)
  const workSeconds = msToSeconds(effectiveSettings.workDuration);
  const breakSeconds = msToSeconds(effectiveSettings.shortBreakDuration);
  const totalSeconds = isWorkTime ? workSeconds : breakSeconds;

  // Calculate status for TimerControls
  let status: 'idle' | 'running' | 'paused';
  const atStart = seconds === totalSeconds;

  if (running) {
    status = 'running';
  } else if (!running && !atStart) {
    status = 'paused';
  } else {
    status = 'idle';
  }

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Handle mute toggle
  const handleToggleMute = () => {
    setMuted((m) => {
      setMute(!m);
      return !m;
    });
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br  flex flex-col"
      key={`timer-${effectiveSettings.workDuration}-${effectiveSettings.shortBreakDuration}`}
    >
      <TimerHeader
        title={data.name}
        description={data.description}
        instructions={data.instructions}
      />
      <div className="flex flex-col items-center justify-center transition-all duration-200 ease-linear mb-8">
        {/* Circular Progress */}
        <div className="relative w-80 h-80">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke={data.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-200 ease-linear"
              strokeLinecap="round"
            />
          </svg>

          {/* Timer Text in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Phase Indicator */}
            <span
              className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-2"
              style={{
                backgroundColor: `${data.color}20`,
                color: data.color,
              }}
            >
              {mounted ? state : 'Focus time'}
            </span>

            <div
              className="text-6xl font-bold tabular-nums transition-all duration-200 ease-linear"
              style={{ color: data.color }}
            >
              {mounted && formatted}
            </div>

            {/* Cycle Indicator (for Pomodoro) */}
            <div className="mt-4 text-slate-700 dark:text-gray-400 text-sm font-medium">
              Cycle {mounted ? cycle : 1}
            </div>
          </div>
        </div>
        {/* Use TimerControls component */}
        <TimerControls
          status={status}
          onStart={start}
          onPause={stop}
          onResume={start}
          onStop={reset} // or stop() if you want stop separate from reset
          onReset={reset}
          onSkip={skip}
          onSettings={() => setShowSettingsModal(true)}
          color={data.color}
          isMuted={muted}
          onToggleMute={handleToggleMute}
        />
      </div>
      <TaskManager
        currentCycle={workCyclesCompleted}
        autoCheckTasksOnCompletion={
          effectiveSettings.autoCheckTasksOnCompletion
        }
      />
      <PomodoroSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSave={(newSettings) => {
          // Only reset timer if duration-related settings changed
          const durationChanged =
            settings.workDuration !== newSettings.workDuration ||
            settings.shortBreakDuration !== newSettings.shortBreakDuration ||
            settings.longBreakDuration !== newSettings.longBreakDuration ||
            settings.cyclesBeforeLongBreak !==
              newSettings.cyclesBeforeLongBreak;

          updateSettings(newSettings);

          // Only reset if duration settings changed (not boolean toggles)
          if (durationChanged && !running) {
            reset();
          }
        }}
        color={data.color}
      />
    </div>
  );
}
