// Timer display + progress
import { TimerState } from '@/types';
import {
  formatTime,
  getPhaseDisplayName,
  calculateRemaining,
} from '@/lib/timerUtils';

interface TimerDisplayProps {
  state: TimerState;
  color: string;
}

export default function TimerDisplay({ state, color }: TimerDisplayProps) {
  const progress = calculateRemaining(state.timeRemaining, state.totalTime);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Phase Indicator */}
      <div className="mb-8">
        <span
          className="inline-block px-6 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {getPhaseDisplayName(state.phase)}
        </span>
      </div>

      {/* Circular Progress */}
      <div className="relative w-80 h-80 mb-8">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress Circle */}
          <circle
            cx="160"
            cy="160"
            r="120"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Text in Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-6xl md:text-7xl font-bold tabular-nums"
            style={{ color: color }}
          >
            {formatTime(state.timeRemaining, state.totalTime >= 3600)}
          </div>

          {/* Cycle Indicator (for Pomodoro) */}
          {state.totalCycles > 1 && state.phase !== 'idle' && (
            <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Cycle {state.currentCycle} of {state.totalCycles}
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {state.status === 'idle' && state.phase === 'idle' && (
          <p className="text-gray-600 dark:text-gray-400">
            Ready to start? Click the play button below
          </p>
        )}
        {state.status === 'paused' && (
          <p className="text-gray-600 dark:text-gray-400">
            Timer paused • Click play to resume
          </p>
        )}
        {state.status === 'running' && state.phase === 'work' && (
          <p className="text-gray-600 dark:text-gray-400">
            Stay focused and eliminate distractions
          </p>
        )}
        {state.status === 'running' &&
          state.phase !== 'work' &&
          state.phase !== 'idle' && (
            <p className="text-gray-600 dark:text-gray-400">
              Take a well-deserved break
            </p>
          )}
      </div>
    </div>
  );
}
