// Storage hook
import { useState, useEffect } from 'react';

/**
 * Type-safe localStorage hook with SSR safety
 * Automatically serializes/deserializes JSON
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to listen for localStorage changes from other tabs
 */
export function useLocalStorageListener<T>(
  key: string,
  callback: (newValue: T | null) => void
) {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          callback(newValue);
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
}

/**
 * Clear a specific localStorage key
 */
export function clearLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all app-related localStorage keys
 */
export function clearAllAppStorage(prefix: string = 'timer-app-'): void {
  try {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(window.localStorage);
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          window.localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Error clearing app storage:', error);
  }
}
