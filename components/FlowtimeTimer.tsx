import { useFlowtime } from '@/hooks/useFlowtime';
import { setMute } from '@/lib/playNotificationSound';
import { TechniqueConfig } from '@/types';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FlowtimeSettings, DEFAULT_FLOWTIME_SETTINGS } from '@/lib/settings';
import TimerControls from './TimerControls';
import TimerHeader from './TimerHeader';
import TaskManager from './TaskManager';
import FlowtimeSettingsModal from './FlowtimeSettingsModal';
import { Square } from 'lucide-react';

interface FlowtimeTimerProps {
  data: TechniqueConfig;
}

export default function FlowtimeTimer({ data }: FlowtimeTimerProps) {
  // Load settings from localStorage
  const [settings, setSettings] = useLocalStorage<FlowtimeSettings>(
    'flowtime-settings',
    DEFAULT_FLOWTIME_SETTINGS
  );

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    seconds,
    formatted,
    running,
    phase,
    state,
    start,
    stop,
    reset,
    switchPhase,
    lastWorkDuration,
  } = useFlowtime(
    settings.breakRatio,
    settings.autoStartBreaks,
    settings.autoStartWork,
    settings.useFixedBreak,
    settings.shortBreakDuration
  );

  const [muted, setMuted] = useState(false);

  // Calculate status for TimerControls
  let status: 'idle' | 'running' | 'paused';
  
  if (running) {
    status = 'running';
  } else if (!running && seconds > 0) {
    status = 'paused';
  } else {
    status = 'idle';
  }

  // Handle mute toggle
  const handleToggleMute = () => {
    setMuted((m) => {
      setMute(!m);
      return !m;
    });
  };

  // Calculate progress for visual ring
  // For work: maybe just spin or fill up to 60m?
  // For break: countdown from total break time
  const progress = (() => {
    if (phase === 'work') {
      // Just a visual effect for work, maybe based on 60 mins or just spinning
      return (seconds % 3600) / 3600 * 100; 
    } else {
      // For break, we need the total break duration. 
      // Since we don't store total break duration in hook state easily accessible for progress calc without extra state,
      // we can estimate or just show full circle counting down if we knew the start.
      // Actually, let's just show a full circle for now or use a simple visual.
      // If we want accurate progress, we'd need total break time in the hook.
      // Let's assume the initial seconds when switching to break was the max.
      // For now, let's just return 100 to keep it simple or maybe just 0.
      return 100;
    }
  })();

  return (
    <div
      className="min-h-screen bg-linear-to-br flex flex-col"
      key="flowtime-timer"
    >
      <TimerHeader
        title={data.name}
        description={data.description}
        instructions={data.instructions}
      />
      <div className="flex flex-col items-center justify-center transition-all duration-200 ease-linear mb-8">
        {/* Circular Progress */}
        <div className="relative w-80 h-80">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke={data.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={phase === 'work' ? 0 : 0} // Simplified for now
              className={`transition-all duration-1000 ease-linear ${running && phase === 'work' ? 'animate-pulse' : ''}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Timer Text in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Phase Indicator */}
            <span
              className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-2"
              style={{
                backgroundColor: `${data.color}20`,
                color: data.color,
              }}
            >
              {mounted ? state : 'Focus time'}
            </span>

            <div
              className="text-6xl font-bold tabular-nums transition-all duration-200 ease-linear"
              style={{ color: data.color }}
            >
              {mounted && formatted}
            </div>

            {/* Flowtime specific info */}
            <div className="mt-4 text-slate-700 dark:text-gray-400 text-sm font-medium">
              {phase === 'work' ? 'Counting up' : 'Break time (Counting down)'}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <TimerControls
          status={status}
          onStart={start}
          onPause={phase === 'work' ? switchPhase : stop}
          onResume={start}
          onStop={reset}
          onReset={reset}
          onSkip={switchPhase} 
          onSettings={() => setShowSettingsModal(true)}
          color={data.color}
          isMuted={muted}
          onToggleMute={handleToggleMute}
          runningIcon={
            phase === 'work' ? (
              <Square className="w-6 h-6 text-white fill-white" />
            ) : undefined
          }
          runningLabel={phase === 'work' ? 'Stop and take break' : undefined}
        />
      </div>
      
      <TaskManager
        currentCycle={0} // Flowtime doesn't really track cycles in the same way
        autoCheckTasksOnCompletion={settings.autoCheckTasksOnCompletion}
      />
      
      <FlowtimeSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
        }}
        color={data.color}
      />
    </div>
  );
}
