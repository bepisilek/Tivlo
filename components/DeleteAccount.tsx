import React, { useState } from 'react';
import { AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';

interface DeleteAccountProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({ onSuccess, onCancel }) => {
  const { t } = useLanguage();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    const expectedText = t('delete_account_confirm_text');
    if (confirmText !== expectedText) {
      setError(`Please type exactly: ${expectedText}`);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // 1. Először töröljük az app-szintű adatokat (history, profiles)
      // Ezek automatikusan törlődnek a CASCADE miatt az auth.users törlésekor,
      // de mi explicit töröljük őket a biztonság kedvéért
      
      await supabase.from('history').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // 2. A felhasználó törlését egy delete_requests táblán keresztül kezeljük
      // A tényleges törlést egy Supabase Edge Function vagy SQL trigger végzi
      // service_role kulccsal, ami biztonságos szerveroldali művelet
      // SECURITY: Ne használjunk admin.deleteUser()-t kliens oldalon - az sosem fog működni
      // anon kulccsal és biztonsági kockázatot jelentene ha működne

      await supabase.from('delete_requests').insert({ user_id: user.id });

      // Kijelentkeztetjük a usert
      await supabase.auth.signOut();
      onSuccess();
      
    } catch (err: any) {
      console.error('Delete account error:', err);
      setError(err.message || t('delete_account_error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-2">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('delete_account_title')}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('delete_account_desc')}</p>
        </div>

        {/* Warning Box */}
        <div className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertCircle size={18} />
            <span>{t('delete_account_warning')}</span>
          </div>
          <ul className="space-y-2 text-sm text-rose-800 dark:text-rose-300 ml-6">
            <li className="list-disc">{t('delete_account_list_profile')}</li>
            <li className="list-disc">{t('delete_account_list_history')}</li>
            <li className="list-disc">{t('delete_account_list_stats')}</li>
            <li className="list-disc">{t('delete_account_list_auth')}</li>
          </ul>
        </div>

        {/* Confirmation Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('delete_account_confirm_label')}
          </label>
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center">
            <code className="text-rose-600 dark:text-rose-400 font-bold text-base">
              {t('delete_account_confirm_text')}
            </code>
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="block w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-sm text-center font-mono"
            placeholder={t('delete_account_confirm_text')}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button 
            onClick={handleDelete}
            fullWidth 
            variant="danger" 
            isLoading={isDeleting}
            disabled={confirmText !== t('delete_account_confirm_text')}
          >
            <Trash2 size={18} />
            {t('delete_account_button')}
          </Button>
          
          <Button 
            type="button" 
            fullWidth 
            variant="secondary" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            {t('cancel')}
          </Button>
        </div>

        {/* Extra Info */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2">
          {t('marketing_opt_in_subtitle')}
        </p>
      </div>
    </div>
  );
};
