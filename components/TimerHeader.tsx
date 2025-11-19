import { Info } from 'lucide-react';
import { useState } from 'react';
import InfoModal from './infoModal';

interface TimerHeaderProps {
  title: string;
  description: string;
  instructions: string[];
}

const TimerHeader = ({
  title,
  description,
  instructions,
}: TimerHeaderProps) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="text-center mb-6 shrink-0">
      <h2 className="text-4xl md:text-5xl font-bold text-slate-600 dark:text-white mb-4">
        {title}{' '}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Show instructions"
        >
          <Info className="w-5 h-5 text-slate-600 dark:text-gray-300 cursor-pointer" />
        </button>
      </h2>
      <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
        {description}
      </p>

      <InfoModal
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title={title}
        instructions={instructions}
      />
    </div>
  );
};

export default TimerHeader;
