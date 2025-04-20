const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { ensureAuth } = require('../middleware/auth.middleware');
const { spawn } = require('child_process');
const path = require('path');
const moodAnalysis = require('../services/moodAnalysis');
const Mood = require('../models/Mood');

// Apply authentication middleware to all mood routes
router.use(ensureAuth);

// @route   GET /api/moods
// @desc    Get all mood entries for current user
// @access  Private
router.get('/', moodController.getMoods);

// @route   POST /api/moods
// @desc    Create a new mood entry
// @access  Private
router.post('/', moodController.createMood);

// @route   GET /api/moods/history
// @desc    Get mood history formatted for calendar view
// @access  Private
router.get('/history', moodController.getMoodHistory);

// @route   GET /api/moods/analysis
// @desc    Get mood analysis with fallback that doesn't depend on OpenAI
// @access  Private
router.get('/analysis', async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching mood analysis for user ID:', userId);
    
    const moodHistory = await Mood.find({ user: userId }).sort({ date: -1 }).limit(30);
    console.log(`Found ${moodHistory.length} mood entries for analysis`);
    
    if (!moodHistory || moodHistory.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          status: 'No Data',
          suggestions: ['Start tracking your mood daily', 'Record your mood at different times', 'Add notes to your entries'],
          monthlySummary: 'Start tracking your moods to receive insights.',
          predictedTrend: 'Insufficient data',
          lastUpdated: new Date().toISOString()
        }
      });
    }
    
    const moodCounts = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
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
      const positiveCount = (moodCounts['happy'] || 0) + (moodCounts['overjoyed'] || 0);
      summary += `You've had ${positiveCount} positive mood entries. `;
    }
    
    if (moodCounts['sad'] > 0 || moodCounts['depressed'] > 0) {
      const negativeCount = (moodCounts['sad'] || 0) + (moodCounts['depressed'] || 0);
      summary += `You've recorded ${negativeCount} instances of negative mood. `;
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
    
    return res.status(200).json({
      success: true,
      data: {
        status: trendText,
        suggestions: suggestions.slice(0, 5),
        monthlySummary: summary,
        predictedTrend: trendText,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating mood analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// @route   POST /api/moods/populate-mock-data
// @desc    Populate mock mood data for testing
// @access  Private
router.post('/populate-mock-data', async (req, res) => {
  try {
    const userId = req.user._id;
    const scriptPath = path.join(__dirname, '../scripts/populateMockMoods.js');
    
    const process = spawn('node', [scriptPath, userId]);
    
    process.stdout.on('data', (data) => {
      console.log(`Mock data script output: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`Mock data script error: ${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        res.json({ message: 'Mock mood data populated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to populate mock data' });
      }
    });
  } catch (error) {
    console.error('Error running mock data script:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug route to test OpenAI integration
// Important: Place specific routes before parameter routes!
router.get('/test-openai', async (req, res) => {
  try {
    // Simple test data - this will work even without DB access
    const testData = [
      { date: new Date('2025-04-01'), mood: 'happy', note: 'Test note 1' },
      { date: new Date('2025-04-02'), mood: 'sad', note: 'Test note 2' },
      { date: new Date('2025-04-03'), mood: 'neutral', note: 'Test note 3' }
    ];
    
    // Check if we have the OpenAI API key configured
    console.log('Testing OpenAI connection with API key:', 
      process.env.OPENAI_API_KEY ? 
      `${process.env.OPENAI_API_KEY.substring(0, 5)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)}` : 
      'NOT CONFIGURED');
    
    // Test the OpenAI integration with minimal data
    try {
      const summary = await moodAnalysis.generateMonthlySummary(testData);
      
      res.json({
        success: true,
        openaiTest: summary,
        apiKeyConfigured: !!process.env.OPENAI_API_KEY
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      res.status(500).json({
        success: false,
        error: 'OpenAI API error',
        message: openaiError.message,
        openaiErrorDetails: openaiError.response?.data || 'No error details',
        apiKeyConfigured: !!process.env.OPENAI_API_KEY
      });
    }
  } catch (error) {
    console.error('Error in OpenAI test route:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in OpenAI test',
      message: error.message
    });
  }
});

// @route   GET /api/moods/:id
// @desc    Get a single mood entry by ID
// @access  Private
router.get('/:id', moodController.getMoodById);

// @route   PUT /api/moods/:id
// @desc    Update a mood entry
// @access  Private
router.put('/:id', moodController.updateMood);

// @route   DELETE /api/moods/:id
// @desc    Delete a mood entry
// @access  Private
router.delete('/:id', moodController.deleteMood);

module.exports = router;
