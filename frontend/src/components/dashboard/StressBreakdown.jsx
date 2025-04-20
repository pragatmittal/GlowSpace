import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const StressBreakdown = () => {
  const [breakdownData, setBreakdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStressBreakdown = async () => {
      try {
        const response = await axios.get('/api/analysis/stress-breakdown/history');
        if (response.data.success) {
          setBreakdownData(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch stress breakdown data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStressBreakdown();
  }, []);

  if (loading) return <div className="animate-pulse">Loading stress breakdown...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!breakdownData || breakdownData.length === 0) return <div>No stress breakdown data available</div>;

  const latestBreakdown = breakdownData[0];

  const chartData = {
    labels: latestBreakdown.categories.map(category => category.name),
    datasets: [
      {
        data: latestBreakdown.categories.map(category => category.value),
        backgroundColor: latestBreakdown.categories.map(category => category.color),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Stress Breakdown'
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Stress Breakdown</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 md:h-80">
          <Pie data={chartData} options={options} />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Stress Level</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${latestBreakdown.totalStress}%` }}
              ></div>
            </div>
            <p className="text-right mt-1 text-sm text-gray-600">
              {latestBreakdown.totalStress}%
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-gray-700">{latestBreakdown.analysis}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Category Details</h3>
            <div className="space-y-2">
              {latestBreakdown.categories.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span className="font-semibold">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressBreakdown; 