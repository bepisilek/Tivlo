import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, TrendingUp, TrendingDown, ShoppingBag, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryProps {
  items: HistoryItem[];
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ items, onClearHistory }) => {
  const { t } = useLanguage();
  
  const totalSavedHours = items
    .filter(i => i.decision === 'saved')
    .reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
  
  const totalSpentHours = items
    .filter(i => i.decision === 'bought')
    .reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pb-20 px-6 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag size={28} className="md:hidden" />
          <ShoppingBag size={32} className="hidden md:block" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('history_empty_title')}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-xs">
          {t('history_empty_desc')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-3 md:p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 shrink-0">
        
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2">
            <div className="bg-emerald-50 dark:bg-emerald-600/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex items-center gap-1.5 md:gap-2 text-emerald-600 dark:text-emerald-400 mb-0.5 md:mb-1">
                    <TrendingUp size={12} className="md:hidden" />
                    <TrendingUp size={16} className="hidden md:block" />
                    <span className="text-[10px] md:text-xs font-bold uppercase">{t('saved_stat')}</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {Math.floor(totalSavedHours)}<span className="text-xs md:text-sm font-medium text-slate-500 ml-0.5 md:ml-1">{t('hour_short')}</span>
                </div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-rose-100 dark:border-rose-500/20">
                 <div className="flex items-center gap-1.5 md:gap-2 text-rose-600 dark:text-rose-400 mb-0.5 md:mb-1">
                    <TrendingDown size={12} className="md:hidden" />
                    <TrendingDown size={16} className="hidden md:block" />
                    <span className="text-[10px] md:text-xs font-bold uppercase">{t('spent_stat')}</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {Math.floor(totalSpentHours)}<span className="text-xs md:text-sm font-medium text-slate-500 ml-0.5 md:ml-1">{t('hour_short')}</span>
                </div>
            </div>
        </div>

         <div className="flex justify-end">
             <button 
                onClick={onClearHistory}
                className="text-[10px] md:text-xs font-medium text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1 py-1"
             >
                <Trash2 size={12} className="md:hidden" />
                <Trash2 size={14} className="hidden md:block" />
                {t('clear_history')}
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 no-scrollbar pb-24">
        {items.slice().reverse().map((item) => (
          <div 
            key={item.id} 
            className={`group relative bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border-l-4 shadow-sm transition-all hover:shadow-md ${
                item.decision === 'bought' 
                ? 'border-rose-500' 
                : 'border-emerald-500'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white pr-4 truncate w-2/3">
                    {item.productName || t('item_unnamed')}
                </h4>
                <span className="text-[10px] md:text-xs text-slate-500 font-medium whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                </span>
            </div>
            
            <div className="flex justify-between items-end mt-2">
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {item.price.toLocaleString()} {item.currency}
                </div>
                <div className={`font-bold text-base md:text-lg ${
                    item.decision === 'bought' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                    {Math.floor(item.totalHoursDecimal)}h {Math.round((item.totalHoursDecimal % 1) * 60)}m
                </div>
            </div>
            
            {item.adviceUsed && (
                 <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex gap-1.5 md:gap-2 items-start text-[10px] md:text-xs text-slate-400 italic">
                    <MessageCircle size={10} className="mt-0.5 shrink-0 opacity-70 md:hidden" />
                    <MessageCircle size={12} className="mt-0.5 shrink-0 opacity-70 hidden md:block" />
                    <span className="line-clamp-2">"{item.adviceUsed}"</span>
                 </div>
            )}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.decision === 'bought' ? (
                    <span className="px-1.5 md:px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[9px] md:text-[10px] rounded-full font-bold uppercase tracking-wide">{t('tag_bought')}</span>
                ) : (
                    <span className="px-1.5 md:px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] md:text-[10px] rounded-full font-bold uppercase tracking-wide">{t('tag_saved')}</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
