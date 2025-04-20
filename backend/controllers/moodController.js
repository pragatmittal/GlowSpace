const Mood = require('../models/Mood');
const moodAnalysis = require('../services/moodAnalysis');

// Basic CRUD Operations

/**
 * Create a new mood entry
 * @route POST /api/moods
 * @access Private
 */
exports.createMood = async (req, res) => {
  try {
    const { mood, timeOfDay, note } = req.body;
    const userId = req.user._id;

    const newMood = new Mood({
      user: userId,
      mood,
      timeOfDay,
      note,
      date: new Date()
    });

    await newMood.save();

    // Get updated mood history for analysis
    const moodHistory = await Mood.find({ user: userId })
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    // Generate AI analysis
    const analysis = await moodAnalysis.analyzeAll(moodHistory);

    res.status(201).json({
      success: true,
      data: newMood,
      analysis
    });
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating mood entry'
    });
  }
};

/**
 * Get all mood entries for the current user
 * @route GET /api/moods
 * @access Private
 */
exports.getMoods = async (req, res) => {
  try {
    // Find all moods for the current user, sorted by date (newest first)
    const moods = await Mood.find({ user: req.user._id })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Get a single mood entry by ID
 * @route GET /api/moods/:id
 * @access Private
 */
exports.getMoodById = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    
    // Check if mood exists
    if (!mood) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }
    
    // Check if the mood belongs to the current user
    if (mood.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this mood entry'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mood
    });
  } catch (error) {
    console.error('Error fetching mood entry:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Update a mood entry
 * @route PUT /api/moods/:id
 * @access Private
 */
exports.updateMood = async (req, res) => {
  try {
    const { mood, note, timeOfDay, metadata } = req.body;
    
    // Find the mood entry
    let moodEntry = await Mood.findById(req.params.id);
    
    // Check if mood exists
    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }
    
    // Check if the mood belongs to the current user
    if (moodEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this mood entry'
      });
    }
    
    // Update the mood entry
    moodEntry = await Mood.findByIdAndUpdate(
      req.params.id,
      {
        mood: mood || moodEntry.mood,
        note: note || moodEntry.note,
        timeOfDay: timeOfDay || moodEntry.timeOfDay,
        metadata: metadata || moodEntry.metadata
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Delete a mood entry
 * @route DELETE /api/moods/:id
 * @access Private
 */
exports.deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const mood = await Mood.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    // Get updated mood history and analysis after deletion
    const moodHistory = await Mood.find({ user: userId })
      .sort({ date: -1 })
      .limit(30);

    const analysis = await moodAnalysis.analyzeAll(moodHistory);

    res.status(200).json({
      success: true,
      data: mood,
      analysis
    });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting mood entry'
    });
  }
};

/**
 * Get mood history formatted for calendar view
 * @route GET /api/moods/history
 * @access Private
 */
exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching mood history for user ID:', userId);
    
    const moodHistory = await Mood.find({ user: userId })
      .sort({ date: -1 });
    
    console.log(`Found ${moodHistory.length} mood entries for history display`);
    
    // Add debug logging for the first few entries
    if (moodHistory.length > 0) {
      console.log('First 3 entries (or fewer if less available):');
      const sampleSize = Math.min(3, moodHistory.length);
      for (let i = 0; i < sampleSize; i++) {
        const entry = moodHistory[i];
        const entryDate = new Date(entry.date);
        console.log(`Entry ${i+1}:`, {
          id: entry._id,
          mood: entry.mood,
          date: entry.date,
          dateComponents: {
            year: entryDate.getFullYear(),
            month: entryDate.getMonth(),
            day: entryDate.getDate(),
            hours: entryDate.getHours(),
            minutes: entryDate.getMinutes()
          },
          timeOfDay: entry.timeOfDay,
          note: entry.note ? entry.note.substring(0, 20) + '...' : '(no note)'
        });
      }
    }

    res.status(200).json(moodHistory);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching mood history'
    });
  }
};

/**
 * Get AI-powered mood analytics for current user
 * @route GET /api/moods/analysis
 * @access Private
 */
exports.getMoodAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching mood analysis for user ID:', userId);
    
    // Find all moods for the current user, sorted by date (newest first)
    const moodHistory = await Mood.find({ user: userId })
      .sort({ date: -1 })
      .limit(30); // Last 30 days
    
    console.log(`Found ${moodHistory.length} mood entries for analysis`);
    
    // If no mood entries found, return default response
    if (!moodHistory || moodHistory.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          status: 'No Data',
          suggestions: [
            'Start tracking your mood daily',
            'Record your mood at different times of day',
            'Add notes to provide context for your emotions'
          ],
          monthlySummary: 'Start tracking your moods to receive personalized insights.',
          predictedTrend: 'Insufficient data',
          lastUpdated: new Date().toISOString()
        }
      });
    }
    
    try {
      console.log('Attempting to generate AI analysis...');
      // Try to get AI-powered analysis
      const analysis = await moodAnalysis.analyzeAll(moodHistory);
      
      console.log('AI analysis generated successfully');
      return res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (aiError) {
      // Log the AI error
      console.error('Error with AI analysis:', aiError);
      
      // Generate fallback analysis without OpenAI
      console.log('Generating fallback analysis without OpenAI...');
      
      // Simple analysis of mood frequency
      const moodCounts = {};
      moodHistory.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });
      
      // Find most common mood
      let mostCommonMood = 'neutral';
      let highestCount = 0;
      Object.keys(moodCounts).forEach(mood => {
        if (moodCounts[mood] > highestCount) {
          highestCount = moodCounts[mood];
          mostCommonMood = mood;
        }
      });
      
      // Calculate simple trend
      const oldestMood = moodHistory[moodHistory.length - 1].mood;
      const newestMood = moodHistory[0].mood;
      const moodValues = {
        'overjoyed': 5,
        'happy': 4,
        'neutral': 3,
        'sad': 2,
        'depressed': 1,
        'anxious': 2,
        'calm': 4,
        'angry': 2,
        'excited': 4
      };
      
      const oldestValue = moodValues[oldestMood] || 3;
      const newestValue = moodValues[newestMood] || 3;
      let trendText = 'Stable';
      
      if (newestValue > oldestValue + 0.5) {
        trendText = 'Improving';
      } else if (newestValue < oldestValue - 0.5) {
        trendText = 'Declining';
      }
      
      // Generate fallback summary
      let summary = `Based on your ${moodHistory.length} mood entries, your most frequent mood has been "${mostCommonMood}". `;
      
      if (moodCounts['happy'] > 0 || moodCounts['overjoyed'] > 0) {
        summary += `You've had ${moodCounts['happy'] || 0 + moodCounts['overjoyed'] || 0} positive mood entries. `;
      }
      
      if (moodCounts['sad'] > 0 || moodCounts['depressed'] > 0) {
        summary += `You've recorded ${moodCounts['sad'] || 0 + moodCounts['depressed'] || 0} instances of negative mood. `;
      }
      
      summary += `Your overall mood trend appears to be ${trendText.toLowerCase()}.`;
      
      // Generate suggestions based on mood frequency
      const suggestions = [];
      
      if (moodCounts['sad'] > 3 || moodCounts['depressed'] > 2) {
        suggestions.push(
          'Consider physical activity to improve mood',
          'Reach out to friends or family for support',
          'Practice mindfulness or meditation daily'
        );
      } else if (moodCounts['anxious'] > 3) {
        suggestions.push(
          'Try breathing exercises when feeling anxious',
          'Limit caffeine and other stimulants',
          'Establish a calming bedtime routine'
        );
      } else if (moodCounts['angry'] > 3) {
        suggestions.push(
          'Practice anger management techniques',
          'Try physical exercise to release tension',
          'Consider journaling to identify anger triggers'
        );
      } else {
        suggestions.push(
          'Continue your current mood-supporting activities',
          'Add variety to your daily routine',
          'Share your positive experiences with others'
        );
      }
      
      // Add general wellness suggestions
      suggestions.push(
        'Maintain regular sleep patterns',
        'Stay hydrated and maintain balanced nutrition'
      );
      
      // Return fallback analysis
      const fallbackAnalysis = {
        status: trendText,
        suggestions: suggestions.slice(0, 5),
        monthlySummary: summary,
        predictedTrend: trendText,
        lastUpdated: new Date().toISOString(),
        isAIGenerated: false // Flag to indicate this is a fallback analysis
      };
      
      console.log('Fallback analysis generated successfully');
      
      return res.status(200).json({
        success: true,
        data: fallbackAnalysis
      });
    }
  } catch (error) {
    console.error('Error generating mood analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

/**
 * Analyze mood data to extract patterns and insights
 * @param {Array} moods - Array of mood entries
 * @returns {Object} Analysis results
 */
function analyzeMoodData(moods) {
  // Count mood frequencies
  const moodCounts = {};
  moods.forEach(mood => {
    moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
  });
  
  // Calculate mood percentages
  const totalMoods = moods.length;
  const moodPercentages = {};
  Object.keys(moodCounts).forEach(mood => {
    moodPercentages[mood] = (moodCounts[mood] / totalMoods) * 100;
  });
  
  // Analyze time of day patterns
  const timeOfDayCounts = {};
  moods.forEach(mood => {
    timeOfDayCounts[mood.timeOfDay] = (timeOfDayCounts[mood.timeOfDay] || 0) + 1;
  });
  
  // Calculate time of day percentages
  const timeOfDayPercentages = {};
  Object.keys(timeOfDayCounts).forEach(timeOfDay => {
    timeOfDayPercentages[timeOfDay] = (timeOfDayCounts[timeOfDay] / totalMoods) * 100;
  });
  
  // Analyze day of week patterns
  const dayOfWeekCounts = {};
  moods.forEach(mood => {
    const dayOfWeek = new Date(mood.date).getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1;
  });
  
  // Calculate day of week percentages
  const dayOfWeekPercentages = {};
  Object.keys(dayOfWeekCounts).forEach(day => {
    dayOfWeekPercentages[day] = (dayOfWeekCounts[day] / totalMoods) * 100;
  });
  
  // Analyze mood trends over time
  const moodTrends = [];
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const recentMoods = moods.filter(mood => new Date(mood.date) >= last30Days);
  
  // Group moods by date
  const moodsByDate = {};
  recentMoods.forEach(mood => {
    const dateStr = new Date(mood.date).toISOString().split('T')[0];
    if (!moodsByDate[dateStr]) {
      moodsByDate[dateStr] = [];
    }
    moodsByDate[dateStr].push(mood);
  });
  
  // Calculate average mood for each date
  Object.keys(moodsByDate).forEach(dateStr => {
    const dateMoods = moodsByDate[dateStr];
    const moodValues = {
      'overjoyed': 5,
      'happy': 4,
      'neutral': 3,
      'sad': 2,
      'depressed': 1
    };
    
    const totalValue = dateMoods.reduce((sum, mood) => sum + (moodValues[mood.mood] || 3), 0);
    const averageValue = totalValue / dateMoods.length;
    
    moodTrends.push({
      date: dateStr,
      averageMood: averageValue,
      count: dateMoods.length
    });
  });
  
  // Sort mood trends by date
  moodTrends.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    moodCounts,
    moodPercentages,
    timeOfDayCounts,
    timeOfDayPercentages,
    dayOfWeekCounts,
    dayOfWeekPercentages,
    moodTrends,
    totalMoods
  };
}

/**
 * Generate a personalized summary based on mood analysis
 * @param {Object} analysis - Analysis results
 * @returns {String} Personalized summary
 */
function generatePersonalizedSummary(analysis) {
  const { moodPercentages, timeOfDayPercentages, dayOfWeekPercentages, moodTrends } = analysis;
  
  // Determine dominant mood
  let dominantMood = 'neutral';
  let highestPercentage = 0;
  
  Object.keys(moodPercentages).forEach(mood => {
    if (moodPercentages[mood] > highestPercentage) {
      highestPercentage = moodPercentages[mood];
      dominantMood = mood;
    }
  });
  
  // Determine dominant time of day
  let dominantTimeOfDay = 'Afternoon';
  let highestTimePercentage = 0;
  
  Object.keys(timeOfDayPercentages).forEach(timeOfDay => {
    if (timeOfDayPercentages[timeOfDay] > highestTimePercentage) {
      highestTimePercentage = timeOfDayPercentages[timeOfDay];
      dominantTimeOfDay = timeOfDay;
    }
  });
  
  // Determine dominant day of week
  let dominantDayOfWeek = 'Monday';
  let highestDayPercentage = 0;
  
  Object.keys(dayOfWeekPercentages).forEach(day => {
    if (dayOfWeekPercentages[day] > highestDayPercentage) {
      highestDayPercentage = dayOfWeekPercentages[day];
      dominantDayOfWeek = day;
    }
  });
  
  // Analyze mood trends
  let trendDirection = 'stable';
  let trendDescription = '';
  
  if (moodTrends.length >= 2) {
    const firstMood = moodTrends[0].averageMood;
    const lastMood = moodTrends[moodTrends.length - 1].averageMood;
    const difference = lastMood - firstMood;
    
    if (difference > 0.5) {
      trendDirection = 'improving';
      trendDescription = 'Your mood has been improving over the past 30 days.';
    } else if (difference < -0.5) {
      trendDirection = 'declining';
      trendDescription = 'Your mood has been declining over the past 30 days.';
    } else {
      trendDirection = 'stable';
      trendDescription = 'Your mood has been relatively stable over the past 30 days.';
    }
  }
  
  // Generate summary
  let summary = `Based on your mood tracking data, you tend to feel ${dominantMood} most of the time. `;
  summary += `You're most likely to track your mood during the ${dominantTimeOfDay.toLowerCase()}, `;
  summary += `and ${dominantDayOfWeek.toLowerCase()}s seem to be your most active tracking day. `;
  
  if (trendDescription) {
    summary += trendDescription;
  }
  
  return summary;
}

/**
 * Generate personalized recommendations based on mood analysis
 * @param {Object} analysis - Analysis results
 * @returns {Array} Array of recommendations
 */
function generateRecommendations(analysis) {
  const { moodPercentages, timeOfDayPercentages, dayOfWeekPercentages, moodTrends } = analysis;
  const recommendations = [];
  
  // Check if user is tracking moods regularly
  if (analysis.totalMoods < 10) {
    recommendations.push('Try to track your mood more regularly to get better insights.');
  }
  
  // Check if user is tracking at different times of day
  const timeOfDayCount = Object.keys(timeOfDayPercentages).length;
  if (timeOfDayCount < 3) {
    recommendations.push('Consider tracking your mood at different times of day to get a more complete picture.');
  }
  
  // Check if user has a lot of negative moods
  const negativeMoodPercentage = (moodPercentages['sad'] || 0) + (moodPercentages['depressed'] || 0);
  if (negativeMoodPercentage > 30) {
    recommendations.push('You seem to experience negative moods frequently. Consider talking to a mental health professional.');
  }
  
  // Check if mood is declining
  if (moodTrends.length >= 2) {
    const firstMood = moodTrends[0].averageMood;
    const lastMood = moodTrends[moodTrends.length - 1].averageMood;
    
    if (lastMood < firstMood) {
      recommendations.push('Your mood has been declining. Consider practicing self-care activities or talking to someone you trust.');
    }
  }
  
  // Add general recommendations
  recommendations.push('Try to get regular exercise, which can help improve your mood.');
  recommendations.push('Practice mindfulness or meditation to help manage stress and improve emotional well-being.');
  recommendations.push('Ensure you\'re getting enough sleep, as sleep quality can significantly impact mood.');
  
  return recommendations;
}