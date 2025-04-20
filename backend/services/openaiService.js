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

const analyzeMentalHealth = async (assessments, moodHistory) => {
  try {
    const prompt = `You are a mental health assistant analyzing user psychological assessments for the week. Based on the user's responses, evaluate their overall Freud AI mental health score. Rate this on a scale of 0 to 100 and provide insights on improvement or decline.

User Assessments:
${JSON.stringify(assessments)}

Mood History:
${JSON.stringify(moodHistory)}

Please provide output in the following JSON format:
{
  "score": number,
  "change": string,
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
          content: "You are a mental health analysis AI. Analyze the assessment and mood data to provide insights and recommendations."
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
    console.error('Error in mental health analysis:', error);
    throw error;
  }
};

const analyzeSleepAndStress = async (sleepLogs, stressIndicators) => {
  try {
    const prompt = `You are analyzing a user's sleep logs and stress indicators to generate insights for a health dashboard. Use the following data to determine stress levels and sleep patterns.

Sleep Logs:
${JSON.stringify(sleepLogs)}

Stress Indicators:
${JSON.stringify(stressIndicators)}

Please provide output in the following JSON format:
{
  "stress_level": string,
  "sleep_distribution": {
    "core": number,
    "rem": number,
    "post_rem": number
  },
  "avg_sleep_hours": {
    "Mon": number,
    "Tue": number,
    "Wed": number,
    "Thu": number,
    "Fri": number,
    "Sat": number,
    "Sun": number
  },
  "weekly_change": string
}`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return JSON.parse(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Error in sleep and stress analysis:', error);
    throw error;
  }
};

const analyzeJournalStreak = async (journalEntries) => {
  try {
    const prompt = `You are evaluating a user's health journaling streak. Based on their daily entries, determine their current streak and provide a motivational message.

Journal Entries:
${JSON.stringify(journalEntries)}

Please provide output in the following JSON format:
{
  "streak_days": number,
  "message": string
}`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    return JSON.parse(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Error in journal streak analysis:', error);
    throw error;
  }
};

const analyzeChatbotInteractions = async (chatLogs) => {
  try {
    const prompt = `You are summarizing user interaction with a health chatbot for analytics. Given the conversation logs, identify patterns and trends.

Chat Logs:
${JSON.stringify(chatLogs)}

Please provide output in the following JSON format:
{
  "total_conversations": number,
  "new_this_week": number,
  "summary": string
}`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    return JSON.parse(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Error in chatbot interaction analysis:', error);
    throw error;
  }
};

module.exports = {
  analyzeMentalHealth,
  analyzeSleepAndStress,
  analyzeJournalStreak,
  analyzeChatbotInteractions
}; 