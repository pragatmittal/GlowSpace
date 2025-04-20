const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    questionId: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
assessmentSchema.index({ userId: 1, timestamp: -1 });

// Export only the schema
module.exports = {
  schema: assessmentSchema
}; 