import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function StressLevelAssessment() {
  const navigate = useNavigate();
  const [stressLevel, setStressLevel] = useState(5);

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#stress-level-assessment', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate the number on mount
    gsap.from('#stress-number', {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }, []);

  const handleStressLevelChange = (e) => {
    const newValue = parseInt(e.target.value);
    setStressLevel(newValue);

    // Animate the number change
    gsap.from('#stress-number', {
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const getStressDescription = (level) => {
    switch (level) {
      case 1:
        return "You Are Managing Stress Well.";
      case 2:
        return "You Are Slightly Stressed.";
      case 3:
        return "You Are Moderately Stressed.";
      case 4:
        return "You Are Very Stressed.";
      case 5:
        return "You Are Extremely Stressed Out.";
      default:
        return "";
    }
  };

  const handleBack = () => {
    gsap.to('#stress-level-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/mental-health-symptoms');
      }
    });
  };

  const handleContinue = () => {
    gsap.to('#stress-level-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/ai-sound-analysis');
      }
    });
  };

  return (
    <div 
      id="stress-level-assessment"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]/70">
            12 of 14
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#4F3222] mb-16">
          How would you rate your stress level?
        </h1>

        {/* Stress Level Display */}
        <div className="text-center mb-12">
          <div 
            id="stress-number"
            className="text-8xl font-bold text-[#4F3222] mb-8"
          >
            {stressLevel}
          </div>
        </div>

        {/* Slider */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="range"
            min="1"
            max="5"
            value={stressLevel}
            onChange={handleStressLevelChange}
            className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#F28C28]
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#F28C28]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:hover:shadow-lg
              [&::-webkit-slider-thumb]:transition-shadow"
          />
          <div className="flex justify-between mt-2 text-sm text-[#4F3222]/70">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-lg text-[#4F3222]">
            {getStressDescription(stressLevel)}
          </p>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-full text-white bg-[#4F3222] hover:opacity-90 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default StressLevelAssessment; 