'use client';
import { useState } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import TimerPage from '@/components/Timer';
import TechniqueCard from '@/components/TechniqueCard';
import { TECHNIQUES } from '@/lib/techniques';
import { TechniqueType } from '@/types';
import TechniqueTabs from '@/components/TechniqueTabs';

// ============================================================================
// MAIN APP
// ============================================================================
export default function FocusTimerApp() {
  const [selectedTab, setSelectedTab] = useState<TechniqueType>('pomodoro');
  const [currentView, setCurrentView] = useState<'home' | 'timer'>('home');
  const [selectedTechnique, setSelectedTechnique] =
    useState<TechniqueType | null>(null);

  const handleStartTechnique = (techniqueId: TechniqueType) => {
    setSelectedTechnique(techniqueId);
    setCurrentView('timer');
  };

  const handleTabChange = (tabId: TechniqueType) => {
    console.log('Active tab:', tabId);
    setSelectedTab(tabId);
  };

  const techniques = Object.values(TECHNIQUES);

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

        <TechniqueTabs onTabChange={handleTabChange} />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TimerPage selectedTechnique={selectedTab} />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Built with Next.js, React, TypeScript & Tailwind CSS</p>
              <p className="mt-2">Focus Timer MVP © 2025</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
