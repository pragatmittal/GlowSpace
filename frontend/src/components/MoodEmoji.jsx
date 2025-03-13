import React from 'react';
import Lottie from 'lottie-react';
import useLottieAnimation from '../hooks/useLottieAnimation';

const MoodEmoji = ({ mood, moodConfig, size = 48 }) => {
  const { animationData, loading, error } = useLottieAnimation(moodConfig.animation);

  if (loading) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="animate-pulse bg-gray-200 rounded-full"
      />
    );
  }

  if (error) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-gray-100 rounded-full"
      >
        😐
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default MoodEmoji; 