// Timer Calculations

/**
 * Format seconds into MM:SS or HH:MM:SS
 */
export function formatTime(
  seconds: number,
  showHours: boolean = false
): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (showHours || hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Format seconds into human-readable text (e.g., "25 minutes", "1 hour 30 minutes")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${
      minutes !== 1 ? 's' : ''
    }`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

/**
 * Convert minutes to seconds
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * Convert seconds to minutes (rounded)
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(elapsed: number, total: number): number {
  if (total === 0) return 0;
  const progress = (elapsed / total) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Calculate remaining percentage
 */
export function calculateRemaining(remaining: number, total: number): number {
  if (total === 0) return 0;
  const progress = (remaining / total) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Get phase display name
 */
export function getPhaseDisplayName(phase: string): string {
  const phaseMap: Record<string, string> = {
    work: 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
    idle: 'Ready to Start',
  };

  return phaseMap[phase] || phase;
}

/**
 * Get next phase
 */
export function getNextPhase(
  currentPhase: string,
  currentCycle: number,
  cyclesBeforeLongBreak: number,
  hasLongBreak: boolean
): string {
  if (currentPhase === 'work') {
    if (hasLongBreak && currentCycle >= cyclesBeforeLongBreak) {
      return 'long-break';
    }
    return 'short-break';
  }

  return 'work';
}

/**
 * Check if timer should auto-start next phase
 */
export function shouldAutoStart(
  phase: string,
  autoStartBreaks: boolean,
  autoStartWork: boolean
): boolean {
  if (phase === 'work') {
    return autoStartWork;
  }

  return autoStartBreaks;
}

/**
 * Update document title with timer
 */
export function updateDocumentTitle(
  timeRemaining: number,
  phase: string,
  isRunning: boolean,
  defaultTitle: string = 'Timer App'
): void {
  if (typeof document === 'undefined') return;

  if (isRunning && timeRemaining > 0) {
    const timeStr = formatTime(timeRemaining);
    const phaseStr = phase === 'work' ? '🎯' : '☕';
    document.title = `${phaseStr} ${timeStr} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
}

/**
 * Play notification sound (placeholder for now)
 */
export function playNotificationSound(
  type: 'start' | 'break' | 'complete' = 'complete'
): void {
  // In a full implementation, this would play different sounds
  // For now, we'll use the system beep
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Different frequencies for different types
      const frequencies: Record<string, number> = {
        start: 440,
        break: 523.25,
        complete: 587.33,
      };

      oscillator.frequency.value = frequencies[type] || 440;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 0.5
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }
}

/**
 * Vibrate device (mobile)
 */
export function vibrateDevice(pattern: number | number[] = 200): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Show browser notification (requires permission)
 */
export async function showBrowserNotification(
  title: string,
  body: string,
  icon?: string
): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icon.png',
      badge: '/icon.png',
    });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/icon.png',
      });
    }
  }
}
