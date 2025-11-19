import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

interface MarketingConsentProps {
  userId: string;
  currentConsent: boolean;
  onUpdate: (newConsent: boolean) => void;
}

export const MarketingConsent: React.FC<MarketingConsentProps> = ({
  userId,
  currentConsent,
  onUpdate
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggleConsent = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const newConsent = !currentConsent;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          marketing_opt_in: newConsent,
          updated_at: new Date()
        })
        .eq('id', userId);

      if (error) throw error;

      onUpdate(newConsent);
      setMessage(t('marketing_consent_updated'));
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating marketing consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          currentConsent 
            ? 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
        }`}>
          <Mail size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            {t('marketing_settings_title')}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            {currentConsent ? (
              <>
                <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {t('marketing_status_opted_in')}
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {t('marketing_status_opted_out')}
                </span>
              </>
            )}
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {currentConsent 
              ? t('marketing_opt_in_subtitle')
              : 'Feliratkozhatsz a hírlevelekre és speciális ajánlatokra.'
            }
          </p>

          {message && (
            <div className="mb-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
              {message}
            </div>
          )}
          
          <Button
            onClick={handleToggleConsent}
            isLoading={isLoading}
            variant={currentConsent ? 'secondary' : 'primary'}
            size="sm"
          >
            {currentConsent ? t('marketing_unsubscribe') : t('marketing_subscribe')}
          </Button>
        </div>
      </div>
    </div>
  );
};
