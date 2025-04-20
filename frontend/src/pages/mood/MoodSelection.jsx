import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';

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
    description: 'Feeling amazing and energetic!',
    bgColor: 'bg-green-100',
    textColor: 'text-green-900',
    buttonColor: 'bg-green-500',
    index: 1
  },
  happy: {
    name: 'Happy',
    animation: happyAnim,
    description: 'Feeling good and positive',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-900',
    buttonColor: 'bg-yellow-500',
    index: 2
  },
  neutral: {
    name: 'Neutral',
    animation: neutralAnim,
    description: 'Feeling okay',
    bgColor: 'bg-[#B8977E]',
    textColor: 'text-[#4F3222]',
    buttonColor: 'bg-[#4F3222]',
    index: 3
  },
  sad: {
    name: 'Sad',
    animation: sadAnim,
    description: 'Feeling down today',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
    buttonColor: 'bg-orange-500',
    index: 4
  },
  depressed: {
    name: 'Depressed',
    animation: depressedAnim,
    description: 'Feeling very low',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-900',
    buttonColor: 'bg-purple-500',
    index: 5
  }
};

function MoodSelection() {
  const { mood } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { startFetching, hideLoading, showError, showSuccess } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Normalize the mood parameter to match our config keys
    const normalizedMood = mood?.toLowerCase();
    
    // Check if the mood exists in our configs
    if (normalizedMood && moodConfigs[normalizedMood]) {
      setCurrentMood(normalizedMood);
    } else {
      // If mood is invalid, show error and redirect after a delay
      showError("Invalid mood selected");
      setTimeout(() => {
        navigate('/mood-tracker');
      }, 2000);
    }
  }, [mood, navigate, showError]);

  useEffect(() => {
    if (!currentMood) {
      // Don't redirect to depressed, just return null
      return;
    }

    gsap.set('#mood-page', { opacity: 0 });
    gsap.to('#mood-page', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    gsap.from('#mood-animation', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  }, [currentMood]);

  useEffect(() => {
    // Check if we're offline
    const checkConnection = async () => {
      try {
        await axios.get('http://localhost:5000/api');
        setIsOffline(false);
      } catch (error) {
        setIsOffline(true);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    const moods = Object.keys(moodConfigs);
    const currentIndex = moods.indexOf(currentMood);
    
    if (currentIndex === moods.length - 1) {
      // If we're on the last mood, go to history
      navigate('/mood/history');
    } else {
      // Otherwise go to next mood
      navigate(`/mood/${moods[currentIndex + 1]}`);
    }
  };

  const handleBack = () => {
    if (currentMood.index === 1) {
      navigate('/mood');
    } else {
      const moods = Object.keys(moodConfigs);
      const currentIndex = moods.indexOf(currentMood);
      navigate(`/mood/${moods[currentIndex - 1]}`);
    }
  };

  const handleSelect = async () => {
    if (!isAuthenticated) {
      showError("Please sign in to track your moods");
      navigate('/auth/sign-in', { state: { from: { pathname: `/mood/${currentMood}` } } });
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (isOffline) {
        // Store mood data in localStorage for offline mode
        const offlineMood = {
          mood: currentMood,
          timestamp: new Date().toISOString(),
          userId: user?.id || 'offline-user'
        };
        
        const offlineMoods = JSON.parse(localStorage.getItem('offlineMoods') || '[]');
        offlineMoods.push(offlineMood);
        localStorage.setItem('offlineMoods', JSON.stringify(offlineMoods));
        
        // Show success message for offline mode
        showSuccess("Mood saved offline. Will sync when connection is restored.");
        setMoodSaved(true);
        return;
      }

      startFetching("Saving your mood...");

      // Get current time
      const now = new Date();
      const hour = now.getHours();
      
      // Determine time of day
      let timeOfDay = 'Afternoon'; // Default
      if (hour >= 5 && hour < 12) {
        timeOfDay = 'Morning';
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'Afternoon';
      } else if (hour >= 17 && hour < 21) {
        timeOfDay = 'Evening';
      } else if (hour >= 21 || hour < 1) {
        timeOfDay = 'Night';
      } else {
        timeOfDay = 'Late Night';
      }

      // Online mode - send to server
      await axios.post('http://localhost:5000/api/moods', {
        mood: currentMood,
        timeOfDay: timeOfDay,
        note: '',
        metadata: {}
      }, {
        withCredentials: true
      });

      showSuccess("Mood saved successfully!");
      setMoodSaved(true);
      
      // Don't navigate away, stay on the current page
    } catch (error) {
      console.error('Error saving mood:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Your mood will be saved offline.');
        setIsOffline(true);
        
        // Store mood data in localStorage
        const offlineMood = {
          mood: currentMood,
          timestamp: new Date().toISOString(),
          userId: user?.id || 'offline-user'
        };
        
        const offlineMoods = JSON.parse(localStorage.getItem('offlineMoods') || '[]');
        offlineMoods.push(offlineMood);
        localStorage.setItem('offlineMoods', JSON.stringify(offlineMoods));
        
        // Show success message for offline mode
        showSuccess("Mood saved offline. Will sync when connection is restored.");
        setMoodSaved(true);
      } else {
        showError(error.response?.data?.message || 'Failed to save mood. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  const handleViewHistory = () => {
    navigate('/mood/history');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!currentMood) return null;

  return (
    <div id="mood-page" ref={containerRef} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-all"
          >
            ←
          </button>
          <div className={`text-sm font-medium ${moodConfigs[currentMood].textColor}`}>
            {currentMood ? `${moodConfigs[currentMood].index} of 5` : ''}
          </div>
        </div>

        {/* Offline Indicator */}
        {isOffline && (
          <div className="bg-yellow-500/20 text-yellow-200 px-4 py-2 rounded-lg mb-4 text-center">
            You're offline. Moods will be saved locally and synced when connection is restored.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {moodSaved && (
          <div className="bg-green-500/20 text-green-200 px-4 py-2 rounded-lg mb-4 text-center">
            Your mood has been saved successfully!
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Animation */}
          <div id="mood-animation" className="w-64 h-64">
            <div className={`text-6xl ${moodConfigs[currentMood].textColor}`}>
              {currentMood === 'overjoyed' && '😄'}
              {currentMood === 'happy' && '😊'}
              {currentMood === 'neutral' && '😐'}
              {currentMood === 'sad' && '😢'}
              {currentMood === 'depressed' && '😔'}
            </div>
          </div>

          {/* Mood Name */}
          <h1 className={`text-4xl font-bold ${moodConfigs[currentMood].textColor}`}>
            {moodConfigs[currentMood].name}
          </h1>

          {/* Description */}
          <p className={`text-xl ${moodConfigs[currentMood].textColor} opacity-80 text-center max-w-md`}>
            {moodConfigs[currentMood].description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {!moodSaved ? (
          <button
            onClick={handleSelect}
              className={`px-8 py-3 rounded-full text-white ${moodConfigs[currentMood].buttonColor} hover:opacity-90 transition-all ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Select This Mood'}
            </button>
          ) : (
            <>
              <button
                onClick={handleViewHistory}
                className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
              >
                View Mood History
              </button>
              <button
                onClick={handleGoToDashboard}
                className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 transition-all"
              >
                Go to Dashboard
          </button>
            </>
          )}
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-white/30 hover:bg-white/40 transition-all"
            disabled={isSubmitting}
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoodSelection; 