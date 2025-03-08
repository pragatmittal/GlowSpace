import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Different loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  PAGE_TRANSITION: 'page_transition',
  FETCHING_DATA: 'fetching_data',
  SUCCESS: 'success',
};

// Create the context
const LoadingContext = createContext();

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [targetPath, setTargetPath] = useState('');
  const [progress, setProgress] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState('normal'); // 'slow', 'normal', 'fast'
  
  const navigate = useNavigate();
  const location = useLocation();

  // Function to show the loading screen
  const showLoading = (state, msg = '') => {
    setLoadingState(state);
    setMessage(msg);
    setIsVisible(true);
    
    // Reset progress
    setProgress(0);
    
    // Start progress animation
    if (state === LOADING_STATES.PAGE_TRANSITION) {
      animateProgress();
    }
  };

  // Function to hide the loading screen
  const hideLoading = () => {
    setIsVisible(false);
    // Reset after animation completes
    setTimeout(() => {
      setLoadingState(LOADING_STATES.IDLE);
      setMessage('');
      setProgress(0);
    }, 300); // Match the fade-out animation duration
  };

  // Simulate progress animation
  const animateProgress = () => {
    let startTime;
    let duration = 1000; // 1 second to reach 99%
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const elapsedTime = timestamp - startTime;
      const nextProgress = Math.min((elapsedTime / duration) * 99, 99); // Max 99%
      
      setProgress(nextProgress);
      
      if (nextProgress < 99) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Function for page navigation with loading
  const navigateWithLoading = (path, state = {}) => {
    if (path === location.pathname) return; // Don't navigate if already on the page
    
    setTargetPath(path);
    showLoading(LOADING_STATES.PAGE_TRANSITION, 'Navigating...');
    
    // Simulate network delay - in a real app, this would be based on actual network conditions
    const delay = networkSpeed === 'slow' ? 2000 : (networkSpeed === 'fast' ? 500 : 1000);
    
    setTimeout(() => {
      // Navigate and then hide loading
      navigate(path, state);
      // Wait a bit after navigation before hiding the loader
      setTimeout(hideLoading, 300);
    }, delay);
  };

  // Function to start data fetching animation
  const startFetching = (msg = 'Fetching Data...') => {
    showLoading(LOADING_STATES.FETCHING_DATA, msg);
  };

  // Function to show success message
  const showSuccess = (msg = 'Operation completed successfully!') => {
    showLoading(LOADING_STATES.SUCCESS, msg);
    // Auto-hide after 2 seconds
    setTimeout(hideLoading, 2000);
  };

  // Function to detect network speed (simplified version)
  useEffect(() => {
    const detectNetworkSpeed = () => {
      // Check navigator.connection if available (only in some browsers)
      if (navigator.connection) {
        const { effectiveType, downlink } = navigator.connection;
        
        if (effectiveType === '4g' && downlink > 5) {
          setNetworkSpeed('fast');
        } else if (effectiveType === '2g' || downlink < 1) {
          setNetworkSpeed('slow');
        } else {
          setNetworkSpeed('normal');
        }
      }
      
      // Alternative approach: measure image loading time
      const img = new Image();
      const startTime = performance.now();
      
      img.onload = () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        if (loadTime < 100) {
          setNetworkSpeed('fast');
        } else if (loadTime > 500) {
          setNetworkSpeed('slow');
        } else {
          setNetworkSpeed('normal');
        }
      };
      
      // Load a small test image
      img.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=`;
    };
    
    detectNetworkSpeed();
    
    // Re-detect network speed periodically
    const interval = setInterval(detectNetworkSpeed, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle page navigation completion
  useEffect(() => {
    if (targetPath && targetPath === location.pathname) {
      // We've reached the target path
      setTargetPath('');
    }
  }, [location.pathname, targetPath]);

  const contextValue = {
    loadingState,
    message,
    isVisible,
    progress,
    networkSpeed,
    navigateWithLoading,
    startFetching,
    showSuccess,
    showLoading,
    hideLoading,
  };
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}; 