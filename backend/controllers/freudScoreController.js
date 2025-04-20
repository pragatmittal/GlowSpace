const { FreudScore } = require('../models');
const { Assessment } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate Freud AI score based on assessment data
const generateFreudScore = async (req, res) => {
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
    const prompt = `Analyze the following assessment data and provide a Freudian analysis:
    ${JSON.stringify(assessmentData)}
    
    Please provide:
    1. A score from 0-100 representing overall psychological balance
    2. Breakdown of ego, superego, and id components (0-100 each)
    3. A brief analysis of the psychological state`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a psychological analysis AI trained in Freudian theory. Analyze the assessment data and provide scores and insights."
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

    // Create new Freud score entry
    const freudScore = new FreudScore({
      userId,
      score: analysis.score,
      components: {
        ego: analysis.components.ego,
        superego: analysis.components.superego,
        id: analysis.components.id
      },
      analysis: analysis.analysis,
      assessmentIds: assessments.map(a => a._id)
    });

    await freudScore.save();

    res.json({
      success: true,
      data: freudScore
    });
  } catch (error) {
    console.error('Error generating Freud score:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating Freud score'
    });
  }
};

// Get Freud score history
const getFreudScoreHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const scores = await FreudScore.find({ userId })
      .sort({ timestamp: -1 })
      .limit(30);

    res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error('Error fetching Freud score history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Freud score history'
    });
  }
};

module.exports = {
  generateFreudScore,
  getFreudScoreHistory
}; 