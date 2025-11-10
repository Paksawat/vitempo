// Main timer component
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Info } from 'lucide-react';
import { TechniqueType, TechniqueSettings, TechniqueConfig } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTechnique } from '../lib/techniques';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControls';
import SettingsModal from '../components/SettingsModal';

// Mock data - in real app, this would come from params
const MOCK_TECHNIQUE: TechniqueType = '52-17';

export default function TimerPage() {
  const technique = getTechnique(MOCK_TECHNIQUE);
  const [settings, setSettings] = useLocalStorage<TechniqueSettings>(
    `timer-settings-${technique.id}`,
    technique.defaultSettings
  );

  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const { state, start, pause, resume, stop, reset, skip } = useTimer({
    technique: technique.id,
    settings,
    onPhaseComplete: (phase) => {
      console.log('Phase complete:', phase);
    },
    onSessionComplete: () => {
      console.log('Session complete!');
    },
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (state.status === 'idle') {
          start();
        } else if (state.status === 'running') {
          pause();
        } else if (state.status === 'paused') {
          resume();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.status, start, pause, resume, reset]);

  const handleSaveSettings = (newSettings: TechniqueSettings) => {
    setSettings(newSettings);
    reset(); // Reset timer with new settings
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Focus Method
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select from six proven time management techniques. Each one is
          tailored for different types of work and energy levels.
        </p>
      </div>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Go home"
              >
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {technique.icon} {technique.shortName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {technique.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Show instructions"
            >
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          {/* Timer Display */}
          <TimerDisplay state={state} color={technique.color} />

          {/* Controls */}
          <div className="mt-12">
            <TimerControls
              status={state.status}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onReset={reset}
              onSkip={skip}
              onSettings={() => setShowSettings(true)}
              color={technique.color}
            />
          </div>

          {/* Instructions Panel (collapsible) */}
          {showInfo && (
            <div className="mt-12 w-full max-w-2xl">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  How It Works
                </h2>
                <ol className="space-y-3">
                  {technique.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: technique.color }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Best For:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technique.bestFor.map((item, index) => (
                      <span
                        key={index}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${technique.color}20`,
                          color: technique.color,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        technique={technique}
        settings={settings}
        onSave={handleSaveSettings}
      />

      {/* Demo Note */}
      <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto">
        <div className="bg-indigo-600 text-white text-xs p-3 rounded-lg shadow-lg">
          <p className="font-medium mb-1">🚀 MVP Demo</p>
          <p className="opacity-90">
            This is a demo of the timer page. The full app would have navigation
            between all 6 techniques.
          </p>
        </div>
      </div>
    </div>
  );
}
