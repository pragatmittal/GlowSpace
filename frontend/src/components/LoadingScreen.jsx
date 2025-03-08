import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading, LOADING_STATES } from '../context/LoadingContext';
import { Loader2 } from 'lucide-react';

// Motivational quotes for success screen
const MOTIVATIONAL_QUOTES = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams."
];

const LoadingScreen = () => {
  const { loadingState, message, isVisible, progress, networkSpeed } = useLoading();
  const [quote, setQuote] = useState('');
  
  // Select a random quote when showing the success screen
  useEffect(() => {
    if (loadingState === LOADING_STATES.SUCCESS) {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    }
  }, [loadingState]);

  // Determine the rotation speed based on network speed
  const getRotationDuration = () => {
    switch (networkSpeed) {
      case 'slow': return 3; // 3 seconds per rotation when slow
      case 'fast': return 1; // 1 second per rotation when fast
      default: return 2; // 2 seconds per rotation by default
    }
  };

  // Render different loading screens based on the current state
  const renderLoadingContent = () => {
    switch (loadingState) {
      case LOADING_STATES.PAGE_TRANSITION:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-40 mb-8">
              {/* Large circle */}
              <div className="absolute inset-0 rounded-full border-4 border-[#3D1E0F]/30"></div>
              
              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="none" 
                  stroke="#3D1E0F" 
                  strokeWidth="8" 
                  strokeDasharray="289.27"
                  strokeDashoffset={289.27 - (289.27 * progress / 100)}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Progress text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-[#3D1E0F]">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <p className="text-[#3D1E0F] text-xl font-medium">{message || 'Loading...'}</p>
          </div>
        );
        
      case LOADING_STATES.FETCHING_DATA:
        return (
          <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
            {/* Floating circles background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full bg-[#4C704C]/30"
                  style={{
                    width: `${20 + Math.random() * 60}px`,
                    height: `${20 + Math.random() * 60}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 50 - 25],
                    y: [0, Math.random() * 50 - 25],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>
            
            {/* Main content */}
            <motion.div 
              className="z-10 flex flex-col items-center"
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-white/20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <p className="text-white text-2xl font-semibold">{message || 'Fetching Data...'}</p>
            </motion.div>
          </div>
        );
        
      case LOADING_STATES.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <svg className="w-20 h-20 mx-auto" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 12L10 17L20 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
            </motion.div>
            
            <motion.p 
              className="text-white text-xl font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {message || 'Success!'}
            </motion.p>
            
            <motion.p 
              className="text-white/80 text-lg font-light italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              "{quote}"
            </motion.p>
          </div>
        );
        
      default:
        // Neutral/Idle state
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: getRotationDuration(), 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="mb-6"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#3D1E0F]">GS</span>
              </div>
            </motion.div>
            <p className="text-[#3D1E0F] text-xl font-medium">
              {message || 'Loading...'}
            </p>
          </div>
        );
    }
  };

  // Get background color based on current state
  const getBackgroundColor = () => {
    switch (loadingState) {
      case LOADING_STATES.PAGE_TRANSITION:
        return 'bg-[#F8F6F2]';
      case LOADING_STATES.FETCHING_DATA:
        return 'bg-gradient-to-br from-[#A6D49F] to-[#4C704C]';
      case LOADING_STATES.SUCCESS:
        return 'bg-[#E67E22]';
      default:
        return 'bg-[#F8F6F2]';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${getBackgroundColor()}`}
        >
          {renderLoadingContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 