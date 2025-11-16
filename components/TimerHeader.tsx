import { Info } from 'lucide-react';
import { useState } from 'react';

interface TimerHeaderProps {
  title: string;
  description: string;
}

const TimerHeader = ({ title, description }: TimerHeaderProps) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="text-center mb-6 shrink-0">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {title}{' '}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Show instructions"
        >
          <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default TimerHeader;
