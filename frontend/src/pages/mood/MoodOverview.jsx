import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import happyAnim from '../../assets/animations/happy.json';

const moods = [
  { id: 'happy', name: 'Happy', color: '#FFC107', animation: happyAnim },
  { id: 'sad', name: 'Sad', color: '#2196F3' },
  { id: 'angry', name: 'Angry', color: '#D32F2F' },
  { id: 'calm', name: 'Calm', color: '#4CAF50' },
  { id: 'anxious', name: 'Anxious', color: '#9C27B0' }
];

function MoodOverview() {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMood, setSelectedMood] = useState(moods[0]);

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#mood-overview', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate emoji entrance
    gsap.from('#mood-emoji', {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });
  }, []);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    gsap.to('#mood-filter', {
      height: showFilter ? 0 : 'auto',
      opacity: showFilter ? 0 : 1,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowFilter(false);
    
    // Animate background color change
    gsap.to('#mood-overview', {
      backgroundColor: mood.color + '20', // Add transparency
      duration: 0.5
    });

    // Animate emoji change
    gsap.to('#mood-emoji', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to('#mood-emoji', {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });
  };

  const handleContinue = () => {
    gsap.to('#mood-overview', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/mood/select');
      }
    });
  };

  return (
    <div 
      id="mood-overview"
      className="min-h-screen bg-white text-[#4F3222] opacity-0 flex flex-col"
      style={{ backgroundColor: selectedMood.color + '20' }}
    >
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md">
        <h1 className="text-xl font-semibold">Mood Tracker</h1>
        <button 
          onClick={toggleFilter}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
        </button>
      </nav>

      {/* Mood Filter Dropdown */}
      <div 
        id="mood-filter"
        className="overflow-hidden h-0 opacity-0 bg-white/80 backdrop-blur-md"
      >
        <div className="p-4 space-y-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className="w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-3"
              style={{ color: mood.color }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: mood.color }}
              />
              <span>{mood.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-8">
        {/* Large Emoji */}
        <div 
          id="mood-emoji"
          className="w-48 h-48"
        >
          <Lottie
            animationData={selectedMood.animation}
            loop={true}
            autoplay={true}
          />
        </div>

        {/* Question Text */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">
            How are you feeling today?
          </h2>
          <p className="text-[#4F3222]/70 text-lg">
            Select your current mood to track your emotional journey
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="mt-8 px-8 py-3 rounded-full bg-[#4F3222] text-white hover:opacity-90 transition-all"
        >
          Continue →
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/80 backdrop-blur-md p-4 flex justify-around items-center">
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 17l-5-5-4 4-4-4" />
          </svg>
        </button>
        <button className="p-2 bg-[#4F3222] text-white rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MoodOverview; 