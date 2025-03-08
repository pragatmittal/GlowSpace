import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ScoreChart from '../components/dashboard/ScoreChart';
import StressChart from '../components/dashboard/StressChart';
import StatCards from '../components/dashboard/StatCards';
import PromoCard from '../components/dashboard/PromoCard';
import { cn } from '../components/ui/utils';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save preference to localStorage
    localStorage.setItem('darkMode', !darkMode);
    
    // Apply dark mode class to document
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen w-full flex items-center justify-center",
        darkMode ? "bg-background-dark" : "bg-background"
      )}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-16 h-16 rounded-full border-4 border-card border-t-button-primary border-l-button-primary"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen w-full",
      darkMode ? "bg-background-dark text-text-dark-primary" : "bg-background text-text-primary"
    )}>
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main Content */}
      <div className="ml-[15%] min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <motion.main
          className="p-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* First Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
            <div className="lg:col-span-5">
              <ScoreChart />
            </div>
            <div className="lg:col-span-2">
              <StressChart />
            </div>
          </div>
          
          {/* Second Row: Stat Cards */}
          <StatCards />
          
          {/* Third Row: Promo Card */}
          <PromoCard />
        </motion.main>
      </div>
    </div>
  );
} 