import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function MedicationAssessment() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      id: 'prescribed',
      title: 'Prescribed Medications',
      icon: (color = '#4F3222') => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8H8C6.89543 8 6 8.89543 6 10V22C6 23.1046 6.89543 24 8 24H24C25.1046 24 26 23.1046 26 22V10C26 8.89543 25.1046 8 24 8Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 12L12 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 12L16 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 12L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'otc',
      title: 'Over the Counter Supplements',
      icon: (color = '#4F3222') => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 7V25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M25 16L7 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'none',
      title: 'I\'m not taking any',
      icon: (color = '#4F3222') => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 7L7 25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 7L25 25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'prefer_not',
      title: 'Prefer not to say',
      icon: (color = '#4F3222') => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2"/>
          <path d="M16 12V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="20" r="1" fill={color}/>
        </svg>
      )
    }
  ];

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#medication-assessment', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  const handleBack = () => {
    gsap.to('#medication-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/sleep-quality-assessment');
      }
    });
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);

    // Animate all options to default state
    gsap.to('.option-card', {
      scale: 1,
      backgroundColor: '#FFFFFF',
      duration: 0.3
    });

    // Animate selected option
    gsap.to(`#option-${optionId}`, {
      scale: 1.02,
      backgroundColor: '#C5DAB7',
      duration: 0.3
    });
  };

  const handleContinue = () => {
    if (selectedOption) {
      gsap.to('#medication-assessment', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Navigate to medication selection if user selected prescribed or OTC medications
          if (selectedOption === 'prescribed' || selectedOption === 'otc') {
            navigate('/medication-selection');
          } else {
            // Navigate to mental health symptoms for "none" or "prefer_not" options
            navigate('/mental-health-symptoms');
          }
        }
      });
    }
  };

  return (
    <div 
      id="medication-assessment"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={handleBack}
            className="text-2xl hover:opacity-70 transition-opacity"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]/70">
            9 of 14
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-medium text-center mb-12">
          Are you currently taking any medications?
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          {options.map((option) => (
            <div
              key={option.id}
              id={`option-${option.id}`}
              onClick={() => handleOptionSelect(option.id)}
              className={`option-card cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-lg transition-all
                ${selectedOption === option.id ? 'bg-[#C5DAB7]' : 'bg-white'}
              `}
            >
              <div className="flex items-center gap-4">
                {option.icon(selectedOption === option.id ? '#4F3222' : '#4F3222')}
                <span className="text-lg font-medium">{option.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className={`px-8 py-3 rounded-full text-white bg-[#4F3222] hover:opacity-90 transition-all
              ${!selectedOption && 'opacity-50 cursor-not-allowed'}
            `}
            disabled={!selectedOption}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicationAssessment; 