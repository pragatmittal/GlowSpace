import React, { createContext, useContext, useState, useEffect } from 'react';
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

  /**
   * Check the current authentication status by fetching current user data
   * @returns {Promise<void>}
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      console.log('Checking authentication status...');
      
      // Use the dedicated auth check endpoint
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true
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
        
        console.log('Setting user data:', userData);
        setUser(userData);
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.log('User is not authenticated');
        setUser(null);
        localStorage.removeItem('user');
      }
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      // Even on error, clear user state to be safe
      setUser(null);
      localStorage.removeItem('user');
      setError('Authentication check failed');
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
      await axios.get('http://localhost:5000/api/auth/logout', {
        withCredentials: true
      });
      
      // Clear user data immediately for better UX
      setUser(null);
      // Remove user from localStorage
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      
      // Even if the server request fails, clear user data from client
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
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
      
      // Then verify with the server
      await checkAuthStatus();
    };
    
    initializeAuth();
  }, []);

  // Value provided to consumers of this context
  const contextValue = {
    user,
    loading,
    error,
    isAuthenticated: !!user || false,
    login,
    logout,
    register,
    checkAuthStatus
  };

  // Additional debugging to help identify authentication issues
  useEffect(() => {
    console.log('AuthContext state updated:', {
      user: !!user,
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