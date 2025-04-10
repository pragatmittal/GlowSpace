const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuth } = require('../middleware/auth');

// Route to get current user's information
router.get('/current-user', ensureAuth, authController.getCurrentUser);

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

// ... existing code ... 