import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ChevronDown, ChevronUp, Smile, Frown, RefreshCw, ArrowRight, AlertTriangle 
} from 'lucide-react';

// Array of colors for mood visualization
const MOOD_COLORS = {
  overjoyed: '#FFD700', // Gold
  happy: '#90EE90',     // Light Green
  neutral: '#D3D3D3',   // Light Gray
  sad: '#ADD8E6',       // Light Blue
  depressed: '#9370DB'  // Medium Purple
};

/**
 * MoodInsightsCard Component
 * Displays AI-powered insights about user's mood patterns
 */
const MoodInsightsCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch mood analysis data - update endpoint from 'mood/analysis' to 'moods/analysis'
  const fetchMoodAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);
      
      const response = await axios.get('http://localhost:5000/api/moods/analysis', {
        withCredentials: true
      });
      
      setAnalysis(response.data.data);
    } catch (error) {
      console.error('Error fetching mood analysis:', error);
      setError('Failed to load mood analysis. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMoodAnalysis();
  }, []);

  // Format mood distribution data for pie chart
  const formatMoodDistributionData = () => {
    if (!analysis || !analysis.moodDistribution) return [];
    
    return Object.keys(analysis.moodDistribution).map(mood => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: analysis.moodDistribution[mood],
      color: MOOD_COLORS[mood]
    }));
  };

  // Format weekly mood data for bar chart
  const formatWeeklyMoodData = () => {
    if (!analysis || !analysis.weeklyMoodGraph) return [];
    
    return analysis.weeklyMoodGraph.map(day => {
      const formattedDay = {
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
      };
      
      // Add counts for each mood type
      for (const mood in day.moods) {
        formattedDay[mood] = day.moods[mood];
      }
      
      return formattedDay;
    });
  };

  // Show loading state
  if (loading && !analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Mood Insights</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Mood Insights</h2>
          <button 
            onClick={fetchMoodAnalysis} 
            className="text-indigo-600 hover:text-indigo-800"
            title="Refresh analysis"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-8">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={fetchMoodAnalysis}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If we have no mood entries yet
  if (analysis && (!analysis.weeklyMoodGraph || analysis.weeklyMoodGraph.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Mood Insights</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Smile size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Mood Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your moods to see personalized AI insights and recommendations.
          </p>
          <a 
            href="/mood-tracker" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Start Tracking <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">AI Mood Insights</h2>
        <div className="flex items-center">
          {refreshing && (
            <span className="mr-2 text-xs text-gray-500">Refreshing...</span>
          )}
          <button 
            onClick={fetchMoodAnalysis} 
            className={`text-indigo-600 hover:text-indigo-800 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh analysis"
            disabled={refreshing}
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
            title={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Mood Summary Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Mood Summary</h3>
        <p className="text-gray-600">{analysis.summary}</p>
      </div>

      {/* Visualization Section */}
      {expanded && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Distribution Pie Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Mood Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatMoodDistributionData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatMoodDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Mood Bar Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Weekly Mood Trends</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatWeeklyMoodData()}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {Object.keys(MOOD_COLORS).map(mood => (
                      <Bar 
                        key={mood} 
                        dataKey={mood} 
                        name={mood.charAt(0).toUpperCase() + mood.slice(1)} 
                        stackId="a" 
                        fill={MOOD_COLORS[mood]} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Recommendations</h3>
        <ul className="space-y-2">
          {analysis.recommendations.slice(0, expanded ? undefined : 3).map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-600">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Show More/Less Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center mx-auto"
        >
          {expanded ? 'Show Less' : 'Show More'} 
          {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default MoodInsightsCard; 