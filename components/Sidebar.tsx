import React from 'react';
import { X, User, Moon, Sun, LogOut, KeyRound, Trash2 } from 'lucide-react';
import { UserSettings } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenResetPassword: () => void;
  onOpenDeleteAccount: () => void;
  settings: UserSettings;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onOpenProfile, 
  onOpenResetPassword, 
  onOpenDeleteAccount,
  settings, 
  toggleTheme 
}) => {
  const { t } = useLanguage();

  const handleLogout = async () => {
    if (!supabase || !isSupabaseConfigured) {
      alert(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    await supabase.auth.signOut();
    onClose();
    // App.tsx will handle the state change via onAuthStateChange
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel - From Right */}
      <div className={`fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[60] transform transition-transform duration-300 shadow-2xl flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">{t('app_name')}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <div className="mb-6 px-2">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">{t('menu_profile')}</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {settings.monthlyNetSalary > 0 
                    ? `${settings.monthlyNetSalary.toLocaleString()} ${settings.currency}`
                    : '...'}
              </div>
          </div>

          <button
            onClick={() => { onOpenProfile(); onClose(); }}
            className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
          >
            <User size={20} />
            <span className="font-medium">{t('menu_edit_profile')}</span>
          </button>

          <button
            onClick={() => { onOpenResetPassword(); onClose(); }}
            className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
          >
            <KeyRound size={20} />
            <span className="font-medium">{t('menu_reset_password')}</span>
          </button>

          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{settings.theme === 'dark' ? t('light_mode') : t('dark_mode')}</span>
          </button>

          {/* Spacer */}
          <div className="py-2"></div>

          {/* Delete Account - Veszélyes műveletek szekció */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { onOpenDeleteAccount(); onClose(); }}
              className="w-full flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
            >
              <Trash2 size={20} />
              <span className="font-medium text-sm">{t('menu_delete_account')}</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('auth_logout')}</span>
          </button>
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-400">{t('app_name')} v2.0</p>
          </div>
        </div>
      </div>
    </>
  );
};
