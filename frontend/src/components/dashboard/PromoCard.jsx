import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../ui/utils';

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "bg-white dark:bg-sidebar-dark rounded-2xl p-6 md:p-8",
        "shadow-card hover:shadow-card-hover transition-shadow",
        "w-full mt-6"
      )}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Meditation Character SVG */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="100" fill="#F8C55A" fillOpacity="0.2" />
              <ellipse cx="100" cy="165" rx="40" ry="8" fill="#E7D7CE" />
              <motion.g
                animate={{ 
                  scale: [1, 1.03, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Body */}
                <path d="M100 140C111.046 140 120 131.046 120 120V90C120 78.9543 111.046 70 100 70C88.9543 70 80 78.9543 80 90V120C80 131.046 88.9543 140 100 140Z" fill="#E37A3E" />
                {/* Head */}
                <circle cx="100" cy="60" r="20" fill="#E37A3E" />
                {/* Face */}
                <path d="M92 55C93.1046 55 94 54.1046 94 53C94 51.8954 93.1046 51 92 51C90.8954 51 90 51.8954 90 53C90 54.1046 90.8954 55 92 55Z" fill="#3A2A1C" />
                <path d="M108 55C109.105 55 110 54.1046 110 53C110 51.8954 109.105 51 108 51C106.895 51 106 51.8954 106 53C106 54.1046 106.895 55 108 55Z" fill="#3A2A1C" />
                <path d="M100 63C102.761 63 105 62.5523 105 62C105 61.4477 102.761 60 100 60C97.2386 60 95 61.4477 95 62C95 62.5523 97.2386 63 100 63Z" fill="#3A2A1C" />
                {/* Legs Crossed */}
                <path d="M80 140C80 140 95 150 100 150C105 150 120 140 120 140" stroke="#E37A3E" strokeWidth="20" strokeLinecap="round" />
                {/* Arms in meditation pose */}
                <path d="M120 110C120 110 135 117 140 115C145 113 143 105 140 105C137 105 120 110 120 110Z" fill="#E37A3E" />
                <path d="M80 110C80 110 65 117 60 115C55 113 57 105 60 105C63 105 80 110 80 110Z" fill="#E37A3E" />
                {/* Floating Elements */}
                <circle cx="150" cy="80" r="10" fill="#79A66D" fillOpacity="0.7" />
                <circle cx="50" cy="80" r="10" fill="#79A66D" fillOpacity="0.7" />
                <circle cx="160" cy="110" r="6" fill="#A389E6" fillOpacity="0.7" />
                <circle cx="40" cy="110" r="6" fill="#A389E6" fillOpacity="0.7" />
              </motion.g>
            </svg>
          </motion.div>
        </div>
        
        <div className="md:w-2/3 md:pl-8">
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-3">
            Unlock Premium AI Features
          </h3>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
            Upgrade to our Pro plan and access advanced AI analytics, personalized recommendations, 
            and unlimited chatbot conversations. Experience the full power of GlowSpace AI.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "bg-button-primary hover:bg-button-primary/90 text-text-primary",
              "px-6 py-3 rounded-full font-medium",
              "flex items-center justify-center",
              "transition-colors shadow-md"
            )}
          >
            <span>Upgrade Now</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 