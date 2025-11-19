// Play/Pause/Stop buttons
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TimerStatus } from '@/types';
import { useEffect } from 'react';

interface TimerControlsProps {
  status?: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSettings: () => void;
  color: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  color,
  isMuted,
  onToggleMute,
}: TimerControlsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // Ignore key presses inside inputs or textareas
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll on space
        if (status === 'idle') onStart();
        else if (status === 'running') onPause();
        else if (status === 'paused') onResume();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        onReset();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onToggleMute();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, onStart, onPause, onResume, onReset, onToggleMute]);
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main Control Buttons */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: color }}
            aria-label="Start timer"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </button>
        )}

        {status === 'running' && (
          <button
            onClick={onPause}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: color }}
            aria-label="Pause timer"
          >
            <Pause className="w-8 h-8 text-white" fill="white" />
          </button>
        )}

        {status === 'paused' && (
          <button
            onClick={onResume}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: color }}
            aria-label="Resume timer"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </button>
        )}

        {/* Stop Button (when running or paused) */}
        {/* {(status === 'running' || status === 'paused') && (
          <button
            onClick={onStop}
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Stop timer"
          >
            <Square
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
              fill="currentColor"
            />
          </button>
        )} */}
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors cursor-pointer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reset
          </span>
        </button>

        {/* Skip Button (when running or paused) */}
        {(status === 'running' || status === 'paused' || status == 'idle') && (
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors cursor-pointer"
            aria-label="Skip to next phase"
          >
            <SkipForward className="w-4 h-4 text-gray-700 dark:text-gray-300 " />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Skip
            </span>
          </button>
        )}

        {/* Settings Button */}
        {/*  <button
          onClick={onSettings}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Settings
          </span>
        </button> */}
        <button
          onClick={onToggleMute}
          className="w-12 h-12 rounded-full bg-slate-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={
            isMuted ? 'Unmute notification sounds' : 'Mute notification sounds'
          }
          title={
            isMuted ? 'Unmute notification sounds' : 'Mute notification sounds'
          }
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-200 " />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 ">
          Space
        </kbd>{' '}
        to play/pause •{' '}
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
          R
        </kbd>{' '}
        to reset
      </div>
    </div>
  );
}
