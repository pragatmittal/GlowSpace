const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // Not required because social auth users won't have a password
  },
  image: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`
    }
  },
  provider: {
    type: String,
    default: 'email' // Default provider is email
  },
  providerId: {
    type: String,
    // Not required for email login
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer_not_to_say', 'other'],
    default: 'prefer_not_to_say'
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  weight: {
    type: Number,
    min: 30,
    max: 500
  },
  assessments: {
    sleepQuality: {
      hoursSlept: Number,
      qualityRating: String,
      issues: [String],
      updatedAt: Date
    },
    physicalSymptoms: {
      symptoms: [String],
      severity: String,
      frequency: String,
      updatedAt: Date
    },
    stressLevel: {
      level: String,
      symptoms: [String],
      triggers: [String],
      updatedAt: Date
    },
    medications: {
      current: [String],
      past: [String],
      effects: [String],
      updatedAt: Date
    },
    professionalHelp: {
      seeking: Boolean,
      previously: Boolean,
      type: String,
      updatedAt: Date
    },
    mentalHealthSymptoms: {
      symptoms: [String],
      severity: String,
      duration: String,
      updatedAt: Date
    },
    soundAnalysis: {
      stressLevel: Number,
      emotionalTone: String,
      analysisResult: Object,
      updatedAt: Date
    },
    expressionAnalysis: {
      dominantEmotion: String,
      confidenceScore: Number,
      analysisResult: Object,
      updatedAt: Date
    }
  }
}, {
  timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema); 