import React from 'react';
import { ViewState } from '../types';
import { Calculator, History, Trophy, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: ViewState.CALCULATOR, icon: Calculator, label: t('nav_calculator') },
    { id: ViewState.HISTORY, icon: History, label: t('nav_history') },
    { id: ViewState.STATISTICS, icon: BarChart3, label: t('nav_statistics') },
    { id: ViewState.LEVELS, icon: Trophy, label: t('nav_levels') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe px-4 py-3 flex justify-between items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
            />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};