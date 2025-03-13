import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import { getCurrentTimeOfDay, formatTime } from '../../utils/timeUtils';
import { getQuote } from '../../utils/quoteUtils';

// Import mood animations
import happyAnim from '../../assets/animations/happy.json';
import sadAnim from '../../assets/animations/sad.json';
import neutralAnim from '../../assets/animations/neutral.json';
import excitedAnim from '../../assets/animations/excited.json';
import depressedAnim from '../../assets/animations/depressed.json';

const moodConfigs = {
  overjoyed: {
    name: 'Overjoyed',
    animation: excitedAnim,
    color: '#FFD700'
  },
  happy: {
    name: 'Happy',
    animation: happyAnim,
    color: '#90EE90'
  },
  neutral: {
    name: 'Neutral',
    animation: neutralAnim,
    color: '#F0F0F0'
  },
  sad: {
    name: 'Sad',
    animation: sadAnim,
    color: '#ADD8E6'
  },
  depressed: {
    name: 'Depressed',
    animation: depressedAnim,
    color: '#D3D3D3'
  }
};

function MoodDetails() {
  const { moodId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [timeOfDay] = useState(location.state?.timeOfDay || getCurrentTimeOfDay());
  const [quote] = useState(location.state?.quote || getQuote(moodId, timeOfDay));
  const timestamp = location.state?.timestamp || new Date().toISOString();

  useEffect(() => {
    // Initial fade in animation
    gsap.set('#mood-details', { opacity: 0 });
    gsap.to('#mood-details', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate content sections
    gsap.from('.content-section', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.2)'
    });
  }, []);

  const handleSave = () => {
    // Here you would typically save to your backend
    const moodData = {
      mood: moodId,
      timeOfDay,
      timestamp,
      quote,
      notes,
    };
    console.log('Saving mood data:', moodData);
    
    setIsEditing(false);
  };

  const handleBack = () => {
    gsap.to('#mood-details', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        navigate('/mood-tracker');
      }
    });
  };

  if (!moodConfigs[moodId]) {
    return <div>Invalid mood</div>;
  }

  const { name, animation, color } = moodConfigs[moodId];

  return (
    <div
      id="mood-details"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222]"
      style={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/50 transition-colors text-[#4F3222]"
          >
            ←
          </button>
          <div className="text-sm font-medium text-[#4F3222]">
            {formatTime(new Date(timestamp))} • {timeOfDay}
          </div>
        </div>

        {/* Mood Animation */}
        <div className="content-section text-center mb-12">
          <div className="w-40 h-40 mx-auto mb-6">
            <Lottie
              animationData={animation}
              loop={true}
              autoplay={true}
            />
          </div>
          <h1 className="text-3xl font-bold text-[#4F3222] mb-2">
            Feeling {name}
          </h1>
          <p className="text-[#4F3222]/70">
            {timeOfDay}
          </p>
        </div>

        {/* Quote Section */}
        <div className="content-section bg-white rounded-2xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-medium text-[#4F3222] mb-4">
            Your Motivational Quote
          </h2>
          <p className="text-lg italic text-[#4F3222]/90">
            "{quote}"
          </p>
        </div>

        {/* Notes Section */}
        <div className="content-section bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#4F3222]">
              Personal Notes
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-[#4F3222]/70 hover:text-[#4F3222] transition-colors"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="text-sm bg-[#4F3222] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full h-32 p-4 rounded-lg border border-[#4F3222]/20 focus:border-[#4F3222] focus:ring-1 focus:ring-[#4F3222] resize-none"
            />
          ) : (
            <p className="text-[#4F3222]/80">
              {notes || 'No notes added yet. Click edit to add your thoughts.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodDetails; 