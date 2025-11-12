'use client';
import { TechniqueType } from '@/types';
import { useState } from 'react';

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
  }[] = [
    { id: 'pomodoro', label: 'Pomodoro', color: '#EF4444', bgColor: '#FEE2E2' },
    { id: '52-17', label: '52-17', color: '#3B82F6', bgColor: '#DBEAFE' },
    {
      id: '90-minute',
      label: '90-minute',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    { id: 'timebox', label: 'timebox', color: '#10B981', bgColor: '#D1FAE5' },
    {
      id: '10-minute',
      label: '10-minute',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    { id: 'flowtime', label: 'flowtime', color: '#14B8A6', bgColor: '#CCFBF1' },
  ];

  const handleTabClick = (tabId: TechniqueType) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId); // send tab ID to parent
  };

  return (
    <div className="w-[calc(100%-8px)] md:min-w-2xl max-w-md mx-auto mt-10 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 ">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-300 ">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={
                isActive
                  ? {
                      borderBottom: `3px solid ${tab.color}`,
                      color: tab.color,
                    }
                  : {}
              }
              className={`flex-1 py-2 text-center font-medium transition-colors duration-200 min-w-22 ${
                isActive
                  ? 'font-semibold'
                  : 'text-gray-500 hover:text-blue-500 bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
