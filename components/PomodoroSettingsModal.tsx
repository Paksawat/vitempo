// components/PomodoroSettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import {
  PomodoroSettings,
  DEFAULT_POMODORO_SETTINGS,
  POMODORO_SETTINGS_RANGES,
} from '@/lib/settings';
import { msToMinutes, minutesToMs } from '@/lib/timerUtils';

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  color: string;
}

export default function PomodoroSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  color,
}: PomodoroSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(
    () => settings
  );

  // Update local settings when props change
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_POMODORO_SETTINGS);
  };

  const updateSetting = <K extends keyof PomodoroSettings>(
    key: K,
    value: PomodoroSettings[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pomodoro Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customize your Pomodoro sessions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Work Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min={POMODORO_SETTINGS_RANGES.workDuration.min}
                max={POMODORO_SETTINGS_RANGES.workDuration.max}
                step={POMODORO_SETTINGS_RANGES.workDuration.step}
                value={msToMinutes(localSettings.workDuration)}
                onChange={(e) =>
                  updateSetting(
                    'workDuration',
                    minutesToMs(
                      parseInt(e.target.value) ||
                        POMODORO_SETTINGS_RANGES.workDuration.min
                    )
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Short Break Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Break Duration (minutes)
              </label>
              <input
                type="number"
                min={POMODORO_SETTINGS_RANGES.shortBreakDuration.min}
                max={POMODORO_SETTINGS_RANGES.shortBreakDuration.max}
                step={POMODORO_SETTINGS_RANGES.shortBreakDuration.step}
                value={msToMinutes(localSettings.shortBreakDuration)}
                onChange={(e) =>
                  updateSetting(
                    'shortBreakDuration',
                    minutesToMs(
                      parseInt(e.target.value) ||
                        POMODORO_SETTINGS_RANGES.shortBreakDuration.min
                    )
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Long Break Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                min={POMODORO_SETTINGS_RANGES.longBreakDuration.min}
                max={POMODORO_SETTINGS_RANGES.longBreakDuration.max}
                step={POMODORO_SETTINGS_RANGES.longBreakDuration.step}
                value={msToMinutes(localSettings.longBreakDuration)}
                onChange={(e) =>
                  updateSetting(
                    'longBreakDuration',
                    minutesToMs(
                      parseInt(e.target.value) ||
                        POMODORO_SETTINGS_RANGES.longBreakDuration.min
                    )
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Cycles Before Long Break */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cycles Before Long Break
              </label>
              <input
                type="number"
                min={POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.min}
                max={POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.max}
                step={POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.step}
                value={localSettings.cyclesBeforeLongBreak}
                onChange={(e) =>
                  updateSetting(
                    'cyclesBeforeLongBreak',
                    parseInt(e.target.value) ||
                      POMODORO_SETTINGS_RANGES.cyclesBeforeLongBreak.min
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Auto-start Options */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Auto-start Options
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-start breaks
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localSettings.autoStartBreaks}
                    onChange={(e) =>
                      updateSetting('autoStartBreaks', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-start work sessions
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localSettings.autoStartWork}
                    onChange={(e) =>
                      updateSetting('autoStartWork', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>

            {/* Task Options */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Task Options
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-check tasks on completion
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localSettings.autoCheckTasksOnCompletion}
                    onChange={(e) =>
                      updateSetting(
                        'autoCheckTasksOnCompletion',
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: color }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

