import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '../ui/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const timeframeOptions = [
  { id: '1d', label: '1 Day' },
  { id: '1w', label: '1 Week' },
  { id: '1m', label: '1 Month' },
  { id: '1y', label: '1 Year' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-sidebar-dark p-3 rounded-lg shadow-lg">
        <p className="text-text-primary dark:text-text-dark-primary font-medium">{label}</p>
        <p className="text-chart-green font-bold">
          Score: {parseFloat(payload[0].value).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const ScoreChart = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [score, setScore] = useState(0);
  const [change, setChange] = useState('0%');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFreudScore = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/assessment/freud-score`);

      if (!response.data || !response.data.score) {
        throw new Error('Invalid response format');
      }

      const { score, change, dailyScores } = response.data;
      setScore(score);
      setChange(change);

      // Format data for chart
      const formattedData = Object.entries(dailyScores).map(([day, value]) => ({
        time: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
        score: value
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error('Error fetching Freud AI score:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view your Freud AI score');
      } else {
        setError('Failed to load Freud AI score data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreudScore();
  }, [selectedTimeframe, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Error loading Freud AI score</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "rounded-lg p-6",
        "bg-white dark:bg-gray-800 shadow-lg"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Freud AI Score</h2>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold text-chart-green">{score.toFixed(1)}%</span>
            <span className={cn(
              "ml-2 text-sm font-medium",
              change.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              {change}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {timeframeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedTimeframe(option.id)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                selectedTimeframe === option.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#4CAF50"
              fill="#4CAF50"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ScoreChart; 