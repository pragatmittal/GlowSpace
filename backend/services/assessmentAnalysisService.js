const OpenAI = require('openai');
const config = require('../config/config');

// Initialize OpenAI with error handling
let openai;
try {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  openai = new OpenAI({
    apiKey: config.openai.apiKey
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

class AssessmentAnalysisService {
  // Generate Freud AI Score based on all assessment data
  async generateFreudScore(assessmentData) {
    try {
      const prompt = `Analyze the following comprehensive mental health assessment data and generate a Freud AI Score (0-100) that reflects the user's overall mental well-being:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Consider the following factors in your analysis:
1. Physical health indicators (sleep, weight, physical distress)
2. Mental health symptoms (anxiety, depression, stress levels)
3. Professional help status and medication effects
4. AI-based mood analysis (sound and expression)
5. Daily patterns and changes

Please provide output in the following JSON format:
{
  "score": number (0-100),
  "change": string ("improved", "declined", "stable"),
  "daily_scores": {
    "Mon": number,
    "Tue": number,
    "Wed": number,
    "Thu": number,
    "Fri": number,
    "Sat": number,
    "Sun": number
  },
  "summary": string
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a mental health analysis AI specializing in Freudian psychology. Analyze the assessment data and provide a comprehensive score and analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return JSON.parse(completion.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating Freud score:', error);
      throw error;
    }
  }

  // Generate Stress Breakdown based on assessment data
  async generateStressBreakdown(assessmentData) {
    try {
      const prompt = `Analyze the following mental health assessment data and generate a detailed stress breakdown:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Consider these stress factors:
1. Physical health (sleep quality, physical symptoms)
2. Mental health (anxiety, depression, other symptoms)
3. Environmental factors (triggers, coping mechanisms)
4. Professional help and medication status
5. AI-based mood analysis

Please provide output in the following JSON format:
{
  "categories": [
    {
      "name": string,
      "percentage": number,
      "description": string
    }
  ],
  "totalStress": number (0-100),
  "recommendations": [string]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a stress analysis AI. Analyze the assessment data and provide a detailed breakdown of stress factors and recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return JSON.parse(completion.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error generating stress breakdown:', error);
      throw error;
    }
  }

  // Process all assessment data and generate combined analysis
  async processDailyAssessment(assessmentData) {
    try {
      const [freudScore, stressBreakdown] = await Promise.all([
        this.generateFreudScore(assessmentData),
        this.generateStressBreakdown(assessmentData)
      ]);

      return {
        freudScore,
        stressBreakdown,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error processing daily assessment:', error);
      throw error;
    }
  }
}

module.exports = new AssessmentAnalysisService(); 