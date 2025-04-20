import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoading } from '../../context/LoadingContext';

const MoodInsights = () => {
  const [insights, setInsights] = useState(null);
  const { startFetching, hideLoading, showError } = useLoading();

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      startFetching('Loading mood insights...');
      const response = await axios.get('http://localhost:5000/api/moods/analysis', {
        withCredentials: true
      });
      setInsights(response.data.data);
      hideLoading();
    } catch (error) {
      console.error('Error fetching insights:', error);
      showError('Failed to load mood insights');
      hideLoading();
    }
  };

  if (!insights) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-400">Loading insights...</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend.toLowerCase()) {
      case 'improving':
        return '↗️';
      case 'declining':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Mood Insights</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Card */}
          <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Emotional Well-being Status</h2>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${getStatusColor(insights.status)}`}>
                {insights.status}
              </span>
              <span className="text-2xl">{getTrendIcon(insights.status)}</span>
            </div>
            <p className="mt-4 text-gray-400">
              Predicted trend: {insights.predictedTrend}
            </p>
          </div>

          {/* Monthly Summary Card */}
          <div className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
            <p className="text-gray-300 leading-relaxed">
              {insights.monthlySummary}
            </p>
          </div>

          {/* Suggestions Card */}
          <div className="md:col-span-2 bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-[#2D2D2D] p-4 rounded-lg flex items-start gap-3"
                >
                  <span className="text-2xl">💡</span>
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-right">
          Last updated: {new Date(insights.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MoodInsights; 