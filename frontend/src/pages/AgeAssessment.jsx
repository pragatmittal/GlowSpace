import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AgeAssessment() {
  const navigate = useNavigate();
  const [selectedAge, setSelectedAge] = useState(25);
  const containerRef = useRef(null);
  const agesRef = useRef(null);
  const ages = Array.from({ length: 83 }, (_, i) => i + 18); // Ages 18-100

  useEffect(() => {
    const container = containerRef.current;
    const agesElement = agesRef.current;

    if (!container || !agesElement) return;

    const containerHeight = container.offsetHeight;

    // Initialize GSAP animations
    gsap.set(agesElement.children, {
      opacity: 0.5,
      scale: 0.8
    });

    gsap.set(`#age-${selectedAge}`, {
      opacity: 1,
      scale: 1.2,
      color: '#FFFFFF'
    });

    // Set up scroll handling
    let scrollTimeout;
    const handleScroll = (e) => {
      clearTimeout(scrollTimeout);
      
      const scrollPosition = agesElement.scrollTop;
      const totalScrollHeight = agesElement.scrollHeight - containerHeight;
      const progress = scrollPosition / totalScrollHeight;
      
      const newAge = Math.round(18 + (progress * 82));
      
      if (newAge !== selectedAge && newAge >= 18 && newAge <= 100) {
        setSelectedAge(newAge);
        
        // Animate all ages
        gsap.to(agesElement.children, {
          opacity: 0.5,
          scale: 0.8,
          color: '#7D7D7D',
          duration: 0.3
        });
        
        // Animate selected age
        gsap.to(`#age-${newAge}`, {
          opacity: 1,
          scale: 1.2,
          color: '#FFFFFF',
          duration: 0.3
        });
      }
    };

    agesElement.addEventListener('scroll', handleScroll);
    
    // Center the initial selected age
    const selectedElement = document.getElementById(`age-${selectedAge}`);
    if (selectedElement) {
      agesElement.scrollTop = selectedElement.offsetTop - (containerHeight / 2) + (selectedElement.offsetHeight / 2);
    }

    return () => {
      agesElement.removeEventListener('scroll', handleScroll);
    };
  }, [selectedAge]);

  const handleBack = () => {
    gsap.to('#age-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate(-1);
      }
    });
  };

  const handleContinue = () => {
    gsap.to('#age-assessment', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        // Navigate to next assessment page
        // TODO: Add your navigation logic here
      }
    });
  };

  const handleAgeClick = (age) => {
    setSelectedAge(age);
    const element = document.getElementById(`age-${age}`);
    const container = containerRef.current;
    if (element && container) {
      const containerHeight = container.offsetHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
      agesRef.current?.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="age-assessment" className="min-h-screen bg-[#FAF7F4] p-6">
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
          <span className="text-[#563C26] text-sm">3 of 14</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#563C26] text-2xl font-bold text-center mb-12">
          What's your age?
        </h2>

        {/* Age Picker */}
        <div 
          ref={containerRef}
          className="relative h-[300px] overflow-hidden mb-12"
        >
          <div
            ref={agesRef}
            className="absolute inset-0 flex flex-col items-center overflow-y-auto hide-scrollbar"
            style={{ 
              paddingTop: '120px', 
              paddingBottom: '120px',
              scrollBehavior: 'smooth'
            }}
          >
            {ages.map(age => (
              <div
                key={age}
                id={`age-${age}`}
                className={`py-2 text-3xl font-semibold transition-all cursor-pointer ${
                  age === selectedAge
                    ? 'text-white bg-[#A5C882] px-8 rounded-full shadow-md'
                    : 'text-[#7D7D7D] hover:text-[#563C26]'
                }`}
                onClick={() => handleAgeClick(age)}
              >
                {age}
              </div>
            ))}
          </div>
          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAF7F4] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF7F4] to-transparent pointer-events-none" />
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

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default AgeAssessment; 