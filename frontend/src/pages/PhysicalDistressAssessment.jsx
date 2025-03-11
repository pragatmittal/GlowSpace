import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function PhysicalDistressAssessment() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Set initial opacity to 1 when component mounts
    gsap.to('#physical-distress-assessment', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }, []);

  const handleBack = () => {
    gsap.to('#physical-distress-assessment', {
     
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate(-1);
      }
    });
  };

  const handleOptionSelect = (option) => {
    // Reset all options to default state
    gsap.to(['.option-card'], {
      scale: 1,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderColor: 'transparent',
      duration: 0.3
    });

    // Reset all check icons
    gsap.to(['.check-icon'], {
      
      x: -10,
      duration: 0.2
    });

    // Animate the selected option
    gsap.to(`#option-${option}`, {
      scale: 1.02,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      borderColor: option === 'yes' ? '#4A3221' : '#FFFFFF',
      duration: 0.3
    });

    // Animate the check icon for selected option
    gsap.to(`#check-${option}`, {
      
      x: 0,
      duration: 0.3,
      delay: 0.1
    });

    // Fade the unselected option
    gsap.to(`#option-${option === 'yes' ? 'no' : 'yes'}`, {
     
      scale: 0.98,
      duration: 0.3
    });

    setSelectedOption(option);
  };

  const handleContinue = () => {
    gsap.to('#physical-distress-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/sleep-quality-assessment');
      }
    });
  };

  return (
    <div id="physical-distress-assessment" className="h-screen bg-[#FAF7F4] p-4 flex flex-col" style={{ opacity: 0 }}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
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
          <span className="text-[#563C26] text-sm">7 of 14</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full py-4">
        <h2 className="text-[#4A3221] text-2xl font-bold text-center mb-8">
          Are you experiencing any physical distress?
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-4 max-w-lg mx-auto mb-8">
          {/* Option 1: Yes */}
          <div
            id="option-yes"
            onClick={() => handleOptionSelect('yes')}
            className="option-card relative bg-white rounded-xl p-6 shadow-md cursor-pointer transition-all border-2 border-transparent"
          >
            {/* Check Icon */}
            <div
              id="check-yes"
              className="check-icon absolute left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#4A3221"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="pl-8">
              <h3 className="text-[#4A3221] text-lg font-bold mb-1">Yes, one or multiple</h3>
              <p className="text-[#6B5D52] text-sm">Select this if you're experiencing any form of physical pain</p>
            </div>
          </div>

          {/* Option 2: No */}
          <div
            id="option-no"
            onClick={() => handleOptionSelect('no')}
            className="option-card relative bg-[#A5C882] rounded-xl p-6 shadow-md cursor-pointer transition-all border-2 border-transparent"
          >
            {/* Cross Icon */}
            <div
              id="check-no"
              className="check-icon absolute left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#FF4D4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="pl-8">
              <h3 className="text-white text-lg font-bold mb-1">No Physical Pain At All</h3>
              <p className="text-white/80 text-sm">Select this if you're not experiencing any physical pain</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mb-6">
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

export default PhysicalDistressAssessment; 