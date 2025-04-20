const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('./jwt.strategy');
const dotenv = require('dotenv');

dotenv.config();

// Configure Passport for session serialization
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user:', id);
  try {
    // For our hardcoded user
    if (id === '123456789') {
      const user = {
        _id: '123456789',
        name: 'Pragat Mittal',
        email: 'mittalpragat@gmail.com',
        image: 'https://ui-avatars.com/api/?name=Pragat+Mittal'
      };
      return done(null, user);
    }
    
    // For users from the database
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

// Local strategy for email/password login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            provider: 'google',
            providerId: profile.id
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// JWT strategy
passport.use('jwt', JwtStrategy);

// Export both the passport configuration and the middleware functions
module.exports = {
  passport,
  ensureAuth: (req, res, next) => {
    // Check if user is authenticated via Passport
    if (req.isAuthenticated()) {
      return next();
    }
    
    // If not authenticated, return 401 Unauthorized
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please log in to access this resource.'
    });
  },
  ensureGuest: (req, res, next) => {
    // Check if user is NOT authenticated
    if (!req.isAuthenticated()) {
      return next();
    }
    
    // If already authenticated, redirect to dashboard or home
    return res.status(400).json({
      success: false,
      error: 'You are already logged in.'
    });
  }
}; 