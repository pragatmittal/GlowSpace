const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getCurrentUser } = require('../controllers/authController');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/auth/signin`,
    successRedirect: `${process.env.FRONTEND_URL}`
  })
);

// Get current user
router.get('/current-user', getCurrentUser);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router; 