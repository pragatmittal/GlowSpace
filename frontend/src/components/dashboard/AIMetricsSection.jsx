import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AIMetricsSection = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  // Mock data for demonstration
  const moodDistribution = {
    labels: ['Happy', 'Neutral', 'Sad', 'Anxious', 'Angry'],
    datasets: [
      {
        data: [30, 25, 15, 20, 10],
        backgroundColor: [
          '#4CAF50',
          '#9E9E9E',
          '#2196F3',
          '#FFC107',
          '#F44336'
        ]
      }
    ]
  };

  const moodTrends = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood Score',
        data: [75, 80, 65, 70, 85, 90, 95],
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mood Distribution'
      }
    }
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Mood Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        AI-Powered Mood Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Mood Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={moodDistribution} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Weekly Mood Trends
          </h3>
          <div className="h-64">
            <Line data={moodTrends} options={lineOptions} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          AI Recommendations
        </h3>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-gray-800 dark:text-white">
            Based on your recent mood patterns, we recommend:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Practice mindfulness meditation for 10 minutes daily</li>
            <li>Take regular breaks during work hours</li>
            <li>Maintain a consistent sleep schedule</li>
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default AIMetricsSection; 