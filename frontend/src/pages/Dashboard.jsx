import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import ScoreChart from '../components/dashboard/ScoreChart';
import StressChart from '../components/dashboard/StressChart';
import StatCards from '../components/dashboard/StatCards';
import PromoCard from '../components/dashboard/PromoCard';
import MoodInsightsCard from '../components/dashboard/MoodInsightsCard';
import AIMetricsSection from '../components/dashboard/AIMetricsSection';
import { cn } from '../components/ui/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mockDataLoading, setMockDataLoading] = useState(false);
  const [mockDataSuccess, setMockDataSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save preference to localStorage
    localStorage.setItem('darkMode', !darkMode);
    
    // Apply dark mode class to document
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      console.log('⏳ Fetching mood insights from API...');
      
      // Make a direct call to the analysis endpoint
      const response = await axios.get('http://localhost:5000/api/moods/analysis', {
        withCredentials: true
      });
      
      console.log('📊 API response:', response.data);
      
      // Show any data we get, regardless of format
      if (response.data) {
        if (response.data.success && response.data.data) {
          setInsights(response.data.data);
        } else if (response.data.data) {
          setInsights(response.data.data);
        } else if (typeof response.data === 'object') {
          setInsights(response.data);
        }
        
        setError(null);
      } else {
        setInsights(null);
        setError("Empty response from API");
      }
    } catch (err) {
      console.error('❌ Error fetching insights:', err);
      
      // Create a detailed error message
      let errorMsg = "Failed to load insights: ";
      
      if (err.response) {
        errorMsg += err.response.data?.error || err.response.statusText || err.message;
        console.error('Server error details:', err.response.data);
      } else if (err.request) {
        errorMsg += "No response from server - check if backend is running";
      } else {
        errorMsg += err.message;
      }
      
      setError(errorMsg);
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  const populateMockData = async () => {
    try {
      setLoading(true);
      setMockDataLoading(true);
      setError(null);
      
      // Call the populate mock data endpoint
      await axios.post('http://localhost:5000/api/moods/populate-mock-data', {}, {
        withCredentials: true
      });
      
      // Show success message
      setMockDataSuccess(true);
      
      // Wait 1 second before fetching insights to let backend process
      setTimeout(async () => {
        await fetchInsights();
        setMockDataLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to populate mock data: ' + (err.response?.data?.error || err.message));
      console.error('Error populating mock data:', err);
      setMockDataLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // Also set up a poll to refresh insights every 30 seconds during testing
    const pollInterval = setInterval(() => {
      console.log("Auto-refreshing insights");
      fetchInsights();
    }, 30000);
    
    return () => clearInterval(pollInterval);
  }, []);

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen w-full flex items-center justify-center",
        darkMode ? "bg-background-dark" : "bg-background"
      )}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
          className="w-16 h-16 rounded-full border-4 border-card border-t-button-primary border-l-button-primary"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen w-full",
      darkMode ? "bg-background-dark text-text-dark-primary" : "bg-background text-text-primary"
    )}>
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main Content */}
      <div className="ml-[15%] min-h-screen">
        {/* Dashboard Content */}
        <motion.main
          className="p-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* First Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
            <div className="lg:col-span-5">
              <ScoreChart />
            </div>
            <div className="lg:col-span-2">
              <StressChart />
            </div>
          </div>
          
          {/* Second Row: Stat Cards */}
          <StatCards />
          
          {/* New Row: AI Mood Analytics */}
          <motion.div 
            className="mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <MoodInsightsCard />
          </motion.div>
          
          {/* Chart.js Visualization */}
          <AIMetricsSection darkMode={darkMode} />
          
          {/* Third Row: Promo Card */}
          <PromoCard />

          <motion.section 
            className={cn(
              "rounded-lg p-6 mb-6",
              darkMode ? "bg-card-dark" : "bg-card"
            )}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h2 className="text-2xl font-bold mb-4">AI Mood Insights</h2>
            
            {/* Add refresh button and status indicators */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                {insights?.lastUpdated ? 
                  `Last updated: ${new Date(insights.lastUpdated).toLocaleString()}` : 
                  ''}
              </div>
              <button 
                onClick={fetchInsights}
                disabled={loading}
                className={cn(
                  "flex items-center px-3 py-1 text-sm rounded-md transition-colors",
                  loading ? 
                    "bg-gray-300 text-gray-600 cursor-not-allowed" : 
                    "bg-primary text-white hover:bg-primary-dark"
                )}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh Insights
                  </>
                )}
              </button>
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !error && !insights?.monthlySummary && (
              <div className="text-center py-8">
                <h3 className="text-xl mb-2">No Mood Data Yet</h3>
                <p className="text-gray-500 mb-4">
                  Start tracking your moods to see personalized AI insights and recommendations.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => navigate('/mood')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Start Tracking
                  </button>
                  <button
                    onClick={populateMockData}
                    disabled={mockDataLoading}
                    className={cn(
                      "px-4 py-2 bg-secondary text-white rounded-md transition-colors",
                      mockDataLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary-dark"
                    )}
                  >
                    {mockDataLoading ? (
                      <span className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Generating Test Data...
                      </span>
                    ) : mockDataSuccess ? (
                      "Data Generated Successfully!"
                    ) : (
                      "Generate Jan-Apr 2025 Test Data"
                    )}
                  </button>
                </div>
                {mockDataSuccess && (
                  <p className="mt-4 text-green-500">
                    Mood data has been generated! Please wait while AI insights are being processed...
                  </p>
                )}
              </div>
            )}
            
            {!loading && !error && insights?.monthlySummary && (
              <div className="grid gap-6">
                <div className="bg-opacity-10 bg-primary p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Monthly Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300">{insights.monthlySummary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-opacity-10 bg-success p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                    <p className="text-gray-600 dark:text-gray-300">{insights.status}</p>
                  </div>
                  <div className="bg-opacity-10 bg-info p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Trend Prediction</h3>
                    <p className="text-gray-600 dark:text-gray-300">{insights.predictedTrend}</p>
                  </div>
                </div>
                
                <div className="bg-opacity-10 bg-warning p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Personalized Suggestions</h3>
                  <ul className="space-y-2">
                    {insights.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <span className="text-primary">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
} 