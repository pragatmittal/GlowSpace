import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../ui/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const stressLevels = [
  { id: 'low', label: 'Low', color: '#4CAF50' },
  { id: 'moderate', label: 'Moderate', color: '#FFC107' },
  { id: 'high', label: 'High', color: '#F44336' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-sidebar-dark p-3 rounded-lg shadow-lg">
        <p className="text-text-primary dark:text-text-dark-primary font-medium">{label}</p>
        <p className="text-chart-green font-bold">
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const StressChart = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stressData, setStressData] = useState([]);

  const fetchStressData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/assessment/stress-breakdown`);

      if (!response.data || !response.data.breakdown) {
        throw new Error('Invalid response format');
      }

      const { breakdown } = response.data;
      setStressData(breakdown);

      // Format data for chart
      setChartData([
        { name: 'Low', value: breakdown.low || 0 },
        { name: 'Moderate', value: breakdown.moderate || 0 },
        { name: 'High', value: breakdown.high || 0 }
      ]);
    } catch (err) {
      console.error('Error fetching stress breakdown:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view your stress breakdown');
      } else {
        setError('Failed to load stress breakdown data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStressData();
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
          <p className="font-semibold">Error loading stress breakdown</p>
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Stress Levels</h2>
      </div>

      <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={stressLevels[index].color} />
              ))}
            </Bar>
          </BarChart>
            </ResponsiveContainer>
          </div>

      <div className="mt-4 flex justify-center space-x-4">
        {stressLevels.map(level => (
          <div key={level.id} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: level.color }}
              />
            <span className="text-sm text-gray-600 dark:text-gray-300">{level.label}</span>
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default StressChart; 