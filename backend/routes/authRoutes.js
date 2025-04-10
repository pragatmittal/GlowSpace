const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getCurrentUser, login, register, updateProfileImage } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Set up multer storage for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

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

// Login with email/password using Passport's local strategy
router.post('/login', passport.authenticate('local'), login);

// Register new user
router.post('/register', register);

// Get current user - protected route
router.get('/current-user', passport.authenticate('session'), getCurrentUser);

// Check authentication status
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
        provider: req.user.provider || 'email'
      }
    });
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

// Update profile image - protected route
router.post('/update-profile-image', passport.authenticate('session'), upload.single('profileImage'), updateProfileImage);

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