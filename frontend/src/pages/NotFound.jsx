import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Check if the current path is the misspelled 'assesment'
    if (path === '/assesment') {
      // Redirect to the correct path after a brief delay
      const redirectTimer = setTimeout(() => {
        navigate('/assessment', { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [path, navigate]);

  // For the misspelled route, show a loading state
  if (path === '/assesment') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2EC]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#563C26] text-xl font-medium"
        >
          Redirecting to assessment page...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EC] p-4">
      <motion.div 
        className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[#563C26] mb-4">Page Not Found</h1>
        <p className="text-gray-700 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <motion.button 
          className="inline-block bg-[#563C26] text-white px-6 py-3 rounded-lg hover:bg-[#563C26]/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Go back home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound; 