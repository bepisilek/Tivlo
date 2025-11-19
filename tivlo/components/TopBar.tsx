import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
      <button 
        onClick={onMenuClick}
        className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};