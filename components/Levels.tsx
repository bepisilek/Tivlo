import React, { useMemo } from 'react';
import { HistoryItem } from '../types';
import { Trophy, Flame, Medal, Star, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LevelsProps {
  history: HistoryItem[];
}

export const Levels: React.FC<LevelsProps> = ({ history }) => {
  const { t } = useLanguage();
  
  const stats = useMemo(() => {
    const savedItems = history.filter(h => h.decision === 'saved');
    const totalSavedHours = savedItems.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
    const savedCount = savedItems.length;
    
    // Level calculation: 1 level per 10 hours saved
    const level = Math.floor(totalSavedHours / 10) + 1;
    const progress = (totalSavedHours % 10) / 10; // 0 to 1
    
    // Streak calculation
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDates: number[] = Array.from(new Set(savedItems.map(i => new Date(i.date).setHours(0,0,0,0)))).sort((a: number, b: number) => b - a);
    
    if (uniqueDates.length > 0) {
        const lastDate = uniqueDates[0];
        // If last saved was today or yesterday, streak is alive
        if (lastDate === today || lastDate === today - 86400000) {
            streak = 1;
            let currentDate = lastDate;
            for (let i = 1; i < uniqueDates.length; i++) {
                if (uniqueDates[i] === currentDate - 86400000) {
                    streak++;
                    currentDate = uniqueDates[i];
                } else {
                    break;
                }
            }
        }
    }

    return { level, progress, streak, totalSavedHours, savedCount };
  }, [history]);

  const badges = [
      { id: 'first_save', name: t('badge_first_save_name'), icon: Star, condition: stats.savedCount >= 1, desc: t('badge_first_save_desc') },
      { id: 'five_saves', name: t('badge_five_saves_name'), icon: Target, condition: stats.savedCount >= 5, desc: t('badge_five_saves_desc') },
      { id: 'ten_hours', name: t('badge_ten_hours_name'), icon: Medal, condition: stats.totalSavedHours >= 10, desc: t('badge_ten_hours_desc') },
      { id: 'streak_3', name: t('badge_streak_3_name'), icon: Flame, condition: stats.streak >= 3, desc: t('badge_streak_3_desc') },
      { id: 'hundred_hours', name: t('badge_hundred_hours_name'), icon: Trophy, condition: stats.totalSavedHours >= 100, desc: t('badge_hundred_hours_desc') },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            {/* Header Stats */}
            <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                
                <div className="relative z-10 flex items-center justify-