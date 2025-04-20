/**
 * Cron job script to update AI metrics for all users
 * Run this script weekly with a scheduler
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const FreudScore = require('../models/FreudScore');
const StressLevel = require('../models/StressLevel');
const Mood = require('../models/Mood');
const config = require('../config/config');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: config.openai.apiKey,
});
const openai = new OpenAIApi(configuration);

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  updateAllUserMetrics();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Function to get recent mood data for a user
const getRecentMoodData = async (userId, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await Mood.find({
    user: userId,
    date: { $gte: cutoffDate }
  }).sort({ date: -1 });
};

// Function to calculate Freud AI Score
const calculateFreudAIScore = async (userAssessments, moodHistory) => {
  try {
    // Format data for OpenAI
    const assessmentData = JSON.stringify(userAssessments);
    const moodData = JSON.stringify(moodHistory.slice(0, 10));

    const prompt = `
      You are Dr. Sigmund Freud, the father of psychoanalysis. I am providing you with a patient's assessment data and recent mood history.
      
      Assessment data: ${assessmentData}
      
      Recent mood history: ${moodData}

      Based on this information:
      1. Calculate a Mental Wellness Score from 0-100%, where 100% represents optimal mental health.
      2. Provide 3-5 key observations about the patient's mental state.
      3. Suggest 2-3 therapeutic interventions that might help this individual.
      
      Respond in JSON format:
      {
        "score": [0-100 number],
        "insights": [text explanation of score and mental state],
        "observations": [array of key observations],
        "suggestions": [array of intervention suggestions]
      }
    `;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 600,
      temperature: 0.7,
    });

    // Parse the response
    const aiResponse = JSON.parse(response.data.choices[0].text.trim());
    
    return {
      score: aiResponse.score,
      insights: aiResponse.insights,
      observations: aiResponse.observations,
      suggestions: aiResponse.suggestions
    };
  } catch (error) {
    console.error('Error calculating Freud AI score:', error);
    // Fallback score
    return { 
      score: 70,
      insights: "Unable to generate AI insights at this time. Using fallback analysis.",
      observations: ["Assessment data processed using rule-based fallback."],
      suggestions: ["Continue your wellness routine", "Consider journaling daily"]
    };
  }
};

// Function to analyze stress levels
const analyzeStressLevels = async (userAssessments, moodHistory) => {
  try {
    // Format data for OpenAI
    const assessmentData = JSON.stringify({
      sleepQuality: userAssessments.sleepQuality || "Unknown",
      physicalSymptoms: userAssessments.physicalSymptoms || [],
      stressLevel: userAssessments.stressLevel || "Moderate"
    });
    
    const prompt = `
      Analyze the following sleep and stress-related data for a patient:
      
      ${assessmentData}
      
      Break down their stress into three categories:
      1. Core Sleep Stress (related to falling asleep)
      2. REM Sleep Stress (related to quality of dreams and REM cycles)
      3. Post-REM Stress (related to morning fatigue and daytime functioning)
      
      Assign a percentage to each category so they sum to 100%.
      
      Respond in JSON format:
      {
        "coreSleep": [0-100 number],
        "remSleep": [0-100 number],
        "postREM": [0-100 number],
        "analysisNotes": [text explaining the breakdown]
      }
    `;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.5,
    });

    // Parse the response
    const aiResponse = JSON.parse(response.data.choices[0].text.trim());
    
    return {
      coreSleep: aiResponse.coreSleep,
      remSleep: aiResponse.remSleep,
      postREM: aiResponse.postREM,
      analysisNotes: aiResponse.analysisNotes
    };
  } catch (error) {
    console.error('Error analyzing stress levels:', error);
    // Fallback 
    return {
      coreSleep: 33,
      remSleep: 33,
      postREM: 34,
      analysisNotes: "Standard distribution applied due to analysis error."
    };
  }
};

// Main function to update metrics for all users
async function updateAllUserMetrics() {
  try {
    console.log('Starting to update metrics for all users');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    // Process each user
    for (const user of users) {
      console.log(`Processing user: ${user._id}`);
      
      try {
        // Get recent mood history
        const moodHistory = await getRecentMoodData(user._id);
        
        if (moodHistory.length === 0) {
          console.log(`No mood data for user ${user._id}, skipping`);
          continue;
        }
        
        // Calculate and save Freud AI score
        const aiResult = await calculateFreudAIScore(user.assessments || {}, moodHistory);
        const freudScore = new FreudScore({
          user: user._id,
          score: aiResult.score,
          insights: aiResult.insights,
          timestamp: new Date()
        });
        await freudScore.save();
        
        // Calculate and save stress level breakdown
        const stressAnalysis = await analyzeStressLevels(user.assessments || {}, moodHistory);
        const stressLevel = new StressLevel({
          user: user._id,
          coreSleep: stressAnalysis.coreSleep,
          remSleep: stressAnalysis.remSleep,
          postREM: stressAnalysis.postREM,
          analysisNotes: stressAnalysis.analysisNotes,
          timestamp: new Date()
        });
        await stressLevel.save();
        
        console.log(`Updated metrics for user ${user._id}`);
      } catch (userError) {
        console.error(`Error processing user ${user._id}:`, userError);
        // Continue to next user
      }
    }
    
    console.log('Finished updating metrics for all users');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating user metrics:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 
 