import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';

// Import mood animations
import happyAnim from '../../assets/animations/happy.json';
import sadAnim from '../../assets/animations/sad.json';
import neutralAnim from '../../assets/animations/neutral.json';
import excitedAnim from '../../assets/animations/excited.json';
import depressedAnim from '../../assets/animations/depressed.json';

const moodConfigs = {
  depressed: {
    name: 'Depressed',
    animation: depressedAnim,
    description: 'Experiencing persistent sadness',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-900',
    buttonColor: 'bg-purple-500',
    index: 1
  },
  sad: {
    name: 'Sad',
    animation: sadAnim,
    description: 'Feeling down or unhappy',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
    buttonColor: 'bg-orange-500',
    index: 2
  },
  neutral: {
    name: 'Neutral',
    animation: neutralAnim,
    description: 'Neither particularly good nor bad',
    bgColor: 'bg-[#B8977E]',
    textColor: 'text-[#4F3222]',
    buttonColor: 'bg-[#4F3222]',
    index: 3
  },
  happy: {
    name: 'Happy',
    animation: happyAnim,
    description: 'Content and satisfied with life',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-900',
    buttonColor: 'bg-yellow-500',
    index: 4
  },
  overjoyed: {
    name: 'Overjoyed',
    animation: excitedAnim,
    description: 'Feeling amazing and full of energy!',
    bgColor: 'bg-green-100',
    textColor: 'text-green-900',
    buttonColor: 'bg-green-500',
    index: 5
  }
};

function MoodSelection() {
  const navigate = useNavigate();
  const { mood } = useParams();
  const currentMood = moodConfigs[mood];

  useEffect(() => {
    if (!currentMood) {
      navigate('/mood/depressed');
      return;
    }

    gsap.set('#mood-page', { opacity: 0 });
    gsap.to('#mood-page', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    gsap.from('#mood-animation', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  }, [currentMood, navigate]);

  const handleNext = () => {
    const moods = Object.keys(moodConfigs);
    const currentIndex = moods.indexOf(mood);
    
    if (currentIndex === moods.length - 1) {
      // If we're on the last mood, go to history
      navigate('/mood/history');
    } else {
      // Otherwise go to next mood
      navigate(`/mood/${moods[currentIndex + 1]}`);
    }
  };

  const handleBack = () => {
    if (currentMood.index === 1) {
      navigate('/mood');
    } else {
      const moods = Object.keys(moodConfigs);
      const currentIndex = moods.indexOf(mood);
      navigate(`/mood/${moods[currentIndex - 1]}`);
    }
  };

  const handleSelect = () => {
    // Save the selected mood
    // Then navigate to history
    navigate('/mood/history');
  };

  if (!currentMood) return null;

  return (
    <div 
      id="mood-page"
      className={`min-h-screen ${currentMood.bgColor} flex flex-col`}
      style={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className={`p-2 rounded-full hover:bg-white/20 transition-colors ${currentMood.textColor}`}
          >
            ←
          </button>
          <div className={`text-sm font-medium ${currentMood.textColor}`}>
            {currentMood.index} of 5
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Animation */}
          <div id="mood-animation" className="w-64 h-64">
            <Lottie
              animationData={currentMood.animation}
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Mood Name */}
          <h1 className={`text-4xl font-bold ${currentMood.textColor}`}>
            {currentMood.name}
          </h1>

          {/* Description */}
          <p className={`text-xl ${currentMood.textColor} opacity-80 text-center max-w-md`}>
            {currentMood.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSelect}
            className={`px-8 py-3 rounded-full text-white ${currentMood.buttonColor} hover:opacity-90 transition-all`}
          >
            Select This Mood
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-white/30 hover:bg-white/40 transition-all"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoodSelection; 