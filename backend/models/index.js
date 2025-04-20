const mongoose = require('mongoose');

// Import all model schemas
const freudScoreSchema = require('./FreudScore');
const stressBreakdownSchema = require('./StressBreakdown');
const dailyAssessmentSchema = require('./DailyAssessment');

// Register models only if they don't exist
const FreudScore = mongoose.models.FreudScore || mongoose.model('FreudScore', freudScoreSchema);
const StressBreakdown = mongoose.models.StressBreakdown || mongoose.model('StressBreakdown', stressBreakdownSchema);
const DailyAssessment = mongoose.models.DailyAssessment || mongoose.model('DailyAssessment', dailyAssessmentSchema);

module.exports = {
  FreudScore,
  StressBreakdown,
  DailyAssessment
}; 