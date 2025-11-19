import React from 'react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { AlarmClock } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-slate-950 text-white relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-b from-blue-600/20 to-transparent rounded-[50%] animate-wave blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[40%] bg-gradient-to-t from-rose-600/20 to-transparent rounded-[50%] animate-wave blur-3xl" style={{ animationDelay: '-5s' }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 z-10">
        
        {/* 3D Floating Clock */}
        <div className="relative mb-12 animate-float">
          {/* Back glow */}
          <div className="absolute inset-0 bg-rose-500/40 blur-2xl rounded-full transform scale-110"></div>
          
          {/* Clock Body */}
          <div className="relative w-48 h-48 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(225,29,72,0.5),inset_0_2px_10px_rgba(255,255,255,0.3)] border-4 border-rose-400/20">
             {/* Clock Face */}
             <div className="w-40 h-40 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
                <AlarmClock size={80} className="text-rose-500 dark:text-rose-400" strokeWidth={1.5} />
                
                {/* Fake 3D depth elements */}
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/10 to-black/20 pointer-events-none"></div>
             </div>
             
             {/* Bells */}
             <div className="absolute -top-4 -left-2 w-12 h-12 bg-rose-600 rounded-full -z-10"></div>
             <div className="absolute -top-4 -right-2 w-12 h-12 bg-rose-600 rounded-full -z-10"></div>
             
             {/* Legs */}
             <div className="absolute -bottom-2 left-4 w-4 h-8 bg-rose-800 rounded-full -z-10 rotate-[30deg]"></div>
             <div className="absolute -bottom-2 right-4 w-4 h-8 bg-rose-800 rounded-full -z-10 rotate-[-30deg]"></div>
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 text-center drop-shadow-sm">
          {t('app_name')}
        </h1>
        
        <p className="text-xl font-bold text-center text-slate-200 mb-2">
            {t('welcome_slogan')}
        </p>
        <p className="text-sm text-center text-slate-400 max-w-xs leading-relaxed">
            {t('welcome_sub')}
        </p>
      </div>

      <div className="w-full p-8 z-10">
        <Button 
            onClick={onStart} 
            fullWidth 
            size="lg" 
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/25 border-none"
        >
          {t('lets_start')}
        </Button>
      </div>
    </div>
  );
};