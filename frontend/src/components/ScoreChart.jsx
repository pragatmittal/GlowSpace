import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AssessmentComponent = () => {
  const [freudScore, setFreudScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreudScore = async () => {
      setLoading(true);
      try {
        // Get user ID from auth context or localStorage
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        if (!userId) {
          console.warn('User ID not found, cannot fetch Freud score');
          setError('User authentication required');
          setLoading(false);
          return;
        }
        
        // Log request details for debugging
        console.log(`Fetching Freud score for user: ${userId}`);
        
        // Add userId as query parameter
        const response = await axios.get(`${API_BASE_URL}/api/assessment/freud-score`, {
          params: { userId },
          withCredentials: true, // Include cookies if using session-based auth
        });
        
        console.log('Freud score response:', response.data);
        setFreudScore(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching Freud AI score:', err);
        console.error('Error details:', err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        } : 'No response from server');
        setError('Failed to load assessment data. Please try again later.');
        // Set default/fallback data
        setFreudScore({
          overall: 0,
          categories: {
            anxiety: 0,
            depression: 0,
            stress: 0,
            // other categories...
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFreudScore();
  }, []);  // Add any dependencies if needed

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {freudScore && (
        <div>
          <h2>Freud AI Score</h2>
          <p>Overall: {freudScore.overall}</p>
          <div>
            <h3>Categories</h3>
            <p>Anxiety: {freudScore.categories.anxiety}</p>
            <p>Depression: {freudScore.categories.depression}</p>
            <p>Stress: {freudScore.categories.stress}</p>
            {/* Render other categories... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentComponent;
