/**
 * Test script for mood tracking API endpoints
 * 
 * This script tests the following endpoints:
 * 1. POST /api/moods - Create a new mood entry
 * 2. GET /api/moods/history - Get mood history for calendar view
 * 3. GET /api/moods/analysis - Get mood analysis for dashboard
 * 
 * To run this script:
 * 1. Start the backend server
 * 2. Run: node test-mood-tracking.js
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api';
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

// Test mood data
const TEST_MOODS = [
  { mood: 'happy', timeOfDay: 'Morning', note: 'Feeling great today!' },
  { mood: 'sad', timeOfDay: 'Evening', note: 'Had a tough day' },
  { mood: 'neutral', timeOfDay: 'Afternoon', note: 'Just an average day' },
  { mood: 'overjoyed', timeOfDay: 'Morning', note: 'Got a promotion!' },
  { mood: 'depressed', timeOfDay: 'Night', note: 'Feeling quite low' }
];

// Store created mood IDs for cleanup
let createdMoodIds = [];

// Helper function to handle errors
const handleError = (error, message) => {
  console.error(`❌ ${message}`);
  if (error.response) {
    console.error(`Status: ${error.response.status}`);
    console.error(`Data:`, error.response.data);
  } else {
    console.error(error.message);
  }
  process.exit(1);
};

// Main test function
async function runTests() {
  let authCookie = null;
  
  try {
    console.log('🔍 Starting mood tracking API tests...\n');
    
    // Step 1: Login to get authentication
    console.log('Step 1: Authenticating...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, TEST_CREDENTIALS);
    
    if (loginResponse.data.success) {
      console.log('✅ Authentication successful');
      
      // Get cookies from response
      const cookies = loginResponse.headers['set-cookie'];
      if (cookies) {
        authCookie = cookies[0];
      }
    } else {
      throw new Error('Authentication failed');
    }
    
    // Configure axios for all subsequent requests
    const axiosConfig = {
      headers: {
        Cookie: authCookie
      },
      withCredentials: true
    };
    
    // Step 2: Create test mood entries
    console.log('\nStep 2: Creating test mood entries...');
    
    for (const moodData of TEST_MOODS) {
      const response = await axios.post(`${API_URL}/moods`, moodData, axiosConfig);
      
      if (response.data.success) {
        console.log(`✅ Created ${moodData.mood} mood entry`);
        createdMoodIds.push(response.data.data._id);
      } else {
        throw new Error(`Failed to create ${moodData.mood} mood entry`);
      }
    }
    
    // Step 3: Test mood history endpoint
    console.log('\nStep 3: Testing mood history endpoint...');
    
    const historyResponse = await axios.get(`${API_URL}/moods/history`, axiosConfig);
    
    if (historyResponse.data.success) {
      console.log(`✅ Retrieved ${historyResponse.data.count} mood entries`);
      console.log('Sample entry:', historyResponse.data.data[0]);
    } else {
      throw new Error('Failed to retrieve mood history');
    }
    
    // Step 4: Test mood analysis endpoint
    console.log('\nStep 4: Testing mood analysis endpoint...');
    
    const analysisResponse = await axios.get(`${API_URL}/moods/analysis`, axiosConfig);
    
    if (analysisResponse.data.success) {
      console.log('✅ Retrieved mood analysis');
      console.log('Summary:', analysisResponse.data.data.summary);
      console.log('Most frequent mood:', analysisResponse.data.data.mostFrequentMood);
      console.log('Number of recommendations:', analysisResponse.data.data.recommendations.length);
    } else {
      throw new Error('Failed to retrieve mood analysis');
    }
    
    // Step 5: Cleanup - delete test mood entries
    console.log('\nStep 5: Cleaning up test data...');
    
    for (const moodId of createdMoodIds) {
      const response = await axios.delete(`${API_URL}/moods/${moodId}`, axiosConfig);
      
      if (response.data.success) {
        console.log(`✅ Deleted mood entry: ${moodId}`);
      } else {
        console.warn(`⚠️ Failed to delete mood entry: ${moodId}`);
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    handleError(error, 'Test failed');
  }
}

// Run the tests
runTests(); 