'use client';
import PomodoroTimer from '@/components/PomodoroTimer';
import TechniqueTabs from '@/components/TechniqueTabs';
import { TECHNIQUES } from '@/lib/techniques';
import { TechniqueType } from '@/types';
import { Clock } from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// MAIN APP
// ============================================================================

export default function FocusTimerApp() {
  const [selectedTechnique, setSelectedTechnique] = useState(
    TECHNIQUES['pomodoro']
  );

  const handleTabChange = (tabId: TechniqueType) => {
    const technique = TECHNIQUES[tabId]; // ← lookup actual config
    setSelectedTechnique(technique);
  };
  return (
    <div>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Vitempo
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="w-full flex flex-col items-center">
          <TechniqueTabs onTabChange={handleTabChange} />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PomodoroTimer data={selectedTechnique} />
        </main>
      </div>
    </div>
  );
}
