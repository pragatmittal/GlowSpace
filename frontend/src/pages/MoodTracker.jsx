import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import useLottieAnimation from '../hooks/useLottieAnimation';

const moods = [
  {
    id: 'overjoyed',
    name: 'Overjoyed',
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/lottie.json',
    description: 'Feeling amazing and full of energy!'
  },
  {
    id: 'happy',
    name: 'Happy',
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/lottie.json',
    description: 'Content and satisfied with life'
  },
  {
    id: 'neutral',
    name: 'Neutral',
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/lottie.json',
    description: 'Neither particularly good nor bad'
  },
  {
    id: 'sad',
    name: 'Sad',
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/lottie.json',
    description: 'Feeling down or unhappy'
  },
  {
    id: 'depressed',
    name: 'Depressed',
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f629/lottie.json',
    description: 'Experiencing persistent sadness'
  }
];

const MoodAnimation = ({ url, size = 32 }) => {
  const { animationData, loading, error } = useLottieAnimation(url);

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
        autoplay={true}
      />
    </div>
  );
};

function MoodTracker() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    navigate(`/mood/${mood.id}`);
  };

  const handleBack = () => {
    navigate('/expression-analysis');
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#4F3222]"
          >
            ←
          </button>
          
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moods.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer
                ${selectedMood?.id === mood.id ? 'ring-2 ring-[#4F3222]' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32">
                  <MoodAnimation url={mood.animation} size={128} />
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