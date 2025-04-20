const mongoose = require('mongoose');

/**
 * Mood Schema
 * Stores user mood entries with associated metadata
 */
const moodSchema = new mongoose.Schema({
  // Reference to the user who created this mood entry
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for better query performance
  },
  
  // The mood type (overjoyed, happy, neutral, sad, depressed)
  mood: {
    type: String,
    required: true,
    enum: ['overjoyed', 'happy', 'neutral', 'sad', 'depressed'],
  },
  
  // Optional notes about the mood
  note: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Time of day (Morning, Afternoon, Evening, Night)
  timeOfDay: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'],
  },
  
  // Date the mood was recorded
  date: {
    type: Date,
    default: Date.now,
    index: true // Add index for better query performance
  },
  
  // Metadata about the entry
  metadata: {
    // Location (optional)
    location: {
      type: String
    },
    
    // Weather at the time (optional)
    weather: {
      type: String
    },
    
    // Activity at the time (optional)
    activity: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Add compound index for user + date for efficient user history queries
moodSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema); 