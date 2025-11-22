import React, { useState, useEffect } from 'react';

type TimeOfDay = 'late_night' | 'morning' | 'daytime';

const getTimeOfDay = (): TimeOfDay => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 23:30 (1410 mins) - 06:00 (360 mins) = late night
  // 06:00 (360 mins) - 10:00 (600 mins) = morning
  // 10:00 (600 mins) - 23:30 (1410 mins) = daytime

  if (totalMinutes >= 1410 || totalMinutes < 360) {
    return 'late_night';
  } else if (totalMinutes >= 360 && totalMinutes < 600) {
    return 'morning';
  } else {
    return 'daytime';
  }
};

const messages: Record<TimeOfDay, string> = {
  late_night: 'Ugye nem akarsz ilyenkor vásárolgatni? 🫨',
  morning: 'Jó reggelt! Ma se költs hülyeségekre. 🥸',
  daytime: 'Hmm, remélem nem készülsz felesleges kiadásokra. 🫥'
};

const BUBBLE_SHOWN_KEY = 'tivlo_time_bubble_shown';

export const TimeBasedBubble: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if bubble was already shown in this session
    const bubbleShown = sessionStorage.getItem(BUBBLE_SHOWN_KEY);
    if (!bubbleShown) {
      setIsVisible(true);
      sessionStorage.setItem(BUBBLE_SHOWN_KEY, 'true');

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  const timeOfDay = getTimeOfDay();
  const message = messages[timeOfDay];

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/20">
        {/* Chat bubble tail */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-500 dark:border-b-orange-600" />

        {/* Message */}
        <p className="text-sm sm:text-base font-medium pr-6 leading-relaxed">
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-1/2 -translate-y-1/2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Bezárás"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
