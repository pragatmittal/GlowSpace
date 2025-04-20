import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const StressBreakdown = () => {
  const [stressData, setStressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStressBreakdown = async () => {
      setLoading(true);
      try {
        // Get user ID from auth context or localStorage
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        if (!userId) {
          console.warn('User ID not found, cannot fetch stress breakdown');
          setError('User authentication required');
          setLoading(false);
          return;
        }
        
        // Log request details for debugging
        console.log(`Fetching stress breakdown for user: ${userId}`);
        
        // Add userId as query parameter
        const response = await axios.get(`${API_BASE_URL}/api/assessment/stress-breakdown`, {
          params: { userId },
          withCredentials: true, // Include cookies if using session-based auth
        });
        
        console.log('Stress breakdown response:', response.data);
        setStressData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stress breakdown:', err);
        console.error('Error details:', err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        } : 'No response from server');
        setError('Failed to load stress data. Please try again later.');
        // Set default/fallback data
        setStressData({
          work: 0,
          personal: 0,
          financial: 0,
          health: 0,
          // other categories...
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStressBreakdown();
  }, []);  // Add any dependencies if needed

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Stress Breakdown</h1>
      {stressData && (
        <ul>
          <li>Work: {stressData.work}</li>
          <li>Personal: {stressData.personal}</li>
          <li>Financial: {stressData.financial}</li>
          <li>Health: {stressData.health}</li>
          {/* other categories... */}
        </ul>
      )}
    </div>
  );
};

export default StressBreakdown;
