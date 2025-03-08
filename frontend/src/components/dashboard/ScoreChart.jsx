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

// Simulated data - in a real app, this would come from an API
const generateChartData = (timeframe) => {
  const baseLine = 95;
  const data = [];
  
  if (timeframe === '1d') {
    // Hourly data for 1 day
    for (let i = 0; i < 24; i++) {
      data.push({
        time: `${i}:00`,
        score: Math.max(85, Math.min(99, baseLine + Math.random() * 4 - 2)),
      });
    }
  } else if (timeframe === '1w') {
    // Daily data for 1 week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      data.push({
        time: days[i],
        score: Math.max(85, Math.min(99, baseLine + Math.random() * 5 - 2.5)),
      });
    }
  } else if (timeframe === '1m') {
    // Weekly data for 1 month
    for (let i = 1; i <= 4; i++) {
      data.push({
        time: `Week ${i}`,
        score: Math.max(85, Math.min(99, baseLine + Math.random() * 6 - 3)),
      });
    }
  } else {
    // Monthly data for 1 year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      data.push({
        time: months[i],
        score: Math.max(85, Math.min(99, baseLine + Math.random() * 7 - 3.5)),
      });
    }
  }
  
  return data;
};

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
          Score: {parseFloat(payload[0].value).toFixed(3)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function ScoreChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1w');
  const [chartData, setChartData] = useState([]);
  const [score, setScore] = useState(97.245);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setChartData(generateChartData(selectedTimeframe));
    
    // Simulate real-time score updates
    const interval = setInterval(() => {
      setScore(prev => {
        const newScore = Math.max(95, Math.min(99, prev + (Math.random() * 0.2 - 0.1)));
        return parseFloat(newScore.toFixed(3));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const handleTimeframeChange = (timeframe) => {
    setIsAnimating(true);
    setSelectedTimeframe(timeframe);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card dark:bg-card-dark rounded-2xl p-6",
        "shadow-card hover:shadow-card-hover transition-shadow", 
        "h-full"
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
          Freud AI Score
        </h3>
        <div className="flex space-x-2">
          {timeframeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleTimeframeChange(option.id)}
              className={cn(
                "px-3 py-1 text-sm rounded-full transition-colors",
                selectedTimeframe === option.id 
                  ? "bg-chart-green text-white font-medium" 
                  : "bg-white dark:bg-sidebar-dark text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-sidebar"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start mb-5">
        <motion.div
          key={score}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mr-4"
        >
          <div className="text-text-secondary dark:text-text-dark-secondary">Current Score</div>
          <div className="text-4xl font-bold text-text-primary dark:text-text-dark-primary">
            {score}%
          </div>
        </motion.div>
        
        <div className="ml-6 flex items-center text-chart-green">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium text-sm ml-1">+2.3%</span>
          <span className="text-text-secondary dark:text-text-dark-secondary text-sm ml-1">vs last period</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <motion.div
          animate={isAnimating ? { opacity: [1, 0, 1] } : { opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#79A66D" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#79A66D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E7" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#6D5B4B' }} 
                tickLine={false}
                axisLine={{ stroke: '#E7E7E7' }}
              />
              <YAxis 
                domain={[85, 100]} 
                tick={{ fill: '#6D5B4B' }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#79A66D" 
                fillOpacity={1}
                fill="url(#scoreGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
} 