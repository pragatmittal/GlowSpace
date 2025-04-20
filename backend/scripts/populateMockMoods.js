const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mood = require('../models/Mood');
const User = require('../models/User');

dotenv.config();

// Enhanced mock data configurations with more diverse moods
const moods = ['happy', 'sad', 'neutral', 'overjoyed', 'depressed', 'anxious', 'calm', 'angry', 'excited'];
const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];
const notes = [
  'Feeling great today!',
  'Had a challenging day',
  'Just an ordinary day',
  'Really excited about my progress',
  'Need some time to recharge',
  'Grateful for small things',
  'Missing my friends',
  'Accomplished something important',
  'Taking it easy today',
  'Focused on self-care',
  'Stressed about deadlines',
  'Enjoying the weather',
  'Family time was nice',
  'Work was productive',
  'Had a good workout',
  'Meditation helped today',
  'Learned something new',
  'Connected with an old friend',
  'Sleep was restful',
  'Feeling inspired'
];

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to generate random time for a given date
const getRandomTime = (date, timeOfDay) => {
  const hours = {
    'Morning': [6, 11],
    'Afternoon': [12, 17],
    'Evening': [18, 21],
    'Night': [22, 23]
  };
  const [min, max] = hours[timeOfDay];
  const hour = Math.floor(Math.random() * (max - min + 1)) + min;
  const minute = Math.floor(Math.random() * 60);
  return new Date(date.setHours(hour, minute, 0, 0));
};

// Helper function to get date range
const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Function to find a user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found with email:', email);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

// Main function to populate mock moods
async function populateMockMoods(userId) {
  try {
    // Set date range from January 1, 2025 to current date
    const startDate = new Date(2025, 0, 1); // January 1, 2025
    const endDate = new Date(); // Current date
    
    console.log(`Generating mood entries from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    
    // Clear existing mood data for this date range
    await Mood.deleteMany({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    console.log(`Cleared existing mood entries for user ${userId}`);
    
    // Generate dates array
    const dates = getDateRange(startDate, endDate);
    console.log(`Generating ${dates.length} mood entries...`);
    
    // Create mood patterns to make data more realistic
    // This simulates trends like being happier on weekends or more stressed mid-week
    const createMoodWithPattern = (date) => {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // More likely to be happy on weekends
      if (isWeekend) {
        const happyMoods = ['happy', 'overjoyed', 'excited', 'calm'];
        return getRandomItem(Math.random() < 0.7 ? happyMoods : moods);
      }
      
      // More likely to be stressed mid-week (Tuesday-Thursday)
      if (dayOfWeek >= 2 && dayOfWeek <= 4) {
        const stressedMoods = ['anxious', 'sad', 'angry', 'neutral'];
        return getRandomItem(Math.random() < 0.6 ? stressedMoods : moods);
      }
      
      // Random mood for other days
      return getRandomItem(moods);
    };
    
    // Generate and save moods for each date
    for (const date of dates) {
      const timeOfDay = getRandomItem(timesOfDay);
      const timestamp = getRandomTime(new Date(date), timeOfDay);
      
      const mockMood = new Mood({
        user: userId,
        mood: createMoodWithPattern(date),
        timeOfDay,
        note: getRandomItem(notes),
        date: timestamp
      });
      
      await mockMood.save();
    }
    
    console.log(`Successfully created ${dates.length} mood entries for user ${userId}`);
  } catch (error) {
    console.error('Error populating mock data:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Connect to MongoDB and execute
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    let userId;
    
    // If a user ID is provided as a command line argument, use it
    if (process.argv[2]) {
      userId = process.argv[2];
    } 
    // Otherwise, try to find the test user by email
    else {
      const testEmail = 'pavadib216@ovobri.com';
      const user = await findUserByEmail(testEmail);
      
      if (!user) {
        console.error('Test user not found. Please provide a user ID as a command line argument');
        process.exit(1);
      }
      
      userId = user._id;
      console.log(`Found test user with ID: ${userId}`);
    }
    
    return populateMockMoods(userId);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 