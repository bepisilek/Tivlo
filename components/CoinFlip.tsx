import React, { useState, useEffect } from 'react';
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
  const [rotation, setRotation] = useState(0);

  // Reset state when opened
  useEffect(() => {
    if (flipState === 'idle') {
      setRotation(0);
    }
  }, [flipState]);

  const handleFlip = () => {
    setFlipState('flipping');
    
    // Biztonságos véletlen generálás
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    const isHeads = randomValue % 2 === 0;
    const newResult = isHeads ? 'heads' : 'tails';
    
    // Kiszámoljuk a végső forgási szöget
    // Alapvetően sokat pörögjön (min 5 teljes kör = 1800 fok) + a végeredményhez szükséges korrekció
    // Ha heads (fej), akkor 0, 360, 720... (páros * 180)
    // Ha tails (írás), akkor 180, 540... (páratlan * 180)
    
    const baseRotation = 1800 + (Math.floor(Math.random() * 3) * 360); // Véletlenszerű extra pörgés
    const targetRotation = isHeads 
      ? baseRotation // Fej = teljes körre végződik
      : baseRotation + 180; // Írás = félkörre végződik

    // CSS változó beállítása a dinamikus forgáshoz
    document.documentElement.style.setProperty('--target-rotation', `${targetRotation}deg`);

    // Animáció időzítése (összhangban a CSS-sel)
    setTimeout(() => {
      setResult(newResult);
      setFlipState('result');
      setRotation(targetRotation); // Megtartjuk a pozíciót
      
      // Kacsintás animáció a landolás után
      setTimeout(() => {
        setWinking(true);
        setTimeout(() => setWinking(false), 400);
      }, 300);
    }, 2000); // 2 másodperces animáció a drámai hatáshoz
  };

  const handleAcceptSuggestion = () => {
    if (!result) return;
    const suggestion = result === 'heads' ? 'bought' : 'saved';
    onSuggestion(suggestion);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in perspective-container">
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-20 transition-colors hover:rotate-90 duration-300"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md text-center space-y-6 relative z-10">
        
        {/* Title Area */}
        <div className={`transition-all duration-500 ${flipState !== 'idle' ? 'opacity-50 scale-90 blur-[2px]' : 'opacity-100'}`}>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{t('coinflip_title')}</h2>
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest">{t('coinflip_subtitle')}</p>
        </div>

        {/* 3D Scene Container */}
        <div className="scene h-[320px] w-full flex items-center justify-center perspective-1000">
          <div className={`coin-container ${flipState === 'flipping' ? 'animate-toss' : ''} ${flipState === 'result' ? 'animate-land' : ''}`}>
            
            {/* The 3D Coin */}
            <div 
              className="coin preserve-3d"
              style={{ 
                transform: flipState === 'result' 
                  ? `rotateX(${rotation}deg)` 
                  : undefined 
              }}
            >
              {/* 3D LAYER TRICK:
                 Helyett, hogy egyetlen "edge" div-et próbálnánk hajlítani,
                 létrehozunk több réteget (layers), ami tömörséget ad az érmének.
              */}
              
              {/* Side Layers (The Thickness) - Darker Gold */}
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i}
                  className="coin-layer"
                  style={{ transform: `translateZ(${i - 8}px)` }}
                />
              ))}

              {/* FRONT FACE (HEADS) */}
              <div className="coin-face front" style={{ transform: 'translateZ(9px)' }}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 border-[6px] border-yellow-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                  {/* Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70 pointer-events-none"></div>
                  
                  <div className="flex flex-col items-center transform scale-90">
                    {/* Simple Face Icon */}
                    <div className="flex gap-6 mb-3">
                        <div className={`w-4 h-4 bg-yellow-900 rounded-full transition-all ${winking && result === 'heads' ? 'scale-y-10' : ''}`}></div>
                        <div className={`w-4 h-4 bg-yellow-900 rounded-full transition-all ${winking && result === 'heads' ? 'scale-y-10' : ''}`}></div>
                    </div>
                    <div className="w-12 h-6 border-b-4 border-yellow-900 rounded-full"></div>
                    <span className="mt-4 text-yellow-900 font-black text-xs tracking-[0.3em] uppercase">{t('coinflip_heads')}</span>
                  </div>
                </div>
              </div>

              {/* BACK FACE (TAILS) */}
              <div className="coin-face back" style={{ transform: 'translateZ(-9px) rotateY(180deg)' }}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300 via-green-500 to-emerald-700 border-[6px] border-emerald-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                  {/* Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70 pointer-events-none"></div>
                  
                  <div className="flex flex-col items-center transform scale-90">
                     {/* Simple Face Icon */}
                     <div className="flex gap-6 mb-3">
                        <div className={`w-4 h-4 bg-emerald-900 rounded-full transition-all ${winking && result === 'tails' ? 'scale-y-10' : ''}`}></div>
                        <div className={`w-4 h-4 bg-emerald-900 rounded-full transition-all ${winking && result === 'tails' ? 'scale-y-10' : ''}`}></div>
                    </div>
                    <div className="w-12 h-6 border-b-4 border-emerald-900 rounded-full"></div>
                    <span className="mt-4 text-emerald-900 font-black text-xs tracking-[0.3em] uppercase">{t('coinflip_tails')}</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Shadow on the "ground" */}
            <div className={`shadow-element ${flipState === 'flipping' ? 'animate-shadow-scale' : ''}`}></div>
          </div>
        </div>

        {/* Controls & Result */}
        <div className="min-h-[140px] flex flex-col items-center justify-end pb-4">
            {flipState === 'idle' && (
            <button
                onClick={handleFlip}
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-xl rounded-full shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-2">
                 {t('coinflip_flip_it')} 
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            )}

            {flipState === 'flipping' && (
                <div className="text-white/50 text-sm font-mono animate-pulse">
                    {t('coinflip_flipping')}...
                </div>
            )}

            {flipState === 'result' && result && (
            <div className="w-full space-y-4 animate-fade-in-up">
                <div className={`text-4xl font-black uppercase tracking-tight ${result === 'heads' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result === 'heads' ? t('coinflip_result_buy') : t('coinflip_result_save')}
                </div>
                
                <div className="flex gap-3 pt-2">
                <button
                    onClick={handleAcceptSuggestion}
                    className={`flex-1 py-3.5 font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 ${
                        result === 'heads' 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110'
                    }`}
                >
                    {t('coinflip_follow_suggestion')}
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3.5 font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                    {t('coinflip_ignore')}
                </button>
                </div>
            </div>
            )}
        </div>

      </div>

      <style>{`
        .perspective-container {
            perspective: 1200px;
        }
        
        .scene {
            transform-style: preserve-3d;
        }

        .coin-container {
            position: relative;
            width: 200px;
            height: 200px;
            transform-style: preserve-3d;
        }

        .coin {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            /* Start position */
            transform: rotateX(0deg); 
        }

        /* Az érme vastagsága (Layer stack technika) */
        .coin-layer {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background-color: #b45309; /* Sötét arany az élhez */
            border: 1px solid #92400e;
            backface-visibility: visible; /* Fontos, hogy minden szögből látszódjon */
        }
        
        /* Az érme lapjai */
        .coin-face {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            backface-visibility: hidden; /* Csak az egyik oldal látszik egyszerre */
            /* Enyhe élsimítás */
            -webkit-font-smoothing: antialiased; 
        }

        /* Árnyék a földön */
        .shadow-element {
            position: absolute;
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%) rotateX(90deg);
            width: 120px;
            height: 120px;
            background: radial-gradient(rgba(0,0,0,0.6), transparent 70%);
            border-radius: 50%;
            opacity: 1;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        /* --- ANIMÁCIÓK --- */

        /* A FŐ DOBÁS */
        .animate-toss .coin {
            animation: tossCoin 2s cubic-bezier(0.2, 0, 0.3, 1) forwards;
        }

        @keyframes tossCoin {
            0% {
                /* Lent kezd, kicsit döntve */
                transform: translateY(0) rotateX(0) scale(1);
                filter: brightness(1);
            }
            40% {
                /* A levegőben: magasra megy, közelebb jön (scale), nagyon gyorsan pörög */
                transform: translateY(-350px) rotateX(900deg) scale(1.4);
                filter: brightness(1.3); /* Megcsillan a fényben */
            }
            100% {
                /* Landolás: visszatér az eredeti Y helyre, és beáll a végső szögre */
                transform: translateY(0) rotateX(var(--target-rotation)) scale(1);
                filter: brightness(1);
            }
        }

        /* ÁRNYÉK MOZGÁSA */
        .animate-shadow-scale {
            animation: shadowBreathe 2s cubic-bezier(0.2, 0, 0.3, 1) forwards;
        }

        @keyframes shadowBreathe {
            0% { opacity: 0.8; transform: translateX(-50%) rotateX(90deg) scale(1); }
            40% { opacity: 0.3; transform: translateX(-50%) rotateX(90deg) scale(0.5); } /* Ha magasan van, kicsi az árnyék */
            100% { opacity: 0.8; transform: translateX(-50%) rotateX(90deg) scale(1); }
        }

        /* LANDOLÁS UTÁNI RUGÓZÁS */
        .animate-land .coin {
             /* Egy pici rugózás a végén, hogy ne legyen "beton" hatású */
             animation: landBounce 0.4s ease-out;
        }

        @keyframes landBounce {
            0% { transform: translateY(0) rotateX(var(--target-rotation)) scale(1); }
            50% { transform: translateY(10px) rotateX(var(--target-rotation)) scale(0.95); }
            100% { transform: translateY(0) rotateX(var(--target-rotation)) scale(1); }
        }

      `}</style>
    </div>
  );
};
