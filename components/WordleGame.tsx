import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Delete, CornerDownLeft, Share2 } from 'lucide-react';
import { Button } from './Button';

interface WordleGameProps {
  onBack: () => void;
}

// English keyboard layout (used for all languages)
const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK']
];

// Get daily word based on day of year (deterministic)
const getDailyWordIndex = (wordListLength: number): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % wordListLength;
};

// Get today's date string for localStorage key
const getTodayKey = (): string => {
  const today = new Date();
  return `wordle_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
};

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost' | 'already_played';
  letterStatuses: Record<string, LetterStatus>;
}

interface SavedGameState {
  guesses: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
}

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export const WordleGame: React.FC<WordleGameProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const [wordList, setWordList] = useState<string[]>([]);
  const [wordSet, setWordSet] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [invalidWord, setInvalidWord] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    letterStatuses: {}
  });

  const [shakeRow, setShakeRow] = useState(false);
  const [revealRow, setRevealRow] = useState<number | null>(null);

  // Load word list on mount
  useEffect(() => {
    const loadWordList = async () => {
      try {
        const response = await fetch('/wordsenlist.json');
        const words: string[] = await response.json();
        const lowercaseWords = words.map(w => w.toLowerCase());
        setWordList(lowercaseWords);
        setWordSet(new Set(lowercaseWords));

        // Get daily word
        const dailyIndex = getDailyWordIndex(lowercaseWords.length);
        const dailyWord = lowercaseWords[dailyIndex];

        // Check if already played today
        const todayKey = getTodayKey();
        const savedState = localStorage.getItem(todayKey);

        if (savedState) {
          const parsed: SavedGameState = JSON.parse(savedState);
          if (parsed.gameStatus === 'won' || parsed.gameStatus === 'lost') {
            setGameState({
              targetWord: dailyWord,
              guesses: parsed.guesses,
              currentGuess: '',
              gameStatus: 'already_played',
              letterStatuses: parsed.letterStatuses
            });
          } else {
            setGameState({
              targetWord: dailyWord,
              guesses: parsed.guesses,
              currentGuess: '',
              gameStatus: 'playing',
              letterStatuses: parsed.letterStatuses
            });
          }
        } else {
          setGameState({
            targetWord: dailyWord,
            guesses: [],
            currentGuess: '',
            gameStatus: 'playing',
            letterStatuses: {}
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load word list:', error);
        setIsLoading(false);
      }
    };

    loadWordList();
  }, []);

  // Save game state when it changes
  useEffect(() => {
    if (!isLoading && gameState.targetWord) {
      const todayKey = getTodayKey();
      const stateToSave: SavedGameState = {
        guesses: gameState.guesses,
        gameStatus: gameState.gameStatus === 'already_played'
          ? (gameState.guesses[gameState.guesses.length - 1] === gameState.targetWord ? 'won' : 'lost')
          : gameState.gameStatus as 'playing' | 'won' | 'lost',
        letterStatuses: gameState.letterStatuses
      };
      localStorage.setItem(todayKey, JSON.stringify(stateToSave));
    }
  }, [gameState, isLoading]);

  const getLetterStatus = (letter: string, index: number, word: string, target: string): LetterStatus => {
    if (target[index] === letter) return 'correct';
    if (target.includes(letter)) {
      // Count occurrences in target and correct positions
      const targetCount = target.split('').filter(l => l === letter).length;
      const correctCount = word.split('').filter((l, i) => l === letter && target[i] === letter).length;
      const presentCount = word.slice(0, index).split('').filter((l, i) => l === letter && target[i] !== letter).length;

      if (presentCount + correctCount < targetCount) return 'present';
    }
    return 'absent';
  };

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== WORD_LENGTH) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const guess = gameState.currentGuess.toLowerCase();

    // Validate that the word is in the list
    if (!wordSet.has(guess)) {
      setShakeRow(true);
      setInvalidWord(true);
      setTimeout(() => {
        setShakeRow(false);
        setInvalidWord(false);
      }, 1500);
      return;
    }

    const newGuesses = [...gameState.guesses, guess];
    const newLetterStatuses = { ...gameState.letterStatuses };

    // Update letter statuses
    guess.split('').forEach((letter, index) => {
      const status = getLetterStatus(letter, index, guess, gameState.targetWord);
      const currentStatus = newLetterStatuses[letter];

      // Only upgrade status (correct > present > absent)
      if (!currentStatus ||
          (currentStatus === 'absent' && status !== 'absent') ||
          (currentStatus === 'present' && status === 'correct')) {
        newLetterStatuses[letter] = status;
      }
    });

    const won = guess === gameState.targetWord;
    const lost = !won && newGuesses.length >= MAX_GUESSES;

    setRevealRow(newGuesses.length - 1);

    setTimeout(() => {
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        letterStatuses: newLetterStatuses
      });
      setRevealRow(null);
    }, WORD_LENGTH * 300);
  }, [gameState, wordSet]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));
    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase()
      }));
    }
  }, [gameState, submitGuess]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACK');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-green-500 border-green-500 text-white';
      case 'present': return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent': return 'bg-slate-500 dark:bg-slate-600 border-slate-500 dark:border-slate-600 text-white';
      default: return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white';
    }
  };

  const getKeyboardKeyColor = (key: string) => {
    const status = gameState.letterStatuses[key.toLowerCase()];
    switch (status) {
      case 'correct': return 'bg-green-500 text-white border-green-500';
      case 'present': return 'bg-yellow-500 text-white border-yellow-500';
      case 'absent': return 'bg-slate-500 dark:bg-slate-600 text-white border-slate-500';
      default: return 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600';
    }
  };

  const shareResult = () => {
    const emojiGrid = gameState.guesses.map(guess =>
      guess.split('').map((letter, index) => {
        const status = getLetterStatus(letter, index, guess, gameState.targetWord);
        return status === 'correct' ? '🟩' : status === 'present' ? '🟨' : '⬛';
      }).join('')
    ).join('\n');

    const text = `Tivlo Wordle ${gameState.guesses.length}/${MAX_GUESSES}\n\n${emojiGrid}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const renderGrid = () => {
    const rows = [];

    for (let i = 0; i < MAX_GUESSES; i++) {
      const guess = gameState.guesses[i];
      const isCurrentRow = i === gameState.guesses.length && gameState.gameStatus === 'playing';
      const isRevealing = revealRow === i;

      rows.push(
        <div
          key={i}
          className={`flex gap-1.5 justify-center ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
        >
          {Array(WORD_LENGTH).fill(null).map((_, j) => {
            let letter = '';
            let status: LetterStatus = 'empty';

            if (guess) {
              letter = guess[j];
              status = getLetterStatus(letter, j, guess, gameState.targetWord);
            } else if (isCurrentRow) {
              letter = gameState.currentGuess[j] || '';
            }

            return (
              <div
                key={j}
                className={`
                  w-12 h-12 md:w-14 md:h-14 flex items-center justify-center
                  text-xl md:text-2xl font-bold uppercase border-2 rounded-lg
                  transition-all duration-300
                  ${getStatusColor(guess ? status : 'empty')}
                  ${isCurrentRow && letter ? 'scale-105 border-slate-500' : ''}
                  ${isRevealing ? 'animate-flip' : ''}
                `}
                style={isRevealing ? { animationDelay: `${j * 300}ms` } : {}}
              >
                {letter}
              </div>
            );
          })}
        </div>
      );
    }

    return rows;
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col w-full bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('wordle_title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('wordle_subtitle')}</p>
        </div>
      </div>

      {/* Invalid word notification */}
      {invalidWord && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {t('wordle_invalid_word')}
        </div>
      )}

      {/* Game Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-1.5">
        {renderGrid()}
      </div>

      {/* Game Over Modal */}
      {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-xs w-full shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <h3 className={`text-2xl font-bold mb-2 ${gameState.gameStatus === 'won' ? 'text-green-500' : 'text-rose-500'}`}>
              {gameState.gameStatus === 'won' ? t('wordle_won') : t('wordle_lost')}
            </h3>

            {gameState.gameStatus === 'lost' && (
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('wordle_answer')}: <span className="font-bold uppercase">{gameState.targetWord}</span>
              </p>
            )}

            {gameState.gameStatus === 'won' && (
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('wordle_guesses', { count: gameState.guesses.length.toString() })}
              </p>
            )}

            <Button onClick={shareResult} variant="secondary" fullWidth>
              <Share2 size={16} className="mr-1" />
              {t('wordle_share')}
            </Button>
          </div>
        </div>
      )}

      {/* Already Played Modal */}
      {gameState.gameStatus === 'already_played' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-xs w-full shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              {t('wordle_already_played')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              {t('wordle_come_back')}
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('wordle_answer')}: <span className="font-bold uppercase">{gameState.targetWord}</span>
            </p>
            <Button onClick={shareResult} variant="secondary" fullWidth>
              <Share2 size={16} className="mr-1" />
              {t('wordle_share')}
            </Button>
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="p-2 pb-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`
                  ${key === 'ENTER' || key === 'BACK' ? 'px-2 md:px-3 text-xs' : 'w-8 md:w-10'}
                  h-12 md:h-14 rounded-lg font-bold uppercase border
                  transition-all duration-150 active:scale-95
                  ${getKeyboardKeyColor(key)}
                `}
              >
                {key === 'BACK' ? <Delete size={18} /> : key === 'ENTER' ? <CornerDownLeft size={18} /> : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes flip {
          0% { transform: rotateX(0); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0); }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
