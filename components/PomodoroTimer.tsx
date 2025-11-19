'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { setMute } from '@/lib/playNotificationSound';
import { TechniqueConfig } from '@/types';
import { useState } from 'react';
import TimerControls from './TimerControls';
import TimerHeader from './TimerHeader';
import TaskManager from './TaskManager';

interface PomodoroTimerProps {
  data: TechniqueConfig;
}

export default function PomodoroTimer({ data }: PomodoroTimerProps) {
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
    data.defaultSettings.workDuration,
    data.defaultSettings.shortBreakDuration
  );

  const [muted, setMuted] = useState(false);
  // Determine total seconds based on current phase
  const workSeconds = Math.floor(data.defaultSettings.workDuration / 1000);
  const breakSeconds = Math.floor(
    data.defaultSettings.shortBreakDuration / 1000
  );
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
    <div className="min-h-screen bg-linear-to-br  flex flex-col">
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
              {state}
            </span>

            <div
              className="text-6xl font-bold tabular-nums transition-all duration-200 ease-linear"
              style={{ color: data.color }}
            >
              {formatted}
            </div>

            {/* Cycle Indicator (for Pomodoro) */}
            <div className="mt-4 text-slate-700 dark:text-gray-400 text-sm font-medium">
              Cycle {cycle}
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
          onSettings={() => {
            /* Optional: open settings */
          }}
          color={data.color}
          isMuted={muted}
          onToggleMute={handleToggleMute}
        />
      </div>
      <TaskManager currentCycle={workCyclesCompleted} />
    </div>
  );
}
