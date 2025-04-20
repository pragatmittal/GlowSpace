const mongoose = require('mongoose');

const freudScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  components: {
    ego: { type: Number, required: true },
    superego: { type: Number, required: true },
    id: { type: Number, required: true }
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
freudScoreSchema.index({ userId: 1, timestamp: -1 });

// Export only the schema
module.exports = {
  schema: freudScoreSchema
}; 