import React, { useMemo } from 'react';
import { HistoryItem } from '../types';
import { Trophy, Flame, Medal, Star, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LevelsProps {
  history: HistoryItem[];
}

interface BadgeConfig {
  id: string;
  name: string;
  icon: typeof Trophy;
  condition: boolean;
  desc: string;
}

export const Levels: React.FC<LevelsProps> = ({ history }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const savedItems = history.filter((h) => h.decision === 'saved');
    const totalSavedHours = savedItems.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
    const savedCount = savedItems.length;

    const level = Math.floor(totalSavedHours / 10) + 1;
    const progress = (totalSavedHours % 10) / 10;

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDates: number[] = Array.from(
      new Set(savedItems.map((i) => new Date(i.date).setHours(0, 0, 0, 0)))
    ).sort((a: number, b: number) => b - a);

    if (uniqueDates.length > 0) {
      const lastDate = uniqueDates[0];
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

  const hoursThisLevel = stats.totalSavedHours % 10;
  const hoursToNextLevel = Math.max(10 - hoursThisLevel, 0);
  const progressPercent = Math.round(stats.progress * 100);

  const badges: BadgeConfig[] = [
    { id: 'first_save', name: t('badge_first_save_name'), icon: Star, condition: stats.savedCount >= 1, desc: t('badge_first_save_desc') },
    { id: 'five_saves', name: t('badge_five_saves_name'), icon: Target, condition: stats.savedCount >= 5, desc: t('badge_five_saves_desc') },
    { id: 'ten_hours', name: t('badge_ten_hours_name'), icon: Medal, condition: stats.totalSavedHours >= 10, desc: t('badge_ten_hours_desc') },
    { id: 'streak_3', name: t('badge_streak_3_name'), icon: Flame, condition: stats.streak >= 3, desc: t('badge_streak_3_desc') },
    { id: 'hundred_hours', name: t('badge_hundred_hours_name'), icon: Trophy, condition: stats.totalSavedHours >= 100, desc: t('badge_hundred_hours_desc') },
  ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <section className="p-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="uppercase tracking-widest text-xs text-white/70">{t('level_label')}</p>
              <div className="text-5xl lg:text-6xl font-black">#{stats.level}</div>
              <p className="text-white/80 mt-2">{t('conscious_buyer')}</p>
            </div>

            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center justify-between text-sm mb-2 text-white/80">
                <span>{hoursThisLevel.toFixed(1)} / 10h</span>
                <span>{hoursToNextLevel.toFixed(1)}h</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-wide text-white/70">
                {progressPercent}% · {t('stats_saved_time')}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 p-6 md:grid-cols-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('stats_saved_time')}</p>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.totalSavedHours.toFixed(1)}h
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('save_btn')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('count_label')}</p>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {stats.savedCount}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('nav_history')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('streak_label')}</p>
            <div className="text-3xl font-bold text-amber-500 dark:text-amber-300 mt-1">
              {stats.streak} {t('streak_days')}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('conscious_buyer')}</p>
          </div>
        </section>

        <section className="px-6 pb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('badges_title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    badge.condition
                      ? 'border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        badge.condition
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{badge.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{badge.desc}</p>
                    </div>
                  </div>
                  <p className={`mt-3 text-sm font-medium ${badge.condition ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {badge.condition ? t('badge_status_unlocked') : t('badge_status_locked')}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
