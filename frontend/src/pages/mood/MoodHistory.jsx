import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import MoodEmoji from '../../components/MoodEmoji';

const moodConfigs = {
  overjoyed: {
    name: 'Overjoyed',
    color: '#FFB74D',
    gradient: 'from-yellow-200 to-orange-300',
    description: 'Feeling amazing and energetic!',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/lottie.json'
  },
  happy: {
    name: 'Happy',
    color: '#81C784',
    gradient: 'from-green-200 to-yellow-200',
    description: 'Feeling good and positive',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/lottie.json'
  },
  neutral: {
    name: 'Neutral',
    color: '#90A4AE',
    gradient: 'from-gray-200 to-blue-200',
    description: 'Feeling okay',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/lottie.json'
  },
  sad: {
    name: 'Sad',
    color: '#64B5F6',
    gradient: 'from-blue-200 to-gray-300',
    description: 'Feeling down today',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/lottie.json'
  },
  depressed: {
    name: 'Depressed',
    color: '#9575CD',
    gradient: 'from-purple-300 to-gray-400',
    description: 'Feeling very low',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    animation: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f629/lottie.json'
  }
};

// Mock data for mood history - Update to use current year and recent dates
const mockMoodHistory = [
  { date: new Date(), mood: 'overjoyed', note: 'Had an amazing day!', timeOfDay: 'Morning' },
  { date: new Date(Date.now() - 86400000), mood: 'sad', note: 'Missing home', timeOfDay: 'Evening' },
  { date: new Date(Date.now() - 86400000 * 2), mood: 'neutral', note: 'Regular day at work', timeOfDay: 'Afternoon' },
  { date: new Date(Date.now() - 86400000 * 3), mood: 'happy', note: 'Good progress on project', timeOfDay: 'Night' },
  { date: new Date(Date.now() - 86400000 * 4), mood: 'depressed', note: 'Feeling overwhelmed', timeOfDay: 'Evening' },
];

function MoodHistory() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingMood, setEditingMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState(mockMoodHistory);
  const modalRef = useRef(null);
  const listRef = useRef(null);
  const aiBoxRef = useRef(null);

  useEffect(() => {
    // Initial animations
    gsap.set('#mood-history', { opacity: 0 });
    gsap.to('#mood-history', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate list items with consistent opacity
    gsap.from('.history-item', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.2)',
      onComplete: () => {
        // Ensure all items are fully visible after animation
        gsap.set('.history-item', { opacity: 1, clearProps: 'all' });
      }
    });

    // Animate dashboard button
    gsap.to('#dashboard-btn', {
      y: [-2, 2],
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // AI suggestions box pulsing animation
    gsap.to('#ai-suggestions-box', {
      scale: 1.02,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const mood = moodHistory.find(
      m => m.date.toDateString() === date.toDateString()
    );
    if (mood) {
      setSelectedMood(mood);
      setShowInsights(true);
      // Animate modal opening with a slide-up effect
      gsap.fromTo('#mood-insight-modal',
        { 
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      );

      // Animate the emoji
      gsap.to('#mood-emoji', {
        scale: 1.2,
        rotate: 10,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(1.7)'
      });
    }
  };

  const handleEditMood = (mood) => {
    setEditingMood({...mood});
    setShowEditModal(true);
    gsap.fromTo('#edit-modal',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)' }
    );
  };

  const handleUpdateMood = (field, value) => {
    setEditingMood(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    setMoodHistory(prev => 
      prev.map(mood => 
        mood.date.toDateString() === editingMood.date.toDateString() ? editingMood : mood
      )
    );
    setShowEditModal(false);
    
    // Show success animation
    gsap.to('#mood-history', {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  };

  const handleDeleteConfirmed = () => {
    setMoodHistory(prev => 
      prev.filter(mood => mood.date.toDateString() !== editingMood.date.toDateString())
    );
    setShowDeleteConfirm(false);
    
    // Show delete animation
    gsap.to(`#mood-${editingMood.date.toDateString()}`, {
      opacity: 0,
      x: 100,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  const handleDeleteMood = (mood) => {
    setEditingMood(mood);
    setShowDeleteConfirm(true);
    gsap.fromTo('#delete-confirm',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)' }
    );
  };

  const toggleAiSuggestions = () => {
    setShowAiSuggestions(!showAiSuggestions);
    gsap.to('#ai-suggestions-content', {
      height: showAiSuggestions ? 0 : 'auto',
      duration: 0.5,
      ease: 'power2.inOut'
    });
  };

  const handleClearHistory = () => {
    // Animation for clearing history
    gsap.to('.history-item', {
      opacity: 0,
      x: 100,
      stagger: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        // Clear history logic here
      }
    });
  };

  const navigateToDashboard = () => {
    gsap.to('#mood-history', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => navigate('/dashboard')
    });
  };

  // Sort and filter logic
  const sortedAndFilteredHistory = [...moodHistory]
    .filter(item => {
      const matchesSearch = item.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = filterMood === 'all' || item.mood === filterMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date - a.date;
        case 'mood':
          return a.mood.localeCompare(b.mood);
        case 'time':
          return a.timeOfDay.localeCompare(b.timeOfDay);
        default:
          return 0;
      }
    });

  return (
    <div 
      id="mood-history"
      className="min-h-screen bg-[#FAF7F4] text-[#4F3222]"
      style={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header and Controls */}
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-4 w-full justify-between">
              <h1 className="text-3xl font-bold">Mood History</h1>
              <button
                id="dashboard-btn"
                onClick={navigateToDashboard}
                className="px-6 py-2.5 rounded-full bg-[#4F3222] text-white hover:bg-[#3D2516] transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Dashboard
              </button>
            </div>
            <div className="flex gap-4 w-full">
              <input
                type="text"
                placeholder="Search moods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-full bg-white border border-[#4F3222]/20 focus:outline-none focus:ring-2 focus:ring-[#4F3222] shadow-sm"
              />
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-4 py-2 rounded-full bg-white border border-[#4F3222]/20 focus:outline-none focus:ring-2 focus:ring-[#4F3222] shadow-sm"
              >
                <option value="all">All Moods</option>
                {Object.entries(moodConfigs).map(([key, mood]) => (
                  <option key={key} value={key}>
                    {mood.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full bg-white border border-[#4F3222]/20 focus:outline-none focus:ring-2 focus:ring-[#4F3222] shadow-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="mood">Sort by Mood</option>
                <option value="time">Sort by Time of Day</option>
              </select>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              tileClassName={({ date }) => {
                const mood = mockMoodHistory.find(
                  m => m.date.toDateString() === date.toDateString()
                );
                return mood ? `mood-${mood.mood}` : '';
              }}
              className="w-full rounded-xl border-none"
            />
          </div>

          {/* History List Section */}
          <div 
            ref={listRef}
            className="bg-[#F9F6F2] rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
            <div className="space-y-3">
              {sortedAndFilteredHistory.map((item, index) => (
                <div
                  key={index}
                  id={`mood-${item.date.toDateString()}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 history-item"
                  style={{ backgroundColor: 'white', opacity: 1 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <MoodEmoji 
                      mood={item.mood}
                      moodConfig={moodConfigs[item.mood]}
                      size={48}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#4F3222]">{item.date.toLocaleDateString()}</p>
                          <span className="text-sm text-[#4F3222]">•</span>
                          <p className="text-sm text-[#4F3222]">{item.timeOfDay}</p>
                        </div>
                        <p className="text-sm mt-1 text-[#4F3222]">{item.note}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditMood(item)}
                          className="p-2 hover:bg-[#F9F6F2] rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteMood(item)}
                          className="p-2 hover:bg-[#F9F6F2] rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions Box */}
        <div
          id="ai-suggestions-box"
          className="mt-8 bg-white p-6 rounded-2xl shadow-lg cursor-pointer"
          onClick={toggleAiSuggestions}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI Mood Analysis</h2>
            <span className="text-2xl">{showAiSuggestions ? '↑' : '↓'}</span>
          </div>
          <div
            id="ai-suggestions-content"
            className="overflow-hidden"
            style={{ height: 0 }}
          >
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <p className="text-[#4F3222]/70">AI is analyzing your mood patterns...</p>
              </div>
              <div className="bg-[#FAF7F4] p-4 rounded-xl">
                <p className="text-sm">Based on your recent moods, you tend to feel more energetic in the mornings. Consider scheduling important tasks during this time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Insights Modal */}
        {showInsights && selectedMood && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div
              id="mood-insight-modal"
              className="bg-white p-8 rounded-2xl max-w-lg w-full mx-4 shadow-xl relative"
              style={{ zIndex: 51 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#4F3222]">Mood Details</h2>
                <button
                  onClick={() => setShowInsights(false)}
                  className="text-[#4F3222]/70 hover:text-[#4F3222] text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div 
                  id="mood-emoji"
                  className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg bg-white"
                  style={{ 
                    boxShadow: `0 0 20px ${moodConfigs[selectedMood.mood].color}40`
                  }}
                >
                  <MoodEmoji 
                    mood={selectedMood.mood}
                    moodConfig={moodConfigs[selectedMood.mood]}
                    size={128}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2 text-[#4F3222]">
                    {moodConfigs[selectedMood.mood].name}
                  </h3>
                  <p className="text-[#4F3222]/70 text-lg mb-2">{selectedMood.note}</p>
                  <p className="text-sm text-[#4F3222]/50">
                    {selectedMood.date.toLocaleDateString()} • {selectedMood.timeOfDay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mood Modal */}
        {showEditModal && editingMood && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              id="edit-modal"
              className="bg-white p-8 rounded-2xl max-w-lg w-full mx-4 shadow-xl relative"
              style={{ zIndex: 51 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#4F3222]">Edit Mood</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-[#4F3222] hover:text-[#4F3222]/70 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4F3222]">Mood</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(moodConfigs).map(([key, mood]) => (
                      <button
                        key={key}
                        onClick={() => handleUpdateMood('mood', key)}
                        className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          editingMood.mood === key ? 'bg-[#4F3222]/10 shadow-inner' : 'hover:bg-[#4F3222]/5'
                        }`}
                      >
                        <div className="w-10 h-10">
                          <MoodEmoji 
                            mood={key}
                            moodConfig={mood}
                            size={40}
                          />
                        </div>
                        <span className="text-xs text-[#4F3222]">{mood.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4F3222]">Time of Day</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-[#4F3222]/20 focus:outline-none focus:ring-2 focus:ring-[#4F3222] bg-white text-[#4F3222]"
                    value={editingMood.timeOfDay}
                    onChange={(e) => handleUpdateMood('timeOfDay', e.target.value)}
                  >
                    {moodConfigs[editingMood.mood].timeOfDay.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#4F3222]">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-xl border border-[#4F3222]/20 focus:outline-none focus:ring-2 focus:ring-[#4F3222] min-h-[100px] bg-white text-[#4F3222]"
                    value={editingMood.note}
                    onChange={(e) => handleUpdateMood('note', e.target.value)}
                    placeholder="How are you feeling?"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 rounded-full hover:bg-[#4F3222]/10 transition-colors text-[#4F3222]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 rounded-full bg-[#563C26] text-white hover:bg-[#3D2516] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              id="delete-confirm"
              className="bg-white p-8 rounded-2xl max-w-md w-full mx-4 shadow-xl relative"
              style={{ zIndex: 51 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-[#4F3222]">Delete Mood Entry?</h2>
              <p className="text-[#4F3222]/70 mb-6">
                Are you sure you want to delete this mood entry? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 rounded-full hover:bg-[#4F3222]/10 transition-colors text-[#4F3222]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          id="add-mood-btn"
          onClick={() => navigate('/mood/depressed')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#4F3222] text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#3D2516] transition-all hover:scale-110"
        >
          +
        </button>
      </div>

      {/* Custom styles for calendar */}
      <style>{`
        .react-calendar {
          width: 100% !important;
          background: transparent;
          border: none;
          font-family: inherit;
          padding: 1rem;
        }
        .react-calendar__navigation {
          margin-bottom: 1.5rem;
        }
        .react-calendar__navigation button {
          font-size: 1.1rem;
          color: #4F3222;
          font-weight: 500;
        }
        .react-calendar__month-view__weekdays {
          font-weight: 600;
          color: #4F3222;
          margin-bottom: 0.5rem;
        }
        .react-calendar__tile {
          padding: 1.5em 0.5em;
          position: relative;
          z-index: 1;
          margin: 4px;
          border-radius: 9999px;
          font-weight: 500;
          color: #4F3222;
        }
        .react-calendar__tile--active {
          background: transparent !important;
          color: #4F3222 !important;
          font-weight: 600;
        }
        .react-calendar__tile--now {
          background: transparent;
          position: relative;
        }
        .react-calendar__tile--now::before {
          content: '';
          position: absolute;
          inset: 2px;
          border: 2px solid #4F3222;
          border-radius: 9999px;
          opacity: 0.3;
        }
        .react-calendar button {
          color: #4F3222;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #E57373;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #4F322210;
        }
        ${Object.entries(moodConfigs).map(([key, mood]) => `
          .mood-${key}::after {
            content: '';
            position: absolute;
            inset: 2px;
            border: 3px solid ${mood.color};
            border-radius: 9999px;
            z-index: -1;
            box-shadow: 0 0 12px ${mood.color}40;
            transition: all 0.3s ease;
          }
          .mood-${key}:hover::after {
            box-shadow: 0 0 16px ${mood.color}60;
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}

export default MoodHistory; 