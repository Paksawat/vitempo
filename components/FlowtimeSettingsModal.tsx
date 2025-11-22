import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import {
  FlowtimeSettings,
  DEFAULT_FLOWTIME_SETTINGS,
} from '@/lib/settings';

interface FlowtimeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FlowtimeSettings;
  onSave: (settings: FlowtimeSettings) => void;
  color: string;
}

export default function FlowtimeSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  color,
}: FlowtimeSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<FlowtimeSettings>(
    () => ({ ...DEFAULT_FLOWTIME_SETTINGS, ...settings })
  );

  useEffect(() => {
    if (isOpen) {
      setLocalSettings({ ...DEFAULT_FLOWTIME_SETTINGS, ...settings });
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_FLOWTIME_SETTINGS);
  };

  const updateSetting = <K extends keyof FlowtimeSettings>(
    key: K,
    value: FlowtimeSettings[K]
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
                Flowtime Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customize your Flowtime experience
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
            {/* Break Calculation Mode */}
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Use fixed duration
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localSettings.useFixedBreak}
                    onChange={(e) =>
                      updateSetting('useFixedBreak', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                </div>
              </label>

              {!localSettings.useFixedBreak ? (
                /* Dynamic Mode - No options to show, uses default ratio */
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Break duration will be calculated automatically based on your work time (1 minute break for every 5 minutes of work).
                </div>
              ) : (
                /* Fixed Break Duration Input */
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Break Duration (minutes)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Always take a fixed break duration regardless of work time.
                  </p>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    step={1}
                    value={Math.floor((localSettings.shortBreakDuration || 300000) / 60000)}
                    onChange={(e) =>
                      updateSetting(
                        'shortBreakDuration',
                        Math.max(1, parseInt(e.target.value) || 5) * 60 * 1000
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Auto-start Options */}
            <div className="space-y-3">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
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
