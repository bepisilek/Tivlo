import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X } from 'lucide-react';

interface CoinFlipProps {
  onResult: (decision: 'bought' | 'saved') => void;
  onClose: () => void;
}

type CoinSide = 'heads' | 'tails';
type FlipState = 'idle' | 'flipping' | 'result';

export const CoinFlip: React.FC<CoinFlipProps> = ({ onResult, onClose }) => {
  const { t } = useLanguage();
  const [flipState, setFlipState] = useState<FlipState>('idle');
  const [result, setResult] = useState<CoinSide | null>(null);
  const [winking, setWinking] = useState(false);

  const handleFlip = (choice: CoinSide) => {
    setFlipState('flipping');
    
    // Random eredmény
    const random = Math.random() > 0.5 ? 'heads' : 'tails';
    
    // 2 másodperc múlva eredmény
    setTimeout(() => {
      setResult(random);
      setFlipState('result');
      
      // Kacsintás animáció
      setTimeout(() => {
        setWinking(true);
        setTimeout(() => setWinking(false), 500);
      }, 300);
      
      // 2 másodperc múlva bezárás és eredmény
      setTimeout(() => {
        const decision = random === 'heads' ? 'bought' : 'saved';
        onResult(decision);
      }, 2500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* Close button */}
      {flipState === 'idle' && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-20"
        >
          <X size={24} />
        </button>
      )}

      <div className="w-full max-w-sm text-center space-y-8">
        
        {/* Title & Subtitle */}
        {flipState === 'idle' && (
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-2">{t('coinflip_title')}</h2>
            <p className="text-white/70 text-sm">{t('coinflip_subtitle')}</p>
          </div>
        )}

        {/* Coin */}
        <div className="relative flex items-center justify-center h-64">
          <div 
            className={`coin-container ${flipState === 'flipping' ? 'flipping' : ''} ${flipState === 'result' ? 'landed' : ''}`}
            style={{
              transform: flipState === 'flipping' 
                ? 'rotateY(1440deg) translateY(-80px)' 
                : flipState === 'result' && result === 'tails'
                ? 'rotateY(180deg)'
                : 'rotateY(0deg)'
            }}
          >
            {/* Heads (Fej - Megveszem) */}
            <div className="coin-face coin-heads">
              <div className="w-48 h-48 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 rounded-full shadow-2xl flex items-center justify-center border-8 border-amber-600 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                
                {/* Face */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Eyes */}
                  <div className="flex gap-6 mb-3">
                    <div className={`w-4 h-4 bg-amber-800 rounded-full transition-all duration-300 ${winking && result === 'heads' ? 'scale-y-[0.2]' : ''}`}></div>
                    <div className={`w-4 h-4 bg-amber-800 rounded-full transition-all duration-300 ${winking && result === 'heads' ? 'scale-y-[0.2]' : ''}`}></div>
                  </div>
                  
                  {/* Smile */}
                  <div className="w-12 h-6 border-b-4 border-amber-800 rounded-b-full"></div>
                </div>
                
                {/* Text */}
                <div className="absolute bottom-4 text-amber-800 font-black text-xs uppercase tracking-widest">
                  {t('coinflip_heads')}
                </div>
              </div>
            </div>

            {/* Tails (Írás - Megspórolom) */}
            <div className="coin-face coin-tails">
              <div className="w-48 h-48 bg-gradient-to-br from-emerald-300 via-green-400 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center border-8 border-emerald-600 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                
                {/* Face */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Eyes */}
                  <div className="flex gap-6 mb-3">
                    <div className={`w-4 h-4 bg-emerald-800 rounded-full transition-all duration-300 ${winking && result === 'tails' ? 'scale-y-[0.2]' : ''}`}></div>
                    <div className={`w-4 h-4 bg-emerald-800 rounded-full transition-all duration-300 ${winking && result === 'tails' ? 'scale-y-[0.2]' : ''}`}></div>
                  </div>
                  
                  {/* Smile */}
                  <div className="w-12 h-6 border-b-4 border-emerald-800 rounded-b-full"></div>
                </div>
                
                {/* Text */}
                <div className="absolute bottom-4 text-emerald-800 font-black text-xs uppercase tracking-widest">
                  {t('coinflip_tails')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons or Result */}
        {flipState === 'idle' && (
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-sm text-white/60 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-amber-400 font-bold">{t('coinflip_heads')}</span>
                <span>→</span>
                <span>{t('coinflip_heads_means')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400 font-bold">{t('coinflip_tails')}</span>
                <span>→</span>
                <span>{t('coinflip_tails_means')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleFlip('heads')}
                className="py-6 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {t('coinflip_choose_heads')}
              </button>
              <button
                onClick={() => handleFlip('tails')}
                className="py-6 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {t('coinflip_choose_tails')}
              </button>
            </div>
          </div>
        )}

        {flipState === 'flipping' && (
          <div className="text-white/80 text-lg font-medium animate-pulse">
            {t('coinflip_flipping')}
          </div>
        )}

        {flipState === 'result' && result && (
          <div className="animate-fade-in-up space-y-2">
            <div className={`text-4xl font-black ${result === 'heads' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {result === 'heads' ? t('coinflip_result_buy') : t('coinflip_result_save')}
            </div>
            <div className="text-white/60 text-sm">
              {t('coinflip_deciding')}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .coin-container {
          position: relative;
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
          transition: transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .coin-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coin-heads {
          transform: rotateY(0deg);
        }

        .coin-tails {
          transform: rotateY(180deg);
        }

        .flipping {
          animation: shake 0.1s infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .landed {
          animation: bounce 0.5s ease-out;
        }

        @keyframes bounce {
          0% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(5px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
