import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X } from 'lucide-react';

interface CoinFlipProps {
  onSuggestion: (suggestion: 'bought' | 'saved') => void;
  onClose: () => void;
}

type FlipState = 'idle' | 'flipping' | 'result';

export const CoinFlip: React.FC<CoinFlipProps> = ({ onSuggestion, onClose }) => {
  const { t } = useLanguage();
  const [flipState, setFlipState] = useState<FlipState>('idle');
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [winking, setWinking] = useState(false);

  const handleFlip = () => {
    setFlipState('flipping');
    
    // Tényleg random eredmény - crypto.getRandomValues használata a biztonságos véletlenhez
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    const random = randomValue % 2 === 0 ? 'heads' : 'tails';
    
    // 1.6 másodperc múlva eredmény (gyorsabb, dinamikusabb animáció)
    setTimeout(() => {
      setResult(random);
      setFlipState('result');
      
      // Kacsintás animáció
      setTimeout(() => {
        setWinking(true);
        setTimeout(() => setWinking(false), 400);
      }, 200);
    }, 1600);
  };

  const handleAcceptSuggestion = () => {
    if (!result) return;
    const suggestion = result === 'heads' ? 'bought' : 'saved';
    onSuggestion(suggestion);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-20 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-sm text-center space-y-8">
        
        {/* Title */}
        {flipState === 'idle' && (
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-black text-white mb-3">{t('coinflip_title')}</h2>
            <p className="text-white/70 text-base">{t('coinflip_subtitle')}</p>
          </div>
        )}

        {/* Coin Container */}
        <div className="relative flex items-center justify-center" style={{ height: '350px' }}>
          <div 
            className={`coin-wrapper ${flipState === 'flipping' ? 'flipping' : ''} ${flipState === 'result' ? 'landed' : ''}`}
          >
            <div 
              className="coin"
              style={{
                transform: flipState === 'result' && result === 'tails' ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Heads (Fej - Megveszem) */}
              <div className="coin-face coin-heads">
                <div className="w-52 h-52 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 rounded-full shadow-2xl flex items-center justify-center border-8 border-amber-600 relative overflow-hidden">
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/20"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
                  
                  {/* Face */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Eyes */}
                    <div className="flex gap-8 mb-4">
                      <div className={`w-5 h-5 bg-amber-900 rounded-full transition-all duration-300 ${winking && result === 'heads' ? 'scale-y-[0.15] -translate-y-1' : ''}`}></div>
                      <div className={`w-5 h-5 bg-amber-900 rounded-full transition-all duration-300 ${winking && result === 'heads' ? 'scale-y-[0.15] -translate-y-1' : ''}`}></div>
                    </div>
                    
                    {/* Smile */}
                    <div className="w-16 h-8 border-b-[5px] border-amber-900 rounded-b-full"></div>
                  </div>
                  
                  {/* Text */}
                  <div className="absolute bottom-6 text-amber-900 font-black text-sm uppercase tracking-[0.3em]">
                    {t('coinflip_heads')}
                  </div>
                </div>
              </div>

              {/* Tails (Írás - Megspórolom) */}
              <div className="coin-face coin-tails">
                <div className="w-52 h-52 bg-gradient-to-br from-emerald-300 via-green-400 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center border-8 border-emerald-600 relative overflow-hidden">
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/20"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
                  
                  {/* Face */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Eyes */}
                    <div className="flex gap-8 mb-4">
                      <div className={`w-5 h-5 bg-emerald-900 rounded-full transition-all duration-300 ${winking && result === 'tails' ? 'scale-y-[0.15] -translate-y-1' : ''}`}></div>
                      <div className={`w-5 h-5 bg-emerald-900 rounded-full transition-all duration-300 ${winking && result === 'tails' ? 'scale-y-[0.15] -translate-y-1' : ''}`}></div>
                    </div>
                    
                    {/* Smile */}
                    <div className="w-16 h-8 border-b-[5px] border-emerald-900 rounded-b-full"></div>
                  </div>
                  
                  {/* Text */}
                  <div className="absolute bottom-6 text-emerald-900 font-black text-sm uppercase tracking-[0.3em]">
                    {t('coinflip_tails')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        {flipState === 'idle' && (
          <div className="text-sm text-white/60 space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-amber-400 font-bold text-base">{t('coinflip_heads')}</span>
              <span className="text-white/40">→</span>
              <span className="text-white/80">{t('coinflip_heads_means')}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-emerald-400 font-bold text-base">{t('coinflip_tails')}</span>
              <span className="text-white/40">→</span>
              <span className="text-white/80">{t('coinflip_tails_means')}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {flipState === 'idle' && (
          <button
            onClick={handleFlip}
            className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xl rounded-2xl shadow-2xl transition-all active:scale-95 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('coinflip_flip_it')}
          </button>
        )}

        {flipState === 'flipping' && (
          <div className="text-white/80 text-lg font-medium animate-pulse">
            {t('coinflip_flipping')}
          </div>
        )}

        {flipState === 'result' && result && (
          <div className="animate-fade-in-up space-y-4">
            <div className="space-y-2">
              <div className="text-white/60 text-sm uppercase tracking-wider">
                {t('coinflip_suggests')}
              </div>
              <div className={`text-5xl font-black ${result === 'heads' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result === 'heads' ? t('coinflip_result_buy') : t('coinflip_result_save')}
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAcceptSuggestion}
                className={`w-full py-4 ${result === 'heads' ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'} text-white font-bold text-lg rounded-xl shadow-xl transition-all active:scale-95`}
              >
                {t('coinflip_follow_suggestion')}
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-medium text-base rounded-xl transition-all active:scale-95"
              >
                {t('coinflip_ignore')}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .coin-wrapper {
          perspective: 1500px;
          position: relative;
        }

        .coin {
          position: relative;
          width: 210px;
          height: 210px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 24px 35px rgba(0, 0, 0, 0.45));
        }

        .coin::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: conic-gradient(from 90deg, #b45309, #f59e0b, #fbbf24, #b45309, #f59e0b);
          transform: translateZ(-8px);
          box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.35);
        }

        .coin::after {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%, rgba(0, 0, 0, 0.2));
          transform: translateZ(2px);
        }

        /* Javított feldobás animáció - sokkal simább */
        .flipping .coin {
          animation: coinFlip 1.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        @keyframes coinFlip {
          0% {
            transform: translateY(0) translateZ(0) rotateY(0deg) rotateX(0deg);
          }
          15% {
            transform: translateY(-200px) translateZ(50px) rotateY(540deg) rotateX(180deg) scale(1.15);
          }
          30% {
            transform: translateY(-280px) translateZ(80px) rotateY(1080deg) rotateX(360deg) scale(1.2);
          }
          45% {
            transform: translateY(-300px) translateZ(90px) rotateY(1620deg) rotateX(540deg) scale(1.25);
          }
          60% {
            transform: translateY(-280px) translateZ(80px) rotateY(2160deg) rotateX(720deg) scale(1.2);
          }
          75% {
            transform: translateY(-200px) translateZ(50px) rotateY(2700deg) rotateX(900deg) scale(1.15);
          }
          90% {
            transform: translateY(-80px) translateZ(20px) rotateY(3240deg) rotateX(1080deg) scale(1.08);
          }
          100% {
            transform: translateY(0) translateZ(0) rotateY(3600deg) rotateX(1200deg) scale(1);
          }
        }

        /* Javított landolás animáció - simább pattogás */
        .landed .coin {
          animation: coinBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes coinBounce {
          0% {
            transform: translateY(-40px) translateZ(10px) scale(1.15);
          }
          25% {
            transform: translateY(0) translateZ(0) scale(0.95);
          }
          40% {
            transform: translateY(-15px) translateZ(5px) scale(1.05);
          }
          60% {
            transform: translateY(0) translateZ(0) scale(0.98);
          }
          75% {
            transform: translateY(-5px) translateZ(2px) scale(1.02);
          }
          90% {
            transform: translateY(0) translateZ(0) scale(0.99);
          }
          100% {
            transform: translateY(0) translateZ(0) scale(1);
          }
        }

        .coin-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateZ(10px);
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.35), 0 0 18px rgba(0, 0, 0, 0.18);
        }

        .coin-heads {
          transform: rotateY(0deg) translateZ(10px);
        }

        .coin-tails {
          transform: rotateY(180deg) translateZ(10px);
        }
      `}</style>
    </div>
  );
};
