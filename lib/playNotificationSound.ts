let isMuted = false;

export function setMute(mute: boolean) {
  isMuted = mute;
}

export function playNotificationSound(
  type: 'start' | 'break' | 'complete' = 'complete'
): void {
  if (isMuted) return;
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
