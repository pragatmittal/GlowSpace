const OpenAI = require('openai');

// Initialize OpenAI with error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error.message);
  // Create a mock OpenAI instance for development
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{
            message: {
              content: "AI analysis is currently unavailable. Please check your API configuration."
            }
          }]
        })
      }
    }
  };
}

// Mood scores for analysis
const moodScores = {
  'overjoyed': 5,
  'happy': 4,
  'neutral': 3,
  'sad': 2,
  'depressed': 1
};

class MoodAnalysisService {
  // Convert mood data to numerical sequences
  preprocessMoodData(moodHistory) {
    return moodHistory.map(entry => moodScores[entry.mood] || 3);
  }

  // Analyze emotional well-being status
  analyzeWellbeingStatus(moodHistory) {
    if (!moodHistory || moodHistory.length < 2) return 'Insufficient data';

    const scores = this.preprocessMoodData(moodHistory);
    const recentScores = scores.slice(-7); // Last 7 days
    
    const average = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const trend = recentScores[recentScores.length - 1] - recentScores[0];

    if (Math.abs(trend) < 0.5) return 'Stable';
    return trend > 0 ? 'Improving' : 'Declining';
  }

  // Generate improvement suggestions based on patterns
  generateSuggestions(moodHistory) {
    if (!moodHistory || moodHistory.length === 0) {
      return ["Start tracking your mood regularly to receive personalized suggestions."];
    }
    
    const suggestions = [];
    const scores = this.preprocessMoodData(moodHistory);
    
    // Get data from the last 14 days for more relevant recent suggestions
    const recentScores = scores.slice(-14);
    const recentAverage = recentScores.length > 0 
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length 
      : 3;

    // Add suggestions based on recent average mood
    if (recentAverage < 2.5) {
      suggestions.push("Consider speaking with a mental health professional about your persistent low mood.");
      suggestions.push("Try incorporating more physical activity into your daily routine.");
    } else if (recentAverage < 3.5) {
      suggestions.push("Practice mindfulness meditation for at least 10 minutes daily.");
      suggestions.push("Maintain a regular sleep schedule to improve mood stability.");
    }

    // Add suggestions based on patterns
    const patterns = this.detectIrregularPatterns(scores);
    if (patterns.hasIrregularSleep) {
      suggestions.push("Establish a consistent sleep routine to improve mood regulation.");
    }
    if (patterns.hasStressPeaks) {
      suggestions.push("Practice stress management techniques like deep breathing exercises.");
    }

    return suggestions.length > 0 ? suggestions : ["Keep up the good work! Your mood patterns look healthy."];
  }

  // Detect irregular patterns in mood data
  detectIrregularPatterns(scores) {
    const patterns = {
      hasIrregularSleep: false,
      hasStressPeaks: false
    };

    // Check for irregular sleep patterns (mood swings between morning and evening)
    for (let i = 1; i < scores.length; i++) {
      if (Math.abs(scores[i] - scores[i-1]) > 2) {
        patterns.hasIrregularSleep = true;
        break;
      }
    }

    // Check for stress peaks (sudden drops in mood)
    for (let i = 2; i < scores.length; i++) {
      if (scores[i] < scores[i-1] && scores[i-1] < scores[i-2]) {
        patterns.hasStressPeaks = true;
        break;
      }
    }

    return patterns;
  }

  // Generate monthly summary using AI
  async generateMonthlySummary(moodHistory) {
    if (!moodHistory || moodHistory.length === 0) {
      return "No mood data available for analysis.";
    }

    try {
      const prompt = `Analyze the following mood history and provide a monthly summary:
      ${JSON.stringify(moodHistory)}
      
      Please provide:
      1. Overall mood trend
      2. Key patterns or observations
      3. Recommendations for improvement`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using a more widely available model
        messages: [
          {
            role: "system",
            content: "You are a mental health analysis AI. Analyze the mood data and provide insights and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating monthly summary:', error);
      return "Unable to generate AI analysis at this time. Please check your API configuration.";
    }
  }

  // Predict mood trend
  predictTrend(moodHistory) {
    if (!moodHistory || moodHistory.length < 3) return 'Insufficient data for prediction';

    const scores = this.preprocessMoodData(moodHistory);
    const recentScores = scores.slice(-14);
    
    // Simple linear regression for trend prediction
    const n = recentScores.length;
    const sumX = n * (n - 1) / 2;
    const sumY = recentScores.reduce((a, b) => a + b, 0);
    const sumXY = recentScores.reduce((sum, score, i) => sum + (score * i), 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    if (Math.abs(slope) < 0.1) return 'Stable';
    return slope > 0 ? 'Improving' : 'Declining';
  }

  // Analyze all aspects of mood data
  async analyzeAll(moodHistory) {
    const wellbeingStatus = this.analyzeWellbeingStatus(moodHistory);
    const suggestions = this.generateSuggestions(moodHistory);
    const monthlySummary = await this.generateMonthlySummary(moodHistory);
    const trend = this.predictTrend(moodHistory);

    return {
      wellbeingStatus,
      suggestions,
      monthlySummary,
      trend
    };
  }
}

module.exports = new MoodAnalysisService(); 