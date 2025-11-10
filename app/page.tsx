'use client';
import { useState } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import TimerPage from '@/components/Timer';
import TechniqueCard from '@/components/TechniqueCard';

// ============================================================================
// TYPES
// ============================================================================
type TechniqueType =
  | 'pomodoro'
  | '52-17'
  | '90-minute'
  | 'timebox'
  | '10-minute'
  | 'flowtime';

type TimerPhase = 'work' | 'short-break' | 'long-break' | 'idle';
type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TechniqueConfig {
  id: TechniqueType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  defaultSettings: TechniqueSettings;
  instructions: string[];
  bestFor: string[];
  hasLongBreak: boolean;
}

interface TechniqueSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

interface TimerState {
  technique: TechniqueType;
  status: TimerStatus;
  phase: TimerPhase;
  timeRemaining: number;
  totalTime: number;
  currentCycle: number;
  totalCycles: number;
}

// ============================================================================
// DATA
// ============================================================================
const TECHNIQUES: Record<TechniqueType, TechniqueConfig> = {
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    shortName: 'Pomodoro',
    description: 'Work in 25-minute focused intervals with short breaks',
    icon: '🍅',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    hasLongBreak: true,
    defaultSettings: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Choose a task to work on',
      'Start the 25-minute timer',
      'Work with full focus until the timer rings',
      'Take a 5-minute break',
      'After 4 pomodoros, take a 15-minute break',
    ],
    bestFor: [
      'Breaking large tasks into manageable chunks',
      'Maintaining consistent focus',
      'Building sustainable work rhythm',
    ],
  },
  '52-17': {
    id: '52-17',
    name: '52/17 Rule',
    shortName: '52/17',
    description: 'Work for 52 minutes, break for 17 minutes',
    icon: '⏱️',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    hasLongBreak: false,
    defaultSettings: {
      workDuration: 52,
      shortBreakDuration: 17,
      longBreakDuration: 0,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Start a 52-minute focused work session',
      'Eliminate all distractions',
      'Take a full 17-minute break',
      'Use break time to truly disconnect',
      'Repeat the cycle as needed',
    ],
    bestFor: [
      'Deep work requiring extended concentration',
      'Complex problem-solving',
      'Creative flow states',
    ],
  },
  '90-minute': {
    id: '90-minute',
    name: '90-Minute Focus Sessions',
    shortName: '90-Min',
    description: 'Deep work blocks aligned with ultradian rhythms',
    icon: '🎯',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    hasLongBreak: false,
    defaultSettings: {
      workDuration: 90,
      shortBreakDuration: 20,
      longBreakDuration: 0,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Block out 90 minutes uninterrupted',
      'Tackle your most challenging task',
      'Work with maximum intensity',
      'Take a full 20-minute recovery break',
      'Limit to 2-3 sessions per day',
    ],
    bestFor: [
      'Deep cognitive work',
      'Writing or design projects',
      'Tasks requiring sustained mental effort',
    ],
  },
  timebox: {
    id: 'timebox',
    name: 'Time-Boxing',
    shortName: 'Time-Box',
    description: 'Allocate fixed time blocks to specific tasks',
    icon: '📦',
    color: '#10B981',
    bgColor: '#D1FAE5',
    hasLongBreak: false,
    defaultSettings: {
      workDuration: 30,
      shortBreakDuration: 5,
      longBreakDuration: 0,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Set a specific time limit for your task',
      'Work only on that task during the time box',
      'Stop when time is up',
      'Take a short break',
      'Review what you accomplished',
    ],
    bestFor: [
      'Managing multiple small tasks',
      'Preventing perfectionism',
      'Improving time estimation',
    ],
  },
  '10-minute': {
    id: '10-minute',
    name: '10-Minute Rule',
    shortName: '10-Min',
    description: 'Start with just 10 minutes to overcome procrastination',
    icon: '🚀',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    hasLongBreak: false,
    defaultSettings: {
      workDuration: 10,
      shortBreakDuration: 5,
      longBreakDuration: 0,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      "Choose a task you've been avoiding",
      'Commit to just 10 minutes',
      'Start immediately',
      'After 10 minutes, decide to continue or break',
      'Celebrate starting',
    ],
    bestFor: [
      'Overcoming procrastination',
      'Starting difficult tasks',
      'Building momentum',
    ],
  },
  flowtime: {
    id: 'flowtime',
    name: 'Flowtime Technique',
    shortName: 'Flowtime',
    description: 'Work until you naturally need a break',
    icon: '🌊',
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    hasLongBreak: false,
    defaultSettings: {
      workDuration: 0,
      shortBreakDuration: 0,
      longBreakDuration: 0,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Start working on your task',
      'Track time without setting alarm',
      'Stop when focus declines',
      'Take proportional break',
      'Use ~5:1 work-to-break ratio',
    ],
    bestFor: [
      'Creative work requiring flow',
      'When rigid timers feel disruptive',
      'Variable attention span days',
    ],
  },
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function FocusTimerApp() {
  const [currentView, setCurrentView] = useState<'home' | 'timer'>('home');
  const [selectedTechnique, setSelectedTechnique] =
    useState<TechniqueType | null>(null);

  const handleStartTechnique = (techniqueId: TechniqueType) => {
    setSelectedTechnique(techniqueId);
    setCurrentView('timer');
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
                    Focus Timer
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    6 productivity techniques in one app
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TimerPage />
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
