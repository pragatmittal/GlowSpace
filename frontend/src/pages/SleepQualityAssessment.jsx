import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const sleepQualityLevels = [
  {
    value: 4,
    label: 'Excellent',
    hours: '7-9 hours',
    color: '#A5C882',
    icon: (selected) => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill={selected ? '#A5C882' : '#F3F4F6'} />
        <path d="M20 8C14.477 8 10 12.477 10 18C10 23.523 14.477 28 20 28C25.523 28 30 23.523 30 18C30 17.447 29.553 17 29 17H27.938C27.352 17 26.785 16.814 26.293 16.293L25.707 15.707C25.215 15.186 24.648 15 24.062 15H21.938C21.352 15 20.785 14.814 20.293 14.293L19.707 13.707C19.215 13.186 18.648 13 18.062 13H15.938C15.352 13 14.785 12.814 14.293 12.293L13.707 11.707C13.215 11.186 12.648 11 12.062 11H11C10.447 11 10 11.447 10 12" 
          stroke={selected ? 'white' : '#D1D5DB'} 
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="M20 8C14.477 8 10 12.477 10 18C10 23.523 14.477 28 20 28C25.523 28 30 23.523 30 18C30 17.447 29.553 17 29 17H27.938C27.352 17 26.785 16.814 26.293 16.293L25.707 15.707C25.215 15.186 24.648 15 24.062 15H21.938C21.352 15 20.785 14.814 20.293 14.293L19.707 13.707C19.215 13.186 18.648 13 18.062 13H15.938C15.352 13 14.785 12.814 14.293 12.293L13.707 11.707C13.215 11.186 12.648 11 12.062 11H11C10.447 11 10 11.447 10 12;
                    M20 8C14.477 8 10 12.477 10 18C10 23.523 14.477 28 20 28C25.523 28 30 23.523 30 18C30 17.447 29.553 17 29 17H27C26.414 17 25.847 16.814 25.354 16.293L24.768 15.707C24.276 15.186 23.709 15 23.123 15H20.999C20.413 15 19.846 14.814 19.354 14.293L18.768 13.707C18.276 13.186 17.709 13 17.123 13H14.999C14.413 13 13.846 12.814 13.354 12.293L12.768 11.707C12.276 11.186 11.709 11 11.123 11H10C9.447 11 9 11.447 9 12"
          />
        </path>
      </svg>
    )
  },
  {
    value: 3,
    label: 'Good',
    hours: '6-7 hours',
    color: '#FFD700',
    icon: (selected) => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill={selected ? '#FFD700' : '#F3F4F6'} />
        <path d="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20Z" 
          stroke={selected ? 'white' : '#D1D5DB'} 
          strokeWidth="2"
        >
          <animate
            attributeName="d"
            dur="2s"
            repeatCount="indefinite"
            values="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20Z;
                    M26 20C26 23.3137 23.3137 26 20 26C16.6863 26 14 23.3137 14 20C14 16.6863 16.6863 14 20 14C23.3137 14 26 16.6863 26 20Z;
                    M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20Z"
          />
        </path>
      </svg>
    )
  },
  {
    value: 2,
    label: 'Fair',
    hours: '5 hours',
    color: '#8B4513',
    icon: (selected) => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill={selected ? '#8B4513' : '#F3F4F6'} />
        <path d="M15 20H25M20 15V25" 
          stroke={selected ? 'white' : '#D1D5DB'} 
          strokeWidth="2" 
          strokeLinecap="round"
        >
          <animate
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    )
  },
  {
    value: 1,
    label: 'Poor',
    hours: '3-4 hours',
    color: '#F78C41',
    icon: (selected) => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill={selected ? '#F78C41' : '#F3F4F6'} />
        <path d="M26 20C26 23.3137 23.3137 26 20 26C16.6863 26 14 23.3137 14 20C14 16.6863 16.6863 14 20 14" 
          stroke={selected ? 'white' : '#D1D5DB'} 
          strokeWidth="2" 
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    )
  },
  {
    value: 0,
    label: 'Worst',
    hours: '< 3 hours',
    color: '#800080',
    icon: (selected) => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill={selected ? '#800080' : '#F3F4F6'} />
        <g>
          <path d="M15 15L25 25M25 15L15 25" 
            stroke={selected ? 'white' : '#D1D5DB'} 
            strokeWidth="2" 
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dasharray"
              values="0 100;100 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    )
  }
];

