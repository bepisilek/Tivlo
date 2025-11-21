import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface FallingClock {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
  size: number;
  rotation: number;
}

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [clocks, setClocks] = useState<FallingClock[]>([]);

  useEffect(() => {
    // Generáljunk 15 random órát
    const generatedClocks: FallingClock[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100%
      animationDelay: Math.random() * 2, // 0-2s késleltetés
      animationDuration: 3 + Math.random() * 2, // 3-5s időtartam
      size: 20 + Math.random() * 20, // 20-40px méret
      rotation: Math.random() * 360 // random forgatás
    }));
    setClocks(generatedClocks);

    // 2.5 másodperc múlva továbblépünk
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 flex items-center justify-center overflow-hidden">
      
      {/* Eső órák */}
      {clocks.map((clock) => (
        <div
          key={clock.id}
          className="absolute animate-fall opacity-60"
          style={{
            left: `${clock.left}%`,
            animationDelay: `${clock.animationDelay}s`,
            animationDuration: `${clock.animationDuration}s`,
            top: '-50px'
          }}
        >
          <Clock 
            size={clock.size} 
            className="text-white/30"
            style={{ 
              transform: `rotate(${clock.rotation}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
          />
        </div>
      ))}

      {/* Központi logó és szöveg */}
      <div className="relative z-10 text-center animate-fade-in-scale">
        <div className="mb-6 relative">
          {/* Háttér glow */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150"></div>
          
          {/* Főóra */}
          <div className="relative w-32 h-32 mx-auto bg-white/90 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50">
            <Clock size={64} className="text-rose-600" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
          Tivlo
        </h1>
        <p className="text-white/90 text-lg font-medium tracking-wide">
          Ne pazarold az életed
        </p>

        {/* Loading indikátor */}
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
