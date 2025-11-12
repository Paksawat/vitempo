'use client';
import { TechniqueType } from '@/types';
import { useState } from 'react';

interface TabsProps {
  onTabChange?: (tabId: TechniqueType) => void;
}

export default function TechniqueTabs({ onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<TechniqueType>('pomodoro');

  const tabs: { id: TechniqueType; label: string }[] = [
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: '52-17', label: '52-17' },
    { id: '90-minute', label: '90-minute' },
    { id: 'timebox', label: 'timebox' },
    { id: '10-minute', label: '10-minute' },
    { id: 'flowtime', label: 'flowtime' },
  ];

  const handleTabClick = (tabId: TechniqueType) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId); // send tab ID to parent
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
