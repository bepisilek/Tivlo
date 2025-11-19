import React, { useState, useMemo } from 'react';
import { UserSettings, CalculationResult, HistoryItem } from '../types';
import { Button } from './Button';
import { ShoppingBag, Play, Check, X, Sparkles, Briefcase, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAdviceMessage } from '../utils/adviceMessages';

interface CalculatorProps {
  settings: UserSettings;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

interface FeedbackModalState {
    isOpen: boolean;
    type: 'bought' | 'saved';
    data: CalculationResult;
    message: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ settings, onSaveHistory }) => {
  const { t, language } = useLanguage();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState | null>(null);

  // Hourly Rate Calculation
  const hourlyRate = useMemo(() => {
    return settings.monthlyNetSalary / (settings.weeklyHours * 4.33);
  }, [settings]);

  const handleCalculate = () => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const totalHoursDecimal = priceNum / hourlyRate;
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);

    setResult({ hours, minutes, totalHoursDecimal, priceNum });
  };

  const handleDecision = (decision: 'bought' | 'saved') => {
    if (!result) return;

    const advice = getAdviceMessage(decision, language);

    onSaveHistory({
        productName: productName || t('item_unnamed'),
        price: result.priceNum,
        currency: settings.currency,
        totalHoursDecimal: result.totalHoursDecimal,
        decision: decision,
        adviceUsed: advice
    });

    // Show Feedback Modal
    setFeedbackModal({
        isOpen: true,
        type: decision,
        data: result,
        message: advice
    });
  };

  const handleCloseFeedback = () => {
      setFeedbackModal(null);
      setResult(null);
      setProductName('');
      setPrice('');
  };

  // Dynamic text color based on severity
  const getSeverityColor = (totalHours: number) => {
    if (totalHours < 1) return "text-emerald-600 dark:text-emerald-400";
    if (totalHours < 8) return "text-yellow-500 dark:text-yellow-400";
    if (totalHours < 40) return "text-orange-500 dark:text-orange-400";
    return "text-rose-500 dark:text-rose-500";
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Feedback Modal */}
      {feedbackModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-sm text-center space-y-6">
                  {feedbackModal.type === 'saved' ? (
                      <>
                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto animate-bounce-small">
                            <Sparkles size={48} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('feedback_saved_title')}</h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                {t('feedback_saved_desc')} <span className="font-bold text-emerald-600 dark:text-emerald-400">{feedbackModal.data.priceNum.toLocaleString()} {settings.currency}</span>!
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <p className="text-emerald-800 dark:text-emerald-200 font-medium italic">"{feedbackModal.message}"</p>
                        </div>
                      </>
                  ) : (
                      <>
                         <div className="w-24 h-24 bg-rose-100 dark:bg-rose-600/20 rounded-full flex items-center justify-center mx-auto">
                            <Briefcase size={48} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('feedback_bought_title')}</h2>
                            <div className="text-4xl font-black text-rose-600 dark:text-rose-400 my-4">
                                {feedbackModal.data.hours} {t('hour_short')}
                                {feedbackModal.data.minutes > 0 && <span className="text-2xl ml-2">{feedbackModal.data.minutes} {t('min_short')}</span>}
                            </div>
                        </div>
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800">
                             <p className="text-rose-800 dark:text-rose-200 font-medium italic">"{feedbackModal.message}"</p>
                        </div>
                      </>
                  )}
                  
                  <Button onClick={handleCloseFeedback} fullWidth>
                      {t('thanks_btn')}
                  </Button>
              </div>
          </div>
      )}

      {/* Sub-header info */}
      <div className="px-6 py-2 text-center border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
         <p className="text-sm text-slate-500">{t('hourly_rate')}: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{hourlyRate.toFixed(0)} {settings.currency}</span></p>
      </div>

      <main className="flex-1 px-6 overflow-y-auto no-scrollbar pt-6 pb-24 max-w-md mx-auto w-full">
        
        {/* Input Section - Hidden if Result is shown to focus on decision */}
        <div className={`space-y-4 transition-all duration-500 ${result ? 'hidden' : 'opacity-100'}`}>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('what_to_buy')}</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={t('placeholder_item')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('price_label')} ({settings.currency})</label>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-3xl font-bold text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ShoppingBag size={24} />
                    </div>
                </div>
            </div>
            
            <Button onClick={handleCalculate} fullWidth size="lg" disabled={!price} className="mt-4">
                <Play size={18} /> {t('calculate_btn')}
            </Button>
        </div>

        {/* Result Display */}
        {result && !feedbackModal && (
          <div className="flex flex-col h-full animate-fade-in-up">
            <div className="text-center mb-6 pt-4">
              <p className="text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-xs font-bold">{t('cost_in_life')}</p>
              <div className={`text-7xl font-black leading-none tracking-tighter ${getSeverityColor(result.totalHoursDecimal)}`}>
                {result.hours}<span className="text-2xl font-medium text-slate-400 ml-1">{t('hour_short')}</span>
              </div>
              {result.minutes > 0 && (
                <div className={`text-4xl font-bold mt-2 ${getSeverityColor(result.totalHoursDecimal)} opacity-80`}>
                  {result.minutes}<span className="text-lg font-medium text-slate-400 ml-1">{t('min_short')}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-auto">
                <button 
                    onClick={() => handleDecision('bought')}
                    className="flex flex-col items-center justify-center p-6 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border-2 border-rose-200 dark:border-rose-500/50 rounded-2xl text-rose-700 dark:text-rose-300 transition-all active:scale-95"
                >
                    <X size={36} className="mb-2" />
                    <span className="font-bold text-lg">{t('buy_btn')}</span>
                    <span className="text-xs opacity-70 mt-1">(-{result.hours}h {t('buy_sub')})</span>
                </button>
                
                <button 
                    onClick={() => handleDecision('saved')}
                    className="flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border-2 border-emerald-200 dark:border-emerald-500/50 rounded-2xl text-emerald-700 dark:text-emerald-300 transition-all active:scale-95"
                >
                    <Check size={36} className="mb-2" />
                    <span className="font-bold text-lg">{t('save_btn')}</span>
                    <span className="text-xs opacity-70 mt-1">(+{result.priceNum} {settings.currency})</span>
                </button>
            </div>

            <div className="mt-8 text-center">
                <button onClick={() => setResult(null)} className="text-slate-400 text-sm underline hover:text-slate-200 transition-colors">{t('new_calculation')}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};