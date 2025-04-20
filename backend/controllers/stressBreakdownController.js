const { StressBreakdown, Assessment } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate stress breakdown based on assessment data
const generateStressBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get recent assessments
    const assessments = await Assessment.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);
    
    if (!assessments.length) {
      return res.status(404).json({
        success: false,
        message: 'No assessment data found'
      });
    }

    // Prepare assessment data for AI analysis
    const assessmentData = assessments.map(assessment => ({
      responses: assessment.responses,
      timestamp: assessment.timestamp
    }));

    // Generate AI analysis using OpenAI
    const prompt = `Analyze the following assessment data and provide a stress breakdown:
    ${JSON.stringify(assessmentData)}
    
    Please provide:
    1. A total stress score from 0-100
    2. Breakdown of stress into categories (e.g., Work, Relationships, Health, etc.)
    3. A brief analysis of the stress patterns
    4. Color codes for each category (use hex colors)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a stress analysis AI. Analyze the assessment data and provide a detailed stress breakdown with categories and visualizations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // Create new stress breakdown entry
    const stressBreakdown = new StressBreakdown({
      userId,
      categories: analysis.categories,
      totalStress: analysis.totalStress,
      analysis: analysis.analysis,
      assessmentIds: assessments.map(a => a._id)
    });

    await stressBreakdown.save();

    res.json({
      success: true,
      data: stressBreakdown
    });
  } catch (error) {
    console.error('Error generating stress breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating stress breakdown'
    });
  }
};

// Get stress breakdown history
const getStressBreakdownHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const breakdowns = await StressBreakdown.find({ userId })
      .sort({ timestamp: -1 })
      .limit(30);

    res.json({
      success: true,
      data: breakdowns
    });
  } catch (error) {
    console.error('Error fetching stress breakdown history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stress breakdown history'
    });
  }
};

module.exports = {
  generateStressBreakdown,
  getStressBreakdownHistory
}; 