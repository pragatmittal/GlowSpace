const express = require('express');
const router = express.Router();
const passport = require('passport');
const assessmentController = require('../../controllers/assessmentController');

// Unified assessment routes
router.post('/save', passport.authenticate('jwt', { session: false }), assessmentController.saveAssessment);
router.get('/today', passport.authenticate('jwt', { session: false }), assessmentController.getTodayAssessment);
router.get('/history', passport.authenticate('jwt', { session: false }), assessmentController.getAssessmentHistory);

// AI Analysis routes
router.get('/freud-score', passport.authenticate('jwt', { session: false }), assessmentController.getFreudScore);
router.get('/stress-breakdown', passport.authenticate('jwt', { session: false }), assessmentController.getStressBreakdown);

// Individual assessment routes (for backward compatibility)
router.post('/gender-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveGenderAssessment);
router.post('/age-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveAgeAssessment);
router.post('/weight-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveWeightAssessment);
router.post('/professional-help-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveProfessionalHelpAssessment);
router.post('/physical-distress-assessment', passport.authenticate('jwt', { session: false }), assessmentController.savePhysicalDistressAssessment);
router.post('/sleep-quality-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveSleepQualityAssessment);
router.post('/medication-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveMedicationAssessment);
router.post('/medication-selection', passport.authenticate('jwt', { session: false }), assessmentController.saveMedicationSelection);
router.post('/mental-health-symptoms', passport.authenticate('jwt', { session: false }), assessmentController.saveMentalHealthSymptoms);
router.post('/stress-level-assessment', passport.authenticate('jwt', { session: false }), assessmentController.saveStressLevelAssessment);
router.post('/ai-sound-analysis', passport.authenticate('jwt', { session: false }), assessmentController.saveAISoundAnalysis);
router.post('/expression-analysis', passport.authenticate('jwt', { session: false }), assessmentController.saveExpressionAnalysis);

// Get routes for individual assessments
router.get('/gender-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getGenderAssessment);
router.get('/age-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getAgeAssessment);
router.get('/weight-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getWeightAssessment);
router.get('/professional-help-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getProfessionalHelpAssessment);
router.get('/physical-distress-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getPhysicalDistressAssessment);
router.get('/sleep-quality-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getSleepQualityAssessment);
router.get('/medication-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getMedicationAssessment);
router.get('/medication-selection', passport.authenticate('jwt', { session: false }), assessmentController.getMedicationSelection);
router.get('/mental-health-symptoms', passport.authenticate('jwt', { session: false }), assessmentController.getMentalHealthSymptoms);
router.get('/stress-level-assessment', passport.authenticate('jwt', { session: false }), assessmentController.getStressLevelAssessment);
router.get('/ai-sound-analysis', passport.authenticate('jwt', { session: false }), assessmentController.getAISoundAnalysis);
router.get('/expression-analysis', passport.authenticate('jwt', { session: false }), assessmentController.getExpressionAnalysis);

module.exports = router; 
 