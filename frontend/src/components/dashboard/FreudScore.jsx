import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FreudScore = () => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreudScore = async () => {
      try {
        const response = await axios.get('/api/analysis/freud-score/history');
        if (response.data.success) {
          setScoreData(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch Freud score data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreudScore();
  }, []);

  if (loading) return <div className="animate-pulse">Loading Freud score...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!scoreData || scoreData.length === 0) return <div>No Freud score data available</div>;

  const chartData = {
    labels: scoreData.map(score => new Date(score.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Overall Score',
        data: scoreData.map(score => score.score),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Ego',
        data: scoreData.map(score => score.components.ego),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Superego',
        data: scoreData.map(score => score.components.superego),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Id',
        data: scoreData.map(score => score.components.id),
        borderColor: 'rgb(255, 206, 86)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Freud AI Score Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const latestScore = scoreData[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Freud AI Score</h2>
      
      <div className="mb-6">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Latest Analysis</h3>
          <p className="text-gray-700">{latestScore.analysis}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Component Scores</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Ego:</span>
              <span className="font-semibold">{latestScore.components.ego}</span>
            </div>
            <div className="flex justify-between">
              <span>Superego:</span>
              <span className="font-semibold">{latestScore.components.superego}</span>
            </div>
            <div className="flex justify-between">
              <span>Id:</span>
              <span className="font-semibold">{latestScore.components.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreudScore; 