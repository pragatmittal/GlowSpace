import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

function AISoundAnalysis() {
  const navigate = useNavigate();
  const rippleRef = useRef(null);

  useEffect(() => {
    // Initial fade in animation
    gsap.to('#ai-sound-analysis', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Create ripple animation timeline
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { duration: 2, ease: 'power1.inOut' }
    });

    // Animate each ripple circle
    tl.to('.ripple-outer', {
      scale: 1.2,
      opacity: 0.3
    }, 0)
    .to('.ripple-middle', {
      scale: 1.3,
      opacity: 0.5
    }, 0.2)
    .to('.ripple-inner', {
      scale: 1.4,
      opacity: 0.7
    }, 0.4);

    return () => {
      tl.kill();
    };
  }, []);

  const handleBack = () => {
    gsap.to('#ai-sound-analysis', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/mental-health-symptoms');
      }
    });
  };

  const handleContinue = () => {
    gsap.to('#ai-sound-analysis', {
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
      id="ai-sound-analysis"
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
            13 of 14
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4F3222] mb-4">
            AI Sound Analysis
          </h1>
          <p className="text-[#4F3222]/70 text-lg">
            Please say the following words below. Don't worry, we don't steal your voice data.
          </p>
        </div>

        {/* Ripple Animation */}
        <div 
          ref={rippleRef}
          className="relative w-64 h-64 mx-auto mb-12"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="ripple-outer w-48 h-48 rounded-full bg-[#DCE8D5] opacity-30" />
            <div className="ripple-middle w-36 h-36 rounded-full bg-[#B5CDA3] opacity-50 absolute" />
            <div className="ripple-inner w-24 h-24 rounded-full bg-[#3D5B39] opacity-70 absolute" />
          </div>
        </div>

        {/* Phrase Display */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="inline-flex items-center">
            <span className="bg-[#F28C28] text-white px-4 py-2 rounded-full font-medium">
              I believe in
            </span>
          </div>
          <div className="text-xl text-[#4F3222] font-medium">
            Dr. Freud, with all my heart.
          </div>
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

export default AISoundAnalysis; 