const mongoose = require('mongoose');

const JournalStreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  streakDays: {
    type: Number,
    required: true,
    min: 0
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create a unique index on user to ensure one streak record per user
JournalStreakSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('JournalStreak', JournalStreakSchema); 
 