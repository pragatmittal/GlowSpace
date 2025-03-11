import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

function WeightAssessment() {
  const navigate = useNavigate();
  const [unit, setUnit] = useState('kg');
  const [weight, setWeight] = useState(128);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);
  const weightDisplayRef = useRef(null);

  // Weight ranges
  const kgRange = { min: 40, max: 200 };
  const lbsRange = { min: 88, max: 440 };

  // Convert between units
  const kgToLbs = (kg) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs) => Math.round(lbs / 2.20462);

  useEffect(() => {
    const slider = sliderRef.current;
    const handle = handleRef.current;
    const weightDisplay = weightDisplayRef.current;

    if (!slider || !handle || !weightDisplay) return;

    // Calculate the slider width and steps
    const sliderWidth = slider.offsetWidth - handle.offsetWidth;
    const currentRange = unit === 'kg' ? kgRange : lbsRange;
    const totalSteps = currentRange.max - currentRange.min;
    const stepWidth = sliderWidth / totalSteps;

    // Initialize handle position
    const initialX = ((weight - currentRange.min) / totalSteps) * sliderWidth;
    gsap.set(handle, { x: initialX });

    // Create draggable instance
    const draggable = Draggable.create(handle, {
      type: 'x',
      bounds: slider,
      inertia: true,
      snap: {
        x: stepWidth
      },
      onDrag: function() {
        const progress = this.x / sliderWidth;
        const newWeight = Math.round(currentRange.min + (progress * totalSteps));
        updateWeight(newWeight);
      },
      onDragEnd: function() {
        // Snap to nearest value
        const progress = this.x / sliderWidth;
        const newWeight = Math.round(currentRange.min + (progress * totalSteps));
        updateWeight(newWeight);
      }
    })[0];

    return () => {
      draggable.kill();
    };
  }, [unit]);

  useEffect(() => {
    // Set initial opacity to 1 when component mounts
    gsap.to('#weight-assessment', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  const updateWeight = (newWeight) => {
    setWeight(newWeight);
    // Animate weight display
    gsap.to(weightDisplayRef.current, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    
    // Convert weight to new unit
    const newWeight = newUnit === 'kg' ? lbsToKg(weight) : kgToLbs(weight);
    
    // Animate unit change
    gsap.to('.unit-selector button', {
      scale: 1,
      backgroundColor: '#FFFFFF',
      color: '#4A3221',
      duration: 0.3
    });
    
    gsap.to(`.unit-${newUnit}`, {
      scale: 1.05,
      backgroundColor: '#F78C41',
      color: '#FFFFFF',
      duration: 0.3
    });

    setUnit(newUnit);
    setWeight(newWeight);
  };

  const handleBack = () => {
    gsap.to('#weight-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate(-1);
      }
    });
  };

  const handleContinue = () => {
    gsap.to('#weight-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/professional-help-assessment');
      }
    });
  };

  return (
    <div id="weight-assessment" className="min-h-screen bg-[#FAF7F4] p-6" style={{ opacity: 0 }}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="p-2 rounded-full border border-[#563C26] shadow-sm hover:shadow-md transition-all"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="#563C26"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-[#563C26] text-xl font-semibold">Assessment</h1>
        <div className="bg-[#F7F2EC] px-3 py-1 rounded-full">
          <span className="text-[#563C26] text-sm">4 of 14</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#563C26] text-2xl font-bold text-center mb-8">
          What's your weight?
        </h2>

        {/* Unit Selector */}
        <div className="unit-selector flex justify-center gap-2 mb-12">
          <button
            onClick={() => handleUnitChange('kg')}
            className={`unit-kg px-6 py-2 rounded-full font-medium transition-all ${
              unit === 'kg'
                ? 'bg-[#F78C41] text-white scale-105'
                : 'bg-white text-[#4A3221] border border-[#E5E5E5]'
            }`}
          >
            kg
          </button>
          <button
            onClick={() => handleUnitChange('lbs')}
            className={`unit-lbs px-6 py-2 rounded-full font-medium transition-all ${
              unit === 'lbs'
                ? 'bg-[#F78C41] text-white scale-105'
                : 'bg-white text-[#4A3221] border border-[#E5E5E5]'
            }`}
          >
            lbs
          </button>
        </div>

        {/* Weight Display */}
        <div ref={weightDisplayRef} className="text-center mb-8">
          <span className="text-[#4A3221] text-6xl font-bold">
            {weight}
          </span>
          <span className="text-[#4A3221] text-3xl ml-2">
            {unit}
          </span>
        </div>

        {/* Weight Slider */}
        <div className="relative mx-auto max-w-2xl mb-12">
          <div
            ref={sliderRef}
            className="h-2 bg-[#F0E9E3] rounded-full"
          >
            {/* Slider marks */}
            <div className="absolute -top-1 left-0 right-0 flex justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 h-4 bg-[#E5E5E5] rounded-full"
                />
              ))}
            </div>
            {/* Draggable handle */}
            <div
              ref={handleRef}
              className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-[#A5C882] rounded-full cursor-pointer"
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-full text-white bg-[#4A3221] hover:brightness-110 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeightAssessment; 