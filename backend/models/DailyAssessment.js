const mongoose = require('mongoose');

const dailyAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Basic Information
  gender: String,
  age: Number,
  weight: Number,
  
  // Professional Help
  professionalHelp: {
    seekingHelp: Boolean,
    currentTherapy: Boolean,
    medication: Boolean,
    details: String
  },
  
  // Physical and Mental Health
  physicalDistress: {
    level: Number,
    symptoms: [String],
    impact: String
  },
  
  // Sleep Quality
  sleepQuality: {
    rating: Number,
    hours: Number,
    disturbances: [String],
    notes: String
  },
  
  // Medication
  medication: {
    takingMedication: Boolean,
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      effectiveness: Number
    }]
  },
  
  // Mental Health Symptoms
  mentalHealthSymptoms: {
    anxiety: Number,
    depression: Number,
    stress: Number,
    otherSymptoms: [String]
  },
  
  // Stress Levels
  stressLevel: {
    currentLevel: Number,
    triggers: [String],
    copingMechanisms: [String]
  },
  
  // AI Analysis
  aiSoundAnalysis: {
    mood: String,
    confidence: Number,
    keywords: [String]
  },
  
  expressionAnalysis: {
    emotion: String,
    confidence: Number,
    notes: String
  },
  
  // AI Generated Scores
  freudScore: {
    score: Number,
    change: String,
    dailyScores: {
      Mon: Number,
      Tue: Number,
      Wed: Number,
      Thu: Number,
      Fri: Number,
      Sat: Number,
      Sun: Number
    },
    summary: String
  },
  
  stressBreakdown: {
    categories: [{
      name: String,
      percentage: Number,
      description: String
    }],
    totalStress: Number,
    recommendations: [String]
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
dailyAssessmentSchema.index({ userId: 1, date: 1 });

module.exports = dailyAssessmentSchema; 