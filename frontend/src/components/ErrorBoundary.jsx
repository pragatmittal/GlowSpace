import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F2EC] p-4">
          <motion.div 
            className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-[#563C26] mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-700 mb-6">
              The page you're looking for doesn't seem to exist.
            </p>
            <Link to="/">
              <motion.button 
                className="inline-block bg-[#563C26] text-white px-6 py-3 rounded-lg hover:bg-[#563C26]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go back home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 