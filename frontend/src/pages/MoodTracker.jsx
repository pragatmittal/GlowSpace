import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';

// Import mood animations
import happyAnim from '../assets/animations/happy.json';
import sadAnim from '../assets/animations/sad.json';
import neutralAnim from '../assets/animations/neutral.json';
import excitedAnim from '../assets/animations/excited.json';
import depressedAnim from '../assets/animations/depressed.json';

const moods = [
  {
    id: 'overjoyed',
    name: 'Overjoyed',
    animation: excitedAnim,
    description: 'Feeling amazing and full of energy!'
  },
  {
    id: 'happy',
    name: 'Happy',
    animation: happyAnim,
    description: 'Content and satisfied with life'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    animation: neutralAnim,
    description: 'Neither particularly good nor bad'
  },
  {
    id: 'sad',
    name: 'Sad',
    animation: sadAnim,
    description: 'Feeling down or unhappy'
  },
  {
    id: 'depressed',
    name: 'Depressed',
    animation: depressedAnim,
    description: 'Experiencing persistent sadness'
  }
];

function MoodTracker() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    // Initial fade in animation
    gsap.from('.mood-card', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.2)'
    });
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);

    // Reset all cards
    gsap.to('.mood-card', {
      scale: 1,
      backgroundColor: '#FFFFFF',
      duration: 0.3
    });

    // Animate selected card
    gsap.to(`#mood-${mood.id}`, {
      scale: 1.02,
      backgroundColor: '#F7F2EC',
      duration: 0.3,
      onComplete: () => {
        // Navigate to the selected mood's route
        navigate(`/mood/${mood.id}`);
      }
    });
  };

  const handleBack = () => {
    gsap.to('#mood-tracker', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/expression-analysis');
      }
    });
  };

  return (
    <div 
      id="mood-tracker"
      className="min-h-screen bg-[#F9F6F2]"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#4F3222]"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]">
            14 of 14
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4F3222] mb-4">
            How are you feeling today?
          </h1>
          <p className="text-lg text-[#4F3222]/80">
            Select your current mood to track your emotional well-being
          </p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {moods.map((mood) => (
            <div
              key={mood.id}
              id={`mood-${mood.id}`}
              onClick={() => handleMoodSelect(mood)}
              className={`mood-card bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer
                ${selectedMood?.id === mood.id ? 'ring-2 ring-[#4F3222] bg-[#F7F2EC]' : ''}
              `}
              style={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32">
                  <Lottie
                    animationData={mood.animation}
                    loop={true}
                    autoplay={true}
                  />
                </div>
                <h3 className="text-xl font-medium text-[#4F3222]">
                  {mood.name}
                </h3>
                <p className="text-[#4F3222]/70 text-center">
                  {mood.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodTracker; 