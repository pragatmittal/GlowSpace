import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  
  // Handle null error case properly
  const errorMessage = error ? (error.statusText || error.message || String(error)) : "Unknown error occurred";
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F2EC] p-4 text-[#563C26]">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="mb-2">We're sorry for the inconvenience. Please try again later.</p>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md max-w-md overflow-auto">
          <p className="font-medium">Error details:</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      <div className="flex space-x-4 mt-4">
        <Link to="/" className="px-6 py-2 bg-[#A4B97F] text-[#563C26] rounded-full font-medium">
          Return Home
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white border border-[#A4B97F] text-[#563C26] rounded-full font-medium"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;