// Technique configs
import { TechniqueConfig, TechniqueType } from '@/types';

export const TECHNIQUES: Record<TechniqueType, TechniqueConfig> = {
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    shortName: 'Pomodoro',
    description: 'Work in 25-minute focused intervals with short breaks',
    detailedDescription:
      'The classic time management method. Break work into 25-minute chunks separated by 5-minute breaks. After 4 pomodoros, take a longer 15-minute break.',
    icon: '🍅',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    hasLongBreak: true,
    hasCycles: true,
    isFlexible: false,
    defaultSettings: {
      workDuration: 1000,
      shortBreakDuration: 1000,
      initialLongBreakDuration: 900000,
      longBreakDuration: 15,
      maxLongBreakDuration: 30,
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
      'Maintaining consistent focus throughout the day',
      'Building a sustainable work rhythm',
      'Avoiding burnout with regular breaks',
    ],
  },

  '52-17': {
    id: '52-17',
    name: '52/17 Rule',
    shortName: '52/17',
    description: 'Work for 52 minutes, break for 17 minutes',
    detailedDescription:
      'Based on productivity research, this technique uses 52 minutes of focused work followed by 17 minutes of rest. The longer work period allows for deeper flow states.',
    icon: '⏱️',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    hasLongBreak: false,
    hasCycles: false,
    isFlexible: false,
    defaultSettings: {
      workDuration: 52,
      shortBreakDuration: 17,
      longBreakDuration: 0,
      initialLongBreakDuration: 15,
      maxLongBreakDuration: 30,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Start a 52-minute focused work session',
      'Eliminate all distractions during work time',
      'When timer ends, take a full 17-minute break',
      'Use break time to truly disconnect',
      'Repeat the cycle as needed',
    ],
    bestFor: [
      'Deep work that requires extended concentration',
      'Complex problem-solving tasks',
      'Creative work that benefits from flow states',
      'When you need longer uninterrupted focus periods',
    ],
  },

  '90-minute': {
    id: '90-minute',
    name: '90-Minute Focus Sessions',
    shortName: '90-Min',
    description: 'Deep work blocks aligned with ultradian rhythms',
    detailedDescription:
      "Work in 90-minute blocks that align with your body's natural energy cycles (ultradian rhythms), followed by 20-30 minute recovery periods.",
    icon: '🎯',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    hasLongBreak: false,
    hasCycles: false,
    isFlexible: false,
    defaultSettings: {
      workDuration: 90,
      shortBreakDuration: 20,
      longBreakDuration: 0,
      initialLongBreakDuration: 15,
      maxLongBreakDuration: 30,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Block out 90 minutes of uninterrupted time',
      'Tackle your most important or challenging task',
      'Work with maximum intensity and focus',
      'Take a full 20-minute break to recover',
      'Limit to 2-3 sessions per day',
    ],
    bestFor: [
      'Deep, cognitively demanding work',
      'Writing, coding, or design projects',
      'Tasks requiring sustained mental effort',
      'When you need to make significant progress',
    ],
  },

  timebox: {
    id: 'timebox',
    name: 'Time-Boxing',
    shortName: 'Time-Box',
    description: 'Allocate fixed time blocks to specific tasks',
    detailedDescription:
      'Assign specific time blocks to tasks and work within those constraints. Forces prioritization and prevents perfectionism.',
    icon: '📦',
    color: '#10B981',
    bgColor: '#D1FAE5',
    hasLongBreak: false,
    hasCycles: false,
    isFlexible: true,
    defaultSettings: {
      workDuration: 30,
      shortBreakDuration: 5,
      longBreakDuration: 0,
      initialLongBreakDuration: 15,
      maxLongBreakDuration: 30,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Set a specific time limit for your task',
      'Work on only that task during the time box',
      'Stop when the time is up, regardless of completion',
      'Take a short break before the next box',
      'Review what you accomplished',
    ],
    bestFor: [
      'Managing multiple small tasks',
      'Preventing perfectionism and over-work',
      'Improving time estimation skills',
      'Creating urgency and focus',
    ],
  },

  '10-minute': {
    id: '10-minute',
    name: '10-Minute Rule',
    shortName: '10-Min',
    description: 'Start with just 10 minutes to overcome procrastination',
    detailedDescription:
      'Commit to working on a task for just 10 minutes. Often, getting started is the hardest part. After 10 minutes, you can continue or take a break.',
    icon: '🚀',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    hasLongBreak: false,
    hasCycles: false,
    isFlexible: true,
    defaultSettings: {
      workDuration: 10,
      shortBreakDuration: 5,
      longBreakDuration: 0,
      initialLongBreakDuration: 15,
      maxLongBreakDuration: 30,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      "Choose a task you've been avoiding",
      'Commit to just 10 minutes of work',
      'Start immediately without overthinking',
      'After 10 minutes, decide: continue or break',
      'Celebrate starting, even if you stop',
    ],
    bestFor: [
      'Overcoming procrastination',
      'Starting difficult or unpleasant tasks',
      'Building momentum on big projects',
      'Tasks that feel overwhelming',
    ],
  },

  flowtime: {
    id: 'flowtime',
    name: 'Flowtime Technique',
    shortName: 'Flowtime',
    description: 'Work until you naturally need a break, then rest',
    detailedDescription:
      'Instead of fixed intervals, work until you feel your focus waning, then take a break. Respects your natural energy and attention fluctuations.',
    icon: '🌊',
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    hasLongBreak: false,
    hasCycles: false,
    isFlexible: true,
    defaultSettings: {
      workDuration: 0,
      shortBreakDuration: 0,
      longBreakDuration: 0,
      initialLongBreakDuration: 15,
      maxLongBreakDuration: 30,
      cyclesBeforeLongBreak: 0,
      autoStartBreaks: false,
      autoStartWork: false,
    },
    instructions: [
      'Start working on your task',
      "Track time but don't set an alarm",
      'Stop when you notice focus declining',
      'Take a break proportional to work time',
      'Longer work = longer break (rough 5:1 ratio)',
    ],
    bestFor: [
      'Creative work requiring flow states',
      'When rigid timers feel disruptive',
      'Variable attention span days',
      'Learning what your natural rhythms are',
    ],
  },
};

// Helper functions
export function getTechnique(id: TechniqueType): TechniqueConfig {
  return TECHNIQUES[id];
}

export function getAllTechniques(): TechniqueConfig[] {
  return Object.values(TECHNIQUES);
}

export function getTechniqueColor(id: TechniqueType): string {
  return TECHNIQUES[id].color;
}

export function getTechniqueBgColor(id: TechniqueType): string {
  return TECHNIQUES[id].bgColor;
}