function SleepQualityAssessment() {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(2);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Set initial opacity to 1 when component mounts
    gsap.to('#sleep-quality-assessment', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Initial animation for the selected option
    gsap.to(`#quality-${sliderValue}`, {
      scale: 1.05,
      opacity: 1,
      duration: 0.3
    });
  }, []);

  const handleBack = () => {
    gsap.to('#sleep-quality-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate(-1);
      }
    });
  };

  const handleSliderChange = (e) => {
    let newValue;
    
    if (e.type === 'click') {
      // Calculate value based on click position
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percentage = 1 - (y / rect.height);
      newValue = Math.round(percentage * 4);
      // Clamp value between 0 and 4
      newValue = Math.max(0, Math.min(4, newValue));
    } else {
      newValue = parseInt(e.target.value);
    }

    setSliderValue(newValue);

    // Animate all options to default state
    gsap.to('.quality-option', {
      scale: 1,
      opacity: 0.5,
      duration: 0.3
    });

    // Animate selected option
    gsap.to(`#quality-${newValue}`, {
      scale: 1.05,
      opacity: 1,
      duration: 0.3
    });

    // Animate the progress bar
    const progress = (newValue / 4) * 100;
    gsap.to('.progress-fill', {
      height: `${progress}%`,
      backgroundColor: sleepQualityLevels[newValue].color,
      duration: 0.3
    });

    // Animate the handle
    gsap.to('.slider-handle', {
      bottom: `calc(${progress}% - 32px)`,
      duration: 0.3
    });
  };

  const handleOptionClick = (value) => {
    setSliderValue(value);
    
    // Animate all options to default state
    gsap.to('.quality-option', {
      scale: 1,
      opacity: 0.5,
      duration: 0.3
    });

    // Animate selected option
    gsap.to(`#quality-${value}`, {
      scale: 1.05,
      opacity: 1,
      duration: 0.3
    });

    // Animate the progress bar
    const progress = (value / 4) * 100;
    gsap.to('.progress-fill', {
      height: `${progress}%`,
      backgroundColor: sleepQualityLevels[value].color,
      duration: 0.3
    });

    // Animate the handle
    gsap.to('.slider-handle', {
      bottom: `calc(${progress}% - 32px)`,
      duration: 0.3
    });
  };

  const handleContinue = () => {
    gsap.to('#sleep-quality-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/medication-assessment');
      }
    });
  };

  return (
    <div id="sleep-quality-assessment" className="min-h-screen bg-[#FAF7F4] p-4 flex flex-col" style={{ opacity: 0 }}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="p-2 rounded-full border border-[#563C26] shadow-sm hover:shadow-md transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#563C26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-[#563C26] text-xl font-semibold">Assessment</h1>
        <div className="bg-[#F7F2EC] px-3 py-1 rounded-full">
          <span className="text-[#563C26] text-sm">8 of 14</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full py-8">
        <h2 className="text-[#4A3221] text-3xl font-bold text-center mb-12">
          How would you rate your sleep quality?
        </h2>

        {/* Sleep Quality Slider Section */}
        <div className="flex items-center justify-center gap-20 flex-1 w-full">
          {/* Quality Options */}
          <div className="flex flex-col justify-between h-[400px]">
            {sleepQualityLevels.map((level) => (
              <div
                key={level.value}
                id={`quality-${level.value}`}
                onClick={() => handleOptionClick(level.value)}
                className={`quality-option flex items-center gap-6 p-4 rounded-xl cursor-pointer transition-all
                  ${level.value === sliderValue ? 'opacity-100 bg-white shadow-lg' : 'opacity-50 hover:opacity-75'}`}
              >
                <div className="w-10 h-10">
                  {level.icon(level.value === sliderValue)}
                </div>
                <div>
                  <div className={`text-[#4A3221] text-xl ${level.value === sliderValue ? 'font-bold' : 'font-medium'}`}>
                    {level.label}
                  </div>
                  <div className="text-[#6B5D52] text-sm">
                    {level.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Slider */}
          <div 
            className="relative h-[400px] w-20 bg-[#EAE6E1] rounded-full overflow-hidden cursor-pointer"
            onClick={handleSliderChange}
          >
            {/* Progress Fill */}
            <div
              className="progress-fill absolute bottom-0 left-0 w-full transition-all duration-300"
              style={{
                height: `${(sliderValue / 4) * 100}%`,
                backgroundColor: sleepQualityLevels[sliderValue].color
              }}
            />
            
            {/* Custom Slider Handle */}
            <div
              className="slider-handle absolute left-1/2 -translate-x-1/2 w-16 h-16 pointer-events-none transition-all duration-300"
              style={{
                bottom: `calc(${(sliderValue / 4) * 100}% - 32px)`,
                transform: `translateX(-50%) scale(${isDragging ? 1.1 : 1})`
              }}
            >
              <div
                className="w-full h-full rounded-full shadow-lg border-4 border-white transition-all duration-300"
                style={{ backgroundColor: sleepQualityLevels[sliderValue].color }}
              />
            </div>

            {/* Click Areas */}
            {sleepQualityLevels.map((level, index) => (
              <div
                key={level.value}
                className="absolute left-0 w-full cursor-pointer"
                style={{
                  height: '20%',
                  bottom: `${level.value * 20}%`,
                  zIndex: 2
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(level.value);
                }}
              />
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-12">
          <button
            onClick={handleContinue}
            className="px-12 py-4 rounded-full text-white text-lg font-medium bg-[#4A3221] hover:brightness-110 transition-all shadow-md hover:shadow-lg"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default SleepQualityAssessment; 