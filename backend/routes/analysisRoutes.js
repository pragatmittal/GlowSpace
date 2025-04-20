const express = require('express');
const router = express.Router();
const passport = require('passport');
const freudScoreController = require('../controllers/freudScoreController');
const stressBreakdownController = require('../controllers/stressBreakdownController');

// Freud AI Score routes
router.post('/freud-score/generate',
  passport.authenticate('jwt', { session: false }),
  freudScoreController.generateFreudScore
);

router.get('/freud-score/history',
  passport.authenticate('jwt', { session: false }),
  freudScoreController.getFreudScoreHistory
);

// Stress Breakdown routes
router.post('/stress-breakdown/generate',
  passport.authenticate('jwt', { session: false }),
  stressBreakdownController.generateStressBreakdown
);

router.get('/stress-breakdown/history',
  passport.authenticate('jwt', { session: false }),
  stressBreakdownController.getStressBreakdownHistory
);

module.exports = router; 