import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatisticsProps {
  history: HistoryItem[];
}

export const Statistics: React.FC<StatisticsProps> = ({ history }) => {
  const { t } = useLanguage();
  // Default date range: Last 30 days
  const defaultEndDate = new Date().toISOString().split('T')[0];
  const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const filteredItems = useMemo(() => {
    const start = new Date(startDate).setHours(0,0,0,0);
    const end = new Date(endDate).setHours(23,59,59,999);

    return history.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= start && itemDate <= end;
    });
  }, [history, startDate, endDate]);

  const stats = useMemo(() => {
    const saved = filteredItems.filter(i => i.decision === 'saved');
    const bought = filteredItems.filter(i => i.decision === 'bought');

    const savedHours = saved.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
    const spentHours = bought.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
    
    const savedMoney = saved.reduce((acc, curr) => acc + curr.price, 0);
    const spentMoney = bought.reduce((acc, curr) => acc + curr.price, 0);

    const totalHours = savedHours + spentHours;
    const savedPercentage = totalHours > 0 ? (savedHours / totalHours) * 100 : 0;

    return { savedHours, spentHours, savedMoney, spentMoney, savedPercentage };
  }, [filteredItems]);

  const currency = history.length > 0 ? history[0].currency : 'HUF';

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
        
        {/* Date Filter */}
        <div className="p-4 bg-white dark:bg-slate-900 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                <Calendar size={12} /> {t('stats_period')}
            </div>
            <div className="flex gap-3">
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* Stats Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24 space-y-6">
            
            {/* Main Chart Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400">{Math.round(stats.savedPercentage)}% {t('stats_kept')}</span>
                    <span className="text-rose-600 dark:text-rose-400">{Math.round(100 - stats.savedPercentage)}% {t('stats_spent')}</span>
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${stats.savedPercentage}%` }} className="bg-emerald-500 h-full transition-all duration-500"></div>
                    <div style={{ width: `${100 - stats.savedPercentage}%` }} className="bg-rose-500 h-full transition-all duration-500"></div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5">
                    <h3 className="text-emerald-800 dark:text-emerald-300 font-semibold mb-1">{t('stats_saved_time')}</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        {stats.savedHours.toFixed(1)} <span className="text-lg font-medium text-slate-500">{t('hour_short')}</span>
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        + {stats.savedMoney.toLocaleString()} {currency}
                    </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-600/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-5">
                    <h3 className="text-rose-800 dark:text-rose-300 font-semibold mb-1">{t('stats_spent_time')}</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        {stats.spentHours.toFixed(1)} <span className="text-lg font-medium text-slate-500">{t('hour_short')}</span>
                    </div>
                    <div className="text-sm text-rose-600 dark:text-rose-400 font-mono font-medium">
                        - {stats.spentMoney.toLocaleString()} {currency}
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 pt-4">
                {t('stats_decision_count', { count: filteredItems.length })}
            </div>
        </div>
    </div>
  );
};