const mongoose = require('mongoose');

const SleepStatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  distribution: {
    core: Number,
    rem: Number,
    post_rem: Number
  },
  avgHours: {
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

// Create compound index for efficient querying
SleepStatSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('SleepStat', SleepStatSchema); 
 