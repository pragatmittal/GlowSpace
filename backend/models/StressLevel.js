const mongoose = require('mongoose');

const StressLevelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: String,
    required: true
  },
  sleepDistribution: {
    core: Number,
    rem: Number,
    post_rem: Number
  },
  avgSleepHours: {
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number
  },
  weeklyChange: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
StressLevelSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('StressLevel', StressLevelSchema); 
 