'use client';
import { TechniqueType } from '@/types';
import { useState } from 'react';
import { Lock } from 'lucide-react'; 

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
    locked?: boolean; 
  }[] = [
    {
      id: 'pomodoro',
      label: 'Pomodoro',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      locked: false,
    },
    {
      id: 'flowtime',
      label: 'flowtime',
      color: '#14B8A6',
      bgColor: '#CCFBF1',
      locked: false,
    },
  ];

  const handleTabClick = (tabId: TechniqueType, locked: boolean = false) => {
    if (locked) return;
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId); 
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
                  ? 'dark:text-slate-600 text-gray-400 cursor-default'
                  : 'text-gray-500  bg-transparent cursor-pointer'
              }`}
            >
              <span>{tab.label}</span>
              {tab.locked && (
                <Lock className="w-4 h-4 dark:text-slate-600 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
