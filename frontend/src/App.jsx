import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentPage2 from './pages/AssessmentPage2';
import SimpleTestPage from './pages/SimpleTestPage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Improved error fallback component with debugging info
const ErrorFallback = ({ error }) => {
  console.error("Application error:", error);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F2EC] p-4 text-[#563C26]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-2">We're sorry for the inconvenience. Please try again later.</p>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md max-w-md overflow-auto">
          <p className="font-medium">Error details (for developers):</p>
          <p className="text-sm">{error.toString()}</p>
        </div>
      )}
      <div className="flex space-x-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-[#A4B97F] text-[#563C26] rounded-full font-medium"
        >
          Return Home
        </button>
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

// Main App component with router configuration
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment2" element={<AssessmentPage2 />} />
          <Route path="/test" element={<SimpleTestPage />} />
          <Route path="/assesment2" element={<Navigate to="/assessment2" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
