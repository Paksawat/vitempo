'use client';
import { TechniqueType } from '@/types';
import { useState } from 'react';
import { Lock } from 'lucide-react'; // Import lucide lock icon

interface TabsProps {
  onTabChange?: (tabId: TechniqueType) => void;
}

export default function TechniqueTabs({ onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<TechniqueType>('pomodoro');

  const tabs: {
    id: TechniqueType;
    label: string;
    color: string;
    bgColor: string;
    locked?: boolean; // add locked flag
  }[] = [
    {
      id: 'pomodoro',
      label: 'Pomodoro',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      locked: false,
    },
    {
      id: '52-17',
      label: '52-17',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      locked: true,
    },
    {
      id: '90-minute',
      label: '90-minute',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      locked: true,
    },
    {
      id: 'timebox',
      label: 'timebox',
      color: '#10B981',
      bgColor: '#D1FAE5',
      locked: true,
    },
    {
      id: '10-minute',
      label: '10-minute',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      locked: true,
    },
    {
      id: 'flowtime',
      label: 'flowtime',
      color: '#14B8A6',
      bgColor: '#CCFBF1',
      locked: true,
    },
  ];

  const handleTabClick = (tabId: TechniqueType, locked: boolean = false) => {
    if (locked) return; // prevent clicking locked tabs
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId); // send tab ID to parent
  };

  return (
    <div className="w-[calc(100%-8px)] md:min-w-2xl max-w-md mt-10 overflow-x-auto scroll-smooth snap-x snap-mandatory mx-4 border-b border-gray-300 ">
      {/* Tab buttons */}
      <div className="flex ">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.locked)}
              disabled={tab.locked}
              style={
                isActive
                  ? {
                      borderBottom: `3px solid ${tab.color}`,
                      color: tab.color,
                    }
                  : {}
              }
              className={`flex-1 py-2 text-center font-medium transition-colors duration-200 min-w-24 flex items-center justify-center space-x-1 ${
                isActive
                  ? 'font-semibold'
                  : tab.locked
                  ? 'text-slate-600 cursor-default'
                  : 'text-gray-500  bg-transparent cursor-pointer'
              }`}
            >
              <span>{tab.label}</span>
              {tab.locked && <Lock className="w-4 h-4 text-slate-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
