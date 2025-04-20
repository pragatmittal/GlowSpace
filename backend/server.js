const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
require('./middleware/auth.middleware'); // Just require the file to set up passport strategies

// Import routes
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const assessmentRoutes = require('./routes/assessment/assessmentRoutes.js');
const analysisRoutes = require('./routes/analysisRoutes');

// Config
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware to log session and authentication
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user || 'No user');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/analysis', analysisRoutes);

// Dashboard endpoint for consolidated ML/AI metrics
app.get('/api/dashboard', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Pass the request to the dashboard summary controller
    const assessmentController = require('./controllers/assessmentController');
    return assessmentController.getDashboardSummary(req, res);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error generating dashboard summary'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'GlowSpace API is running',
    status: 'online',
    authStatus: req.isAuthenticated() ? 'authenticated' : 'not authenticated',
    user: req.user || null
  });
});

// API root route for connectivity checks
app.get('/api', (req, res) => {
  res.json({ 
    message: 'GlowSpace API is online',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Auth status route
app.get('/api/auth-status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 