const FreudScore = require('../models/FreudScore');
const StressLevel = require('../models/StressLevel');
const SleepStat = require('../models/SleepStat');
const JournalStreak = require('../models/JournalStreak');
const Mood = require('../models/Mood');
const User = require('../models/User');
const openaiService = require('../services/openaiService');
const mongoose = require('mongoose');
const { DailyAssessment } = require('../models');
const assessmentAnalysisService = require('../services/assessmentAnalysisService');

// Helper function to get recent mood data
const getRecentMoodData = async (userId, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await Mood.find({
    user: userId,
    date: { $gte: cutoffDate }
  }).sort({ date: -1 });
};

// Helper function to get recent sleep data
const getRecentSleepData = async (userId, days = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await SleepStat.find({
    user: userId,
    date: { $gte: cutoffDate }
  }).sort({ date: -1 });
};

// Helper function to get recent journal entries
const getRecentJournalEntries = async (userId, days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await JournalStreak.find({
    user: userId,
    date: { $gte: cutoffDate }
  }).sort({ date: -1 });
};

class AssessmentController {
  // Save individual assessment data
  async saveAssessment(req, res) {
    try {
      const { type, data } = req.body;
      const userId = req.user._id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find or create today's assessment
      let assessment = await DailyAssessment.findOne({
        userId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!assessment) {
        assessment = new DailyAssessment({
          userId,
          date: today
        });
      }

      // Update the specific assessment type
      assessment[type] = data;
      await assessment.save();

      // If all required assessments are completed, trigger AI analysis
      if (this.isAssessmentComplete(assessment)) {
        try {
          const analysis = await assessmentAnalysisService.processDailyAssessment(assessment);
          assessment.freudScore = analysis.freudScore;
          assessment.stressBreakdown = analysis.stressBreakdown;
          await assessment.save();
          
          // Return the updated assessment with AI analysis
          res.json({ 
            success: true, 
            assessment,
            message: 'Assessment saved and AI analysis completed'
          });
        } catch (aiError) {
          console.error('AI Analysis Error:', aiError);
          // Still return success for the assessment save, but indicate AI analysis failed
          res.json({ 
            success: true, 
            assessment,
            message: 'Assessment saved, but AI analysis failed',
            aiError: aiError.message
          });
        }
      } else {
        res.json({ 
          success: true, 
          assessment,
          message: 'Assessment saved, waiting for more data'
        });
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      res.status(500).json({ 
        error: 'Failed to save assessment',
        details: error.message 
      });
    }
  }

  // Get today's assessment data
  async getTodayAssessment(req, res) {
    try {
      const userId = req.user._id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const assessment = await DailyAssessment.findOne({
        userId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      res.json(assessment || {});
    } catch (error) {
      console.error('Error getting assessment:', error);
      res.status(500).json({ error: 'Failed to get assessment' });
    }
  }

  // Get assessment history
  async getAssessmentHistory(req, res) {
    try {
      const userId = req.user._id;
      const { startDate, endDate } = req.query;

      const query = { userId };
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const assessments = await DailyAssessment.find(query)
        .sort({ date: -1 })
        .limit(30); // Last 30 days

      res.json(assessments);
    } catch (error) {
      console.error('Error getting assessment history:', error);
      res.status(500).json({ error: 'Failed to get assessment history' });
    }
  }

  // Get Freud AI Score
  async getFreudScore(req, res) {
    try {
      const userId = req.user._id;
      const { startDate, endDate } = req.query;

      const query = { userId };
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const assessments = await DailyAssessment.find(query)
        .select('date freudScore')
        .sort({ date: 1 });

      if (!assessments || assessments.length === 0) {
        return res.status(404).json({ 
          error: 'No Freud scores found',
          message: 'Please complete your daily assessments to generate Freud scores'
        });
      }

      res.json(assessments);
    } catch (error) {
      console.error('Error getting Freud score:', error);
      res.status(500).json({ 
        error: 'Failed to get Freud score',
        details: error.message 
      });
    }
  }

  // Get Stress Breakdown
  async getStressBreakdown(req, res) {
    try {
      const userId = req.user._id;
      const { startDate, endDate } = req.query;

      const query = { userId };
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const assessments = await DailyAssessment.find(query)
        .select('date stressBreakdown')
        .sort({ date: 1 });

      if (!assessments || assessments.length === 0) {
        return res.status(404).json({ 
          error: 'No stress breakdown data found',
          message: 'Please complete your daily assessments to generate stress breakdown'
        });
      }

      res.json(assessments);
    } catch (error) {
      console.error('Error getting stress breakdown:', error);
      res.status(500).json({ 
        error: 'Failed to get stress breakdown',
        details: error.message 
      });
    }
  }

  // Helper method to check if all required assessments are complete
  isAssessmentComplete(assessment) {
    const requiredFields = [
      'gender',
      'age',
      'weight',
      'professionalHelp',
      'physicalDistress',
      'sleepQuality',
      'medication',
      'mentalHealthSymptoms',
      'stressLevel',
      'aiSoundAnalysis',
      'expressionAnalysis'
    ];

    return requiredFields.every(field => {
      const value = assessment[field];
      if (!value) return false;
      
      // Check nested fields for complex objects
      if (typeof value === 'object') {
        switch (field) {
          case 'professionalHelp':
            return value.seekingHelp !== undefined;
          case 'physicalDistress':
            return value.level !== undefined;
          case 'sleepQuality':
            return value.rating !== undefined;
          case 'medication':
            return value.takingMedication !== undefined;
          case 'mentalHealthSymptoms':
            return value.anxiety !== undefined;
          case 'stressLevel':
            return value.currentLevel !== undefined;
          case 'aiSoundAnalysis':
            return value.mood !== undefined;
          case 'expressionAnalysis':
            return value.emotion !== undefined;
          default:
            return true;
        }
      }
      
      return true;
    });
  }

  // Save assessment handlers
  async saveGenderAssessment(req, res) {
    try {
      const { gender } = req.body;
      await User.findByIdAndUpdate(req.user.id, { gender });
      res.json({ success: true, message: 'Gender assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveAgeAssessment(req, res) {
    try {
      const { age } = req.body;
      await User.findByIdAndUpdate(req.user.id, { age });
      res.json({ success: true, message: 'Age assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveWeightAssessment(req, res) {
    try {
      const { weight } = req.body;
      await User.findByIdAndUpdate(req.user.id, { weight });
      res.json({ success: true, message: 'Weight assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveProfessionalHelpAssessment(req, res) {
    try {
      const { seeking, previously, type } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.professionalHelp': {
          seeking,
          previously,
          type,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Professional help assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async savePhysicalDistressAssessment(req, res) {
    try {
      const { symptoms, severity, frequency } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.physicalSymptoms': {
          symptoms,
          severity,
          frequency,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Physical distress assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveSleepQualityAssessment(req, res) {
    try {
      const { hoursSlept, qualityRating, issues } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.sleepQuality': {
          hoursSlept,
          qualityRating,
          issues,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Sleep quality assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveMedicationAssessment(req, res) {
    try {
      const { current, past, effects } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.medications': {
          current,
          past,
          effects,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Medication assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveMedicationSelection(req, res) {
    try {
      const { current, past, effects } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.medications': {
          current,
          past,
          effects,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Medication selection saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveMentalHealthSymptoms(req, res) {
    try {
      const { symptoms, severity, duration } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.mentalHealthSymptoms': {
          symptoms,
          severity,
          duration,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Mental health symptoms saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveStressLevelAssessment(req, res) {
    try {
      const { level, symptoms, triggers } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.stressLevel': {
          level,
          symptoms,
          triggers,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Stress level assessment saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveAISoundAnalysis(req, res) {
    try {
      const { stressLevel, emotionalTone, analysisResult } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.soundAnalysis': {
          stressLevel,
          emotionalTone,
          analysisResult,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'AI sound analysis saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveExpressionAnalysis(req, res) {
    try {
      const { dominantEmotion, confidenceScore, analysisResult } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        'assessments.expressionAnalysis': {
          dominantEmotion,
          confidenceScore,
          analysisResult,
          updatedAt: new Date()
        }
      });
      res.json({ success: true, message: 'Expression analysis saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get assessment handlers
  async getGenderAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ gender: user.gender });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAgeAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ age: user.age });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWeightAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ weight: user.weight });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfessionalHelpAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ professionalHelp: user.assessments.professionalHelp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPhysicalDistressAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ physicalSymptoms: user.assessments.physicalSymptoms });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSleepQualityAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ sleepQuality: user.assessments.sleepQuality });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMedicationAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ medications: user.assessments.medications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMedicationSelection(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ medications: user.assessments.medications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMentalHealthSymptoms(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ mentalHealthSymptoms: user.assessments.mentalHealthSymptoms });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStressLevelAssessment(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ stressLevel: user.assessments.stressLevel });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAISoundAnalysis(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ soundAnalysis: user.assessments.soundAnalysis });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExpressionAnalysis(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ expressionAnalysis: user.assessments.expressionAnalysis });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Special AI analysis endpoints
  async getFreudAIScore(req, res) {
    try {
      const user = await User.findById(req.user._id);
      const moodHistory = await getRecentMoodData(req.user._id);
      const analysis = await openaiService.analyzeMentalHealth(user.assessments, moodHistory);
      
      const freudScore = new FreudScore({
        user: req.user._id,
        score: analysis.score,
        change: analysis.change,
        dailyScores: analysis.daily_scores,
        summary: analysis.summary
      });
      await freudScore.save();

      // Format response to match frontend expectations
      res.json({
        score: analysis.score,
        change: analysis.change,
        dailyScores: analysis.daily_scores
      });
    } catch (error) {
      console.error('Error getting Freud AI score:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getStressBreakdown(req, res) {
    try {
      const user = await User.findById(req.user._id);
      const sleepData = await getRecentSleepData(req.user._id);
      const analysis = await openaiService.analyzeSleepAndStress(sleepData, user.assessments);
      
      const stressLevel = new StressLevel({
        user: req.user._id,
        level: analysis.stress_level,
        sleepDistribution: analysis.sleep_distribution,
        avgSleepHours: analysis.avg_sleep_hours,
        weeklyChange: analysis.weekly_change
      });
      await stressLevel.save();

      // Format response to match frontend expectations
      res.json({
        breakdown: {
          low: analysis.stress_distribution.low || 0,
          moderate: analysis.stress_distribution.moderate || 0,
          high: analysis.stress_distribution.high || 0
        }
      });
    } catch (error) {
      console.error('Error getting stress breakdown:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSleepStats(req, res) {
    try {
      const sleepData = await getRecentSleepData(req.user.id);
      const analysis = await openaiService.analyzeSleepAndStress(sleepData, {});
      
      const sleepStat = new SleepStat({
        user: req.user.id,
        distribution: analysis.sleep_distribution,
        avgHours: analysis.avg_sleep_hours,
        weeklyChange: analysis.weekly_change
      });
      await sleepStat.save();

      res.json(analysis);
    } catch (error) {
      console.error('Error getting sleep stats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getJournalStreak(req, res) {
    try {
      const journalEntries = await getRecentJournalEntries(req.user.id);
      const analysis = await openaiService.analyzeJournalStreak(journalEntries);
      
      const journalStreak = new JournalStreak({
        user: req.user.id,
        streakDays: analysis.streak_days,
        message: analysis.message
      });
      await journalStreak.save();

      res.json(analysis);
    } catch (error) {
      console.error('Error getting journal streak:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Dashboard summary endpoint
  async getDashboardSummary(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const moodHistory = await getRecentMoodData(req.user.id);
      const sleepData = await getRecentSleepData(req.user.id);
      const journalEntries = await getRecentJournalEntries(req.user.id);

      const [freudScore, stressBreakdown, sleepStats, journalStreak] = await Promise.all([
        openaiService.analyzeMentalHealth(user.assessments, moodHistory),
        openaiService.analyzeSleepAndStress(sleepData, user.assessments),
        openaiService.analyzeSleepAndStress(sleepData, {}),
        openaiService.analyzeJournalStreak(journalEntries)
      ]);

      res.json({
        freudScore,
        stressBreakdown,
        sleepStats,
        journalStreak,
        moodHistory: moodHistory.slice(0, 10),
        assessments: user.assessments
      });
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AssessmentController(); 