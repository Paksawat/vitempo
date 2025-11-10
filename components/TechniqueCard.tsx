// Technique selection card
import { TechniqueConfig } from '@/types';
import { ArrowRight, Clock } from 'lucide-react';

interface TechniqueCardProps {
  technique: TechniqueConfig;
  onStart: () => void;
  isDefault?: boolean;
}

export default function TechniqueCard({
  technique,
  onStart,
  isDefault,
}: TechniqueCardProps) {
  const { name, description, icon, color, bgColor, defaultSettings } =
    technique;

  // Format time display based on technique
  const getTimeDisplay = () => {
    if (technique.id === 'flowtime') {
      return 'Flexible';
    }
    if (technique.id === 'timebox' || technique.id === '10-minute') {
      return `${defaultSettings.workDuration}min`;
    }
    if (technique.hasLongBreak) {
      return `${defaultSettings.workDuration}/${defaultSettings.shortBreakDuration}/${defaultSettings.longBreakDuration}`;
    }
    return `${defaultSettings.workDuration}/${defaultSettings.shortBreakDuration}`;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Colored accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

      {/* Default badge */}
      {isDefault && (
        <div className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2 py-1 rounded">
          Default
        </div>
      )}

      <div className="p-6">
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: bgColor }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{getTimeDisplay()}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2">
          {description}
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white transition-all hover:shadow-md active:scale-98"
          style={{ backgroundColor: color }}
        >
          <span>Start Session</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>

        {/* Best for tags */}
        {technique.bestFor.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Best for:
            </p>
            <div className="flex flex-wrap gap-2">
              {technique.bestFor.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
