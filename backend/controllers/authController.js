const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const handleOAuthCallback = async (profile, provider) => {
  try {
    // Check if user exists
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: profile.name,
        email: profile.email,
        image: profile.image,
        provider: provider,
        providerId: profile.id
      });
    }

    return user;
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    throw error;
  }
};

// Get current user
const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

// Login with email and password
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log in the user using Passport
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Return user data without password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider
      };

      return res.status(200).json({
        success: true,
        user: userResponse
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add register function
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      provider: 'email',
      providerId: email
    });

    // Save the user
    await user.save();

    // Log in the user using Passport
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Return user data without password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider
      };

      return res.status(201).json({
        success: true,
        user: userResponse
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile image
const updateProfileImage = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const userId = req.user._id;
    
    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file path and create URL
    const filePath = req.file.path;
    
    // For development environment, use a direct path
    let imageUrl;
    if (process.env.NODE_ENV === 'production') {
      // In production, this might be a CDN URL or a proper domain
      imageUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/profiles/${req.file.filename}`;
    } else {
      // In development, use a local path
      imageUrl = `/uploads/profiles/${req.file.filename}`;
    }

    // Find user and update image URL
    const user = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      }
    });
  } catch (error) {
    console.error('Profile image update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all functions
module.exports = {
  handleOAuthCallback,
  getCurrentUser,
  login,
  register,
  updateProfileImage
}; 