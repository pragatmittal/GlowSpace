import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';

// Import mood animations (you'll need to download these from LottieFiles)
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
    color: '#A5C68C',
    description: 'Feeling amazing and full of energy!'
  },
  {
    id: 'happy',
    name: 'Happy',
    animation: happyAnim,
    color: '#F2D479',
    description: 'Content and satisfied with life'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    animation: neutralAnim,
    color: '#E0D5C6',
    description: 'Neither particularly good nor bad'
  },
  {
    id: 'sad',
    name: 'Sad',
    animation: sadAnim,
    color: '#F28C28',
    description: 'Feeling down and blue'
  },
  {
    id: 'depressed',
    name: 'Depressed',
    animation: depressedAnim,
    color: '#B8A4D4',
    description: 'Experiencing deep sadness'
  }
];

function MoodTracker() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const moodContainerRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#mood-tracker', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate mood cards in
    gsap.from('.mood-card', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.2)'
    });
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);

    // Animate unselected moods out
    gsap.to('.mood-card', {
      opacity: 0.3,
      scale: 0.95,
      duration: 0.3
    });

    // Animate selected mood
    gsap.to(`#mood-${mood.id}`, {
      opacity: 1,
      scale: 1.05,
      duration: 0.3
    });
  };

  const handleContinue = () => {
    if (selectedMood) {
      // Save mood to history (you can implement this)
      const moodData = {
        mood: selectedMood.id,
        timestamp: new Date().toISOString()
      };

      // Animate transition to stats
      gsap.to(moodContainerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          setShowStats(true);
          gsap.from(statsRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5
          });
        }
      });
    }
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
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]/70">
            Mood Tracker
          </div>
        </div>

        {!showStats ? (
          <div ref={moodContainerRef}>
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[#4F3222] mb-4">
                How are you feeling today?
              </h1>
              <p className="text-lg text-[#4F3222]/70">
                Select the emoji that best matches your mood
              </p>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  id={`mood-${mood.id}`}
                  onClick={() => handleMoodSelect(mood)}
                  className={`mood-card cursor-pointer p-6 rounded-2xl shadow-lg transition-all
                    ${selectedMood?.id === mood.id ? 'ring-4 ring-offset-2' : ''}
                  `}
                  style={{
                    backgroundColor: mood.color + '40', // Adding transparency
                    borderColor: mood.color
                  }}
                >
                  <div className="aspect-square w-full max-w-[200px] mx-auto mb-4">
                    <Lottie
                      animationData={mood.animation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{mood.name}</h3>
                    <p className="text-sm text-[#4F3222]/70">{mood.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                className={`px-8 py-3 rounded-full text-white bg-[#4F3222] hover:opacity-90 transition-all
                  ${!selectedMood && 'opacity-50 cursor-not-allowed'}
                `}
                disabled={!selectedMood}
              >
                Track Mood →
              </button>
            </div>
          </div>
        ) : (
          <div ref={statsRef} className="max-w-2xl mx-auto">
            {/* Stats View */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Mood Tracked!</h2>
              <p className="text-lg text-[#4F3222]/70">
                Your mood has been recorded. Here's a summary of your recent moods:
              </p>
            </div>

            {/* Mood Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-32 h-32">
                  <Lottie
                    animationData={selectedMood.animation}
                    loop={true}
                    autoplay={true}
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">
                  You're feeling {selectedMood.name}
                </h3>
                <p className="text-[#4F3222]/70">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowStats(false);
                  setSelectedMood(null);
                  gsap.to('.mood-card', {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                  });
                }}
                className="px-6 py-3 rounded-full border-2 border-[#4F3222] text-[#4F3222] hover:bg-[#4F3222] hover:text-white transition-all"
              >
                Track Another Mood
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-full bg-[#4F3222] text-white hover:opacity-90 transition-all"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodTracker; 