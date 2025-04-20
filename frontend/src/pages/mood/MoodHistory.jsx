import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import axios from 'axios';

const moodConfigs = {
  overjoyed: {
    name: 'Overjoyed',
    color: '#FFB74D',
    gradient: 'from-yellow-200 to-orange-300',
    description: 'Feeling amazing and energetic!',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    emoji: '😄',
    textColor: 'text-yellow-400',
    buttonColor: 'bg-yellow-500',
    index: 1
  },
  happy: {
    name: 'Happy',
    color: '#81C784',
    gradient: 'from-green-200 to-yellow-200',
    description: 'Feeling good and positive',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    emoji: '😊',
    textColor: 'text-green-400',
    buttonColor: 'bg-green-500',
    index: 2
  },
  neutral: {
    name: 'Neutral',
    color: '#90A4AE',
    gradient: 'from-gray-200 to-blue-200',
    description: 'Feeling okay',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    emoji: '😐',
    textColor: 'text-gray-400',
    buttonColor: 'bg-gray-500',
    index: 3
  },
  sad: {
    name: 'Sad',
    color: '#64B5F6',
    gradient: 'from-blue-200 to-gray-300',
    description: 'Feeling down today',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    emoji: '😢',
    textColor: 'text-blue-400',
    buttonColor: 'bg-blue-500',
    index: 4
  },
  depressed: {
    name: 'Depressed',
    color: '#9575CD',
    gradient: 'from-purple-300 to-gray-400',
    description: 'Feeling very low',
    timeOfDay: ['Morning', 'Afternoon', 'Evening', 'Night'],
    emoji: '😔',
    textColor: 'text-purple-400',
    buttonColor: 'bg-purple-500',
    index: 5
  }
};

function MoodHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startFetching, hideLoading, showError } = useLoading();
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current date info
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  // State for calendar navigation
  const [displayYear, setDisplayYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState(currentMonth);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      setLoading(true);
      startFetching("Loading your mood history...");
      
      const response = await axios.get('http://localhost:5000/api/moods/history', {
        withCredentials: true
      });
      
      // Ensure response.data is an array
      const moodData = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched mood data:', moodData);
      
      // Debug - check the date format in the response
      if (moodData.length > 0) {
        console.log('First entry date:', moodData[0].date);
        console.log('Date object:', new Date(moodData[0].date));
        console.log('Date components:', {
          year: new Date(moodData[0].date).getFullYear(),
          month: new Date(moodData[0].date).getMonth(),
          day: new Date(moodData[0].date).getDate()
        });
      }
      
      setMoodHistory(moodData);
      hideLoading();
    } catch (error) {
      console.error('Error fetching mood history:', error);
      setError('Failed to load mood history. Please try again later.');
      showError('Failed to load mood history');
      setMoodHistory([]); // Reset to empty array on error
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const handleBack = () => {
    navigate('/mood-tracker');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const goToToday = () => {
    setDisplayYear(currentYear);
    setDisplayMonth(currentMonth);
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a date has a mood entry, with timezone safety
  const hasMoodEntry = (date) => {
    if (!Array.isArray(moodHistory) || moodHistory.length === 0) return false;
    
    return moodHistory.some(entry => {
      // Get date components from the entry
      const entryDate = new Date(entry.date);
      
      // Create a date string in yyyy-mm-dd format for easier comparison
      // This normalizes the date without time components
      const entryDateStr = `${entryDate.getFullYear()}-${String(entryDate.getMonth()).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
      const calendarDateStr = `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      
      // Primary comparison using date string equality
      const directMatch = entryDateStr === calendarDateStr;
      
      // Alternative comparison using individual components
      const componentMatch = 
        entryDate.getDate() === date &&
        entryDate.getMonth() === displayMonth &&
        entryDate.getFullYear() === displayYear;
      
      // Use either method (they should be equivalent)
      return directMatch || componentMatch;
    });
  };

  // Get mood for a specific date, with timezone safety
  const getMoodForDate = (date) => {
    if (!Array.isArray(moodHistory) || moodHistory.length === 0) return null;
    
    // Create target date string for searching
    const targetDateStr = `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    // Find matching entry
    return moodHistory.find(entry => {
      // Get date components from the entry
      const entryDate = new Date(entry.date);
      
      // Create entry date string in yyyy-mm-dd format
      const entryDateStr = `${entryDate.getFullYear()}-${String(entryDate.getMonth()).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
      
      // Primary comparison using date string equality
      const directMatch = entryDateStr === targetDateStr;
      
      // Alternative comparison using individual components
      const componentMatch = 
        entryDate.getDate() === date &&
        entryDate.getMonth() === displayMonth &&
        entryDate.getFullYear() === displayYear;
      
      // Use either method (they should be equivalent)
      return directMatch || componentMatch;
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    const moodEntry = getMoodForDate(date);
    if (moodEntry) {
      setSelectedDate({
        date: new Date(displayYear, displayMonth, date),
        mood: moodEntry
      });
    } else {
      setSelectedDate(null);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDayOfMonth = getFirstDayOfMonth(displayYear, displayMonth);
    const days = [];
    
    // Debug log
    console.log(`Generating calendar for ${getMonthName(displayMonth)} ${displayYear}`);
    console.log(`Total mood entries: ${moodHistory?.length || 0}`);
    
    // Sample some entries for the current month to check format
    if (Array.isArray(moodHistory) && moodHistory.length > 0) {
      const entriesForCurrentMonth = moodHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === displayMonth && 
               entryDate.getFullYear() === displayYear;
      });
      
      console.log(`Found ${entriesForCurrentMonth.length} entries for current month`);
      
      if (entriesForCurrentMonth.length > 0) {
        console.log('Sample entries for current month:', 
          entriesForCurrentMonth.slice(0, 3).map(entry => ({
            date: new Date(entry.date).toLocaleDateString(),
            dayOfMonth: new Date(entry.date).getDate(),
            mood: entry.mood,
            timeOfDay: entry.timeOfDay
          }))
        );
      }
    }
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-800 rounded"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        i === currentDate && 
        displayMonth === currentMonth && 
        displayYear === currentYear;
      
      const hasEntry = hasMoodEntry(i);
      const moodEntry = hasEntry ? getMoodForDate(i) : null;
      const moodConfig = moodEntry ? moodConfigs[moodEntry.mood] : null;
      
      // Additional debug log for a specific day
      if (displayMonth === 0 && displayYear === 2025 && i === 15) {
        console.log('Jan 15, 2025 rendering:', {
          hasEntry,
          moodEntry,
          moodConfig
        });
      }
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`h-24 border border-gray-700 p-2 cursor-pointer transition-all rounded ${
            isToday ? 'bg-blue-900' : 'bg-gray-800'
          } ${
            hasEntry ? 'hover:bg-gray-700' : ''
          } ${
            selectedDate && selectedDate.date.getDate() === i ? 'ring-2 ring-blue-500 bg-gray-700' : ''
          }`}
          onClick={() => handleDateSelect(i)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm ${isToday ? 'font-bold text-blue-400' : 'text-white'}`}>
              {i}
            </span>
            {hasEntry && moodConfig && (
              <span className="text-xl" title={moodConfig.name}>
                {moodConfig.emoji}
              </span>
            )}
            </div>
          {hasEntry && moodEntry && (
            <div className="mt-1 text-xs text-white">
              {moodEntry.timeOfDay}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-6xl mx-auto flex flex-col h-full p-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
          >
            ←
                        </button>
          <h1 className="text-2xl font-bold">Mood History</h1>
                        <button
            onClick={handleGoToDashboard}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
          >
            Dashboard →
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-100 px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-white">Loading your mood history...</div>
              </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="md:col-span-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {getMonthName(displayMonth)} {displayYear}
                </h2>
                <div className="flex gap-2">
                      <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-full bg-[#2D2D2D] hover:bg-[#3D3D3D] transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 transition-all text-white"
                  >
                    Today
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full bg-[#2D2D2D] hover:bg-[#3D3D3D] transition-all"
                  >
                    →
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Weekday headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm text-white py-2 font-medium">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {generateCalendarDays()}
              </div>
            </div>
            
            {/* Mood Details Section */}
            <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-4 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Mood Details</h2>
              
              {selectedDate ? (
                <div className="space-y-4">
                  <div className="text-lg">
                    <span className="text-white">Date: </span>
                    <span className="text-white">{selectedDate.date.toLocaleDateString()}</span>
                  </div>
                  
                  {selectedDate.mood && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-white">Mood: </span>
                        <span className={`text-xl ${moodConfigs[selectedDate.mood.mood]?.textColor || 'text-white'}`}>
                          {moodConfigs[selectedDate.mood.mood]?.name || selectedDate.mood.mood}
                        </span>
                        <span className="text-2xl">
                          {moodConfigs[selectedDate.mood.mood]?.emoji || '😐'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-white">Time of Day: </span>
                        <span className="text-white">{selectedDate.mood.timeOfDay}</span>
                      </div>
                      
                      {selectedDate.mood.note && (
                        <div>
                          <span className="text-white">Note: </span>
                          <p className="mt-1 text-white">{selectedDate.mood.note}</p>
          </div>
        )}

                      <div>
                        <span className="text-white">Recorded: </span>
                        <span className="text-white">{new Date(selectedDate.mood.date).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-white text-center py-8">
                  Select a date with a mood entry to see details
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodHistory; 