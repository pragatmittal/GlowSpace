const mongoose = require('mongoose');

const stressBreakdownSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    name: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String, required: true }
  }],
  totalStress: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analysis: {
    type: String,
    required: true
  },
  assessmentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
stressBreakdownSchema.index({ userId: 1, timestamp: -1 });

// Export only the schema
module.exports = {
  schema: stressBreakdownSchema
}; 