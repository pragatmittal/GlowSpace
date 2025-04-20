import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Calendar,
  AlertCircle,
  Smile,
  PieChart as PieChartIcon,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { cn } from '../ui/utils';

// Colors for different moods
const MOOD_COLORS = {
  overjoyed: '#FFD700', // Gold
  happy: '#4CAF50',     // Green
  neutral: '#90A4AE',   // Blue Grey
  sad: '#2196F3',       // Blue
  depressed: '#9C27B0'  // Purple
};

// Labels for mood scores
const MOOD_LABELS = {
  overjoyed: 'Overjoyed',
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  depressed: 'Depressed'
};

export default function MoodAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch mood analysis data
  const fetchMoodAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/moods/analysis', {
        withCredentials: true
      });
      
      setAnalysis(response.data.data);
    } catch (err) {
      console.error('Error fetching mood analysis:', err);
      setError(err.response?.data?.message || 'Failed to load mood analysis data');
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh data
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    await fetchMoodAnalysis();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Load data on component mount
  useEffect(() => {
    fetchMoodAnalysis();
  }, []);

  // Render loading state
  if (loading && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6 h-full w-full",
          "shadow-card transition-shadow",
          "flex flex-col items-center justify-center"
        )}
      >
        <div className="flex items-center justify-center h-32">
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <PieChartIcon className="w-12 h-12 text-primary" />
          </motion.div>
        </div>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary mt-4">
          Loading mood analysis...
        </p>
      </motion.div>
    );
  }

  // Render error state
  if (error && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6 h-full w-full",
          "shadow-card transition-shadow",
          "flex flex-col"
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
            Mood Analysis
          </h3>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-grow">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-center mb-2">Failed to load mood analysis</p>
          <p className="text-text-secondary dark:text-text-dark-secondary text-center text-sm mb-4">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // Render insufficient data state
  if (analysis && !analysis.hasSufficientData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6 h-full w-full",
          "shadow-card transition-shadow",
          "flex flex-col"
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
            Mood Analysis
          </h3>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full mb-6">
            <Smile className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-3">
            No Mood Data Yet
          </h4>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
            {analysis.message || "Track your moods regularly to receive personalized insights and recommendations."}
          </p>
          <button
            onClick={() => window.location.href = '/mood-tracker'}
            className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-md"
          >
            Log Your First Mood
          </button>
        </div>
      </motion.div>
    );
  }

  // Prepare data for the charts
  const dailyMoodData = analysis?.chartData?.dailyMoods || [];
  const moodPercentages = analysis?.summary?.moodPercentages || {};
  
  // Convert mood percentages to pie chart data
  const moodPieData = Object.keys(moodPercentages).map(mood => ({
    name: MOOD_LABELS[mood],
    value: parseFloat(moodPercentages[mood]),
    color: MOOD_COLORS[mood]
  }));

  // Format recommendations for display
  const recommendations = analysis?.recommendations || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card dark:bg-card-dark rounded-2xl p-6",
        "shadow-card hover:shadow-card-hover transition-shadow",
        "flex flex-col"
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
            AI Mood Analysis
          </h3>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
            Personalized insights based on your mood history
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Mood Over Time Chart */}
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <BarChart2 className="w-5 h-5 mr-2 text-primary" />
            <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
              Mood Trends
            </h4>
          </div>
          
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyMoodData.filter(d => d.hasMood)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => {
                    // Format date to show day only
                    const date = new Date(val);
                    return date.getDate();
                  }}
                />
                <YAxis 
                  domain={[1, 5]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => {
                    // Map numbers to mood names
                    if (val === 5) return 'Overjoyed';
                    if (val === 4) return 'Happy';
                    if (val === 3) return 'Neutral';
                    if (val === 2) return 'Sad';
                    if (val === 1) return 'Depressed';
                    return '';
                  }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    // Map score to mood name
                    const score = parseFloat(value);
                    if (score >= 4.5) return 'Overjoyed';
                    if (score >= 3.5) return 'Happy';
                    if (score >= 2.5) return 'Neutral';
                    if (score >= 1.5) return 'Sad';
                    return 'Depressed';
                  }}
                  labelFormatter={(label) => {
                    // Format date label
                    return new Date(label).toLocaleDateString();
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4F3222" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Right side: Mood Distribution */}
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            <PieChartIcon className="w-5 h-5 mr-2 text-primary" />
            <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
              Mood Distribution
            </h4>
          </div>
          
          <div className="h-64 mt-2 flex flex-col items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {moodPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(1)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-sm text-text-secondary dark:text-text-dark-secondary text-center">
              Most frequent: <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                {MOOD_LABELS[analysis?.summary?.mostCommonMood] || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights Section */}
      <div className="mt-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
            Personalized Insights
          </h4>
        </div>
        
        <div className="space-y-4">
          {/* Day of week insights */}
          {analysis?.insights?.happiestDay && (
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-3">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-text-primary dark:text-text-dark-primary">
                  You tend to feel happiest on <span className="font-semibold">{analysis.insights.happiestDay}</span>
                  {analysis.insights.saddestDay && (
                    <> and less happy on <span className="font-semibold">{analysis.insights.saddestDay}</span></>
                  )}.
                </p>
              </div>
            </div>
          )}
          
          {/* Time of day insights */}
          {analysis?.insights?.timeOfDayPatterns && Object.keys(analysis.insights.timeOfDayPatterns).length > 0 && (
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-text-primary dark:text-text-dark-primary">
                  {(() => {
                    // Find the time of day with highest average mood
                    const timePatterns = analysis.insights.timeOfDayPatterns;
                    const times = Object.keys(timePatterns);
                    if (times.length === 0) return 'No time of day data available.';
                    
                    const bestTime = times.reduce((best, current) => 
                      parseFloat(timePatterns[current].average) > parseFloat(timePatterns[best].average) ? current : best, 
                      times[0]
                    );
                    
                    return `Your mood tends to be highest during the ${bestTime.toLowerCase()}.`;
                  })()}
                </p>
              </div>
            </div>
          )}
          
          {/* Trend insights */}
          {analysis?.insights?.trend && (
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full mr-3">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-text-primary dark:text-text-dark-primary">
                  {analysis.insights.trend}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
            <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
              Recommendations
            </h4>
          </div>
          
          <ul className="space-y-2 px-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-text-primary dark:text-text-dark-primary flex items-start">
                <div className="min-w-4 mr-2">•</div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* View Full History */}
      <div className="mt-6 flex justify-end">
        <a
          href="/mood/history"
          className="text-sm text-primary hover:underline flex items-center"
        >
          View full mood history
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
} 