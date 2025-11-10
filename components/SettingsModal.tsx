// components/SettingsModal.tsx
import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { TechniqueSettings, TechniqueConfig } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  technique: TechniqueConfig;
  settings: TechniqueSettings;
  onSave: (settings: TechniqueSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  technique,
  settings,
  onSave,
}: SettingsModalProps) {
  // Lazy initialize settings (no useEffect sync → no warning)
  const [localSettings, setLocalSettings] = useState<TechniqueSettings>(
    () => settings
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(technique.defaultSettings);
  };

  const updateSetting = <K extends keyof TechniqueSettings>(
    key: K,
    value: TechniqueSettings[K]
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
                {technique.name} Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customize your session
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
            {technique.id !== 'flowtime' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={localSettings.workDuration}
                  onChange={(e) =>
                    updateSetting('workDuration', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Short Break Duration */}
            {!technique.isFlexible && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {technique.hasLongBreak ? 'Short Break' : 'Break'} Duration
                  (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    updateSetting(
                      'shortBreakDuration',
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Long Break Duration (Pomodoro) */}
            {technique.hasLongBreak && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.longBreakDuration}
                    onChange={(e) =>
                      updateSetting(
                        'longBreakDuration',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cycles Before Long Break
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={localSettings.cyclesBeforeLongBreak}
                    onChange={(e) =>
                      updateSetting(
                        'cyclesBeforeLongBreak',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                style={{ backgroundColor: technique.color }}
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
