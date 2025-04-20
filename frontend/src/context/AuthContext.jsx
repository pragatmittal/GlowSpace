import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * Authentication Context for managing user authentication state
 */
const AuthContext = createContext();

/**
 * Custom hook to use the auth context
 * @returns {Object} The auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component that provides authentication state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Store the last check time to prevent too frequent checks
  const lastCheckRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  
  /**
   * Check the current authentication status by fetching current user data
   * @returns {Promise<void>}
   */
  const checkAuthStatus = async () => {
    // Debounce auth checks - prevent multiple calls within 2 seconds
    const now = Date.now();
    if (now - lastCheckRef.current < 2000) {
      console.log('Skipping auth check - too soon since last check');
      return;
    }
    
    // Update the last check time
    lastCheckRef.current = now;
    
    try {
      // Only set loading if not already authenticated
      if (!user) {
        setLoading(true);
      }
      
      console.log('Checking authentication status...');
      
      // Use the dedicated auth check endpoint
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true,
        timeout: 5000 // Set a timeout to prevent hanging
      });
      
      console.log('Auth check response:', response.data);
      
      if (response.data.isAuthenticated && response.data.user) {
        // We have authenticated user data
        const userData = {
          _id: response.data.user._id || response.data.user.id,
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          image: response.data.user.image || null,
          provider: response.data.user.provider || 'email',
        };
        
        // Only update if the user data has actually changed
        const currentUserStr = JSON.stringify(user);
        const newUserStr = JSON.stringify(userData);
        
        if (currentUserStr !== newUserStr) {
          console.log('Updating user data - changed detected');
          setUser(userData);
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('lastAuthCheck', Date.now().toString());
          
          // Set the authentication token
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Set the token in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
        } else {
          console.log('User data unchanged - skipping update');
        }
      } else if (user) {
        // Only update if we currently have a user but should be logged out
        console.log('User is not authenticated - logging out');
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      
      // Clear any previous errors
      if (error) {
        setError(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      
      // Check if this is a network error (server down or network issues)
      if (err.code === 'ERR_NETWORK') {
        console.log('Network error detected. Falling back to localStorage data if available');
        
        // Get stored user data from localStorage if available
        const storedUser = localStorage.getItem('user');
        const lastAuthCheck = localStorage.getItem('lastAuthCheck');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Use stored user data as fallback
            if (!user || JSON.stringify(user) !== storedUser) {
              console.log('Using stored user data as fallback');
              setUser(parsedUser);
            }
            
            // Don't show error if we have a fallback and the last check was recent (within 24 hours)
            if (lastAuthCheck && (Date.now() - parseInt(lastAuthCheck)) < 24 * 60 * 60 * 1000) {
              console.log('Using recent authentication data from local storage');
              setError('Using offline mode. Some features may be limited.');
            } else {
              setError('Unable to connect to server. Using offline data.');
            }
          } catch (parseErr) {
            console.error('Failed to parse user from localStorage:', parseErr);
            setError('Authentication check failed - please try again later');
          }
        } else {
          setError('Unable to connect to server. Please check your connection.');
        }
      } else if (err.response && err.response.status === 401) {
        // Handle unauthorized error
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('lastAuthCheck');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError('Your session has expired. Please log in again.');
      } else {
        // Handle other errors
        setError('Authentication check failed - server error');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Make API call to login endpoint with credentials
      const response = await axios.post(
        'http://localhost:5000/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );
      
      console.log('Login response:', response.data);
      
      // Update user state based on response
      // Handle different response structures
      if (response.data && (response.data.user || response.data.success)) {
        let userData = response.data.user;
        
        // If user data is nested within response
        if (!userData && response.data.success) {
          userData = response.data; // Assume user data is in the root
        }
        
        // Extract user data
        if (userData) {
          const formattedUser = {
            _id: userData.id || userData._id,
            name: userData.name || '',
            email: userData.email || '',
            image: userData.image || null,
            provider: userData.provider || 'email',
          };
          
          console.log('Setting user data after login:', formattedUser);
          setUser(formattedUser);
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(formattedUser));
          setError(null);
          
          // Set the authentication token
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Set the token in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
          
          return { success: true };
        }
      } 
      
      throw new Error('No user data received');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        userData,
        { withCredentials: true }
      );
      
      if (response.data && response.data.user) {
        // Ensure we have a consistent user object structure
        const formattedUser = {
          _id: response.data.user.id || response.data.user._id,
          name: response.data.user.name || userData.name || '',
          email: response.data.user.email || userData.email || '',
          image: response.data.user.image || null,
          provider: response.data.user.provider || 'email',
        };
        
        setUser(formattedUser);
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(formattedUser));
        setError(null);
        
        // Set the authentication token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          // Set the token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return { success: true };
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      
      // Even if the server request fails, clear user data from client
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('lastAuthCheck');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Force clear authentication state (for troubleshooting)
   */
  const forceLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastAuthCheck');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    setLoading(false);
    console.log('Authentication state forcibly cleared');
  };

  // Initialize from localStorage and check auth status on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Try to load user from localStorage first for immediate UI update
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('Initialized user from localStorage:', parsedUser);
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
          localStorage.removeItem('user');
        }
      }
      
      // Then verify with the server - only on initial mount
      await checkAuthStatus();
    };
    
    initializeAuth();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Add a function to check server connectivity
  const checkServerConnectivity = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api', {
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log('Server connection restored');
        setIsOffline(false);
        reconnectAttempts.current = 0;
        // Re-authenticate now that we're back online
        checkAuthStatus();
        return true;
      }
    } catch (err) {
      console.log('Server still unavailable', err);
      setIsOffline(true);
      return false;
    }
  };

  // Add a reconnection function that implements exponential backoff
  const scheduleReconnection = () => {
    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Calculate backoff time (between 5s and 2min)
    const maxBackoff = 120000; // 2 minutes
    const minBackoff = 5000; // 5 seconds
    const backoff = Math.min(maxBackoff, minBackoff * Math.pow(2, reconnectAttempts.current));
    
    console.log(`Scheduling reconnection attempt in ${backoff/1000} seconds`);
    
    reconnectTimeoutRef.current = setTimeout(async () => {
      // Attempt to reconnect
      const connected = await checkServerConnectivity();
      
      if (!connected) {
        // If still not connected, increment attempts and try again
        reconnectAttempts.current++;
        scheduleReconnection();
      }
    }, backoff);
  };

  // Add a network status listener effect
  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser reports online status');
      checkServerConnectivity();
    };
    
    const handleOffline = () => {
      console.log('Browser reports offline status');
      setIsOffline(true);
      // Start reconnection attempts
      reconnectAttempts.current = 0;
      scheduleReconnection();
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connectivity check
    checkServerConnectivity();
    
    return () => {
      // Clean up
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Handle offline status transitions
  useEffect(() => {
    if (isOffline) {
      console.log('Application is in offline mode');
      // Start reconnection attempt if not already scheduled
      if (!reconnectTimeoutRef.current) {
        reconnectAttempts.current = 0;
        scheduleReconnection();
      }
    } else {
      console.log('Application is in online mode');
      // Clear reconnection attempts when back online
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }
  }, [isOffline]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!(user && user._id),
    isOffline,
    login,
    logout,
    register,
    checkAuthStatus,
    forceLogout,
    checkServerConnectivity
  }), [
    // Include only state values that should trigger context updates
    user, 
    loading, 
    error,
    isOffline
    // Functions are stable references and shouldn't change
    // (they're defined in the same render scope and close over state)
  ]);

  // Additional debugging to help identify authentication issues
  useEffect(() => {
    console.log('AuthContext state updated:', {
      user: user ? { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        image: !!user.image 
      } : null,
      isAuthenticated: !!user,
      loading
    });
  }, [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 