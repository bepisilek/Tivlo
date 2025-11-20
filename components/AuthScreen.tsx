import React, { useState } from 'react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, AlertCircle, CheckCircle, Check } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (!supabase || !isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      setIsLoading(false);
      return;
    }

    try {
      if (!isLogin && password !== confirmPassword) {
        setError(t('auth_password_mismatch'));
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
            throw new Error(t('auth_invalid_credentials'));
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error(t('auth_email_not_confirmed'));
          }
          throw error;
        }
      } else {
        // REGISTRATION WITH MARKETING OPT-IN
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              marketing_opt_in: marketingOptIn // Metadata a signup-hoz
            }
          }
        });
        
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            throw new Error(t('auth_email_already_exists'));
          }
          throw error;
        }
        
        // Ha sikeres a regisztráció, mentsük el a marketing opt-in-t
        if (data.user) {
          // A profile már létrejött a trigger által, csak frissítjük
          await supabase
            .from('profiles')
            .update({ marketing_opt_in: marketingOptIn })
            .eq('id', data.user.id);
        }
        
        if (data.user && !data.session) {
            setMessage(t('auth_confirmation_sent'));
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setMarketingOptIn(false);
        } else if (data.session) {
          setMessage(t('auth_registration_success'));
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError(t('auth_reset_email_required'));
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    setIsResetting(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?type=recovery`,
      });
      if (error) throw error;
      setMessage(t('auth_reset_email_sent'));
    } catch (err: any) {
      setError(err.message || t('auth_error'));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isLogin ? t('auth_login_title') : t('auth_register_title')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
             {t('app_name')} - {t('welcome_sub')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder={t('auth_email')}
                />
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder={t('auth_password')}
                  minLength={6}
                />
            </div>
            {!isLogin && (
              <>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                      placeholder={t('auth_confirm_password')}
                      minLength={6}
                    />
                </div>
                
                {/* MARKETING OPT-IN CHECKBOX */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        {marketingOptIn && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {t('marketing_opt_in_text')}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {t('marketing_opt_in_subtitle')}
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
             <div className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            {isLogin ? t('auth_login_btn') : t('auth_register_btn')}
          </Button>

          {isLogin && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors disabled:opacity-60"
                disabled={isResetting}
              >
                {t('auth_forgot_password')}
              </button>
            </div>
          )}
        </form>

        <div className="text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setMessage(null);
                setConfirmPassword('');
                setMarketingOptIn(false);
            }}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
            {isLogin ? t('auth_switch_to_register') : t('auth_switch_to_login')}
          </button>
        </div>
      </div>
    </div>
  );
};
