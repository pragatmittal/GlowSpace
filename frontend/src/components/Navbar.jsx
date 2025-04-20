import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Bell, LogOut, Settings, User, RefreshCw, Camera, Upload, X, LayoutDashboard, Wifi, WifiOff } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user, isAuthenticated, loading, logout, checkAuthStatus, forceLogout, isOffline, checkServerConnectivity } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Debug authentication state more explicitly
  useEffect(() => {
    console.log('🔍 Navbar auth state:', { 
      userExists: !!user, 
      userData: user ? {
        name: user.name,
        email: user.email,
        image: !!user.image
      } : null,
      isAuthenticated, 
      loading 
    });
  }, [user, isAuthenticated, loading]);

  // Check authentication status only on initial mount, not on re-renders
  useEffect(() => {
    // We'll log but skip the actual refresh since AuthContext already does this
    console.log('Navbar mounted - auth status managed by AuthContext');
    // Only refresh if explicitly needed for debugging
    // Removed auto-refresh to prevent re-render loops
  }, []); // Empty dependency array means this only runs once

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    console.log('Logging out user...');
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigate to dashboard
  const handleDashboardClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/dashboard');
  };

  // Manually refresh auth status
  const refreshAuthStatus = async () => {
    setIsRefreshing(true);
    try {
      await checkAuthStatus();
      console.log('Authentication status refreshed');
    } catch (error) {
      console.error('Failed to refresh auth status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle file upload for profile image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Upload to server
      const response = await axios.post('http://localhost:5000/api/auth/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update user context with new image
        await checkAuthStatus();
        // Refresh the page to show the new image
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Generate initials from user name
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Render the authentication section - separated for clarity
  const renderAuthSection = () => {
    // Force re-evaluation of auth state for testing
    const userIsAuthenticated = !!user && isAuthenticated;
    
    console.log('Auth State in Navbar:', { 
      user: !!user, 
      isAuthenticated, 
      userIsAuthenticated,
      loading
    });
    
    if (userIsAuthenticated) {
  return (
        <div className="flex items-center space-x-4" ref={dropdownRef}>
          <button 
            className="relative flex items-center"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            {user && user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-10 h-10 rounded-full border-2 border-purple-500 hover:border-purple-600 transition-colors object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold border-2 border-purple-500 hover:border-purple-600 transition-colors">
                {getUserInitials()}
              </div>
            )}
          </button>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">Signed in as</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.email || 'User'}</p>
          </div>

              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user && user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                        {getUserInitials()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Change photo
                    </button>
                  </div>
                </div>
                </div>

                  <button 
                onClick={handleDashboardClick}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
              >
                <LayoutDashboard className="mr-3 h-4 w-4 text-gray-500" />
                Dashboard
                  </button>
                  
              <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        Settings
                      </Link>
              
                      <hr className="my-1 border-gray-100" />
              
                      <button
                        onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
      );
    } else {
      // Return empty container when not authenticated
      return null;
    }
  };

  // Handle connection check
  const handleConnectionCheck = async () => {
    setIsRefreshing(true);
    try {
      const isConnected = await checkServerConnectivity();
      if (isConnected) {
        // If connection is restored, refresh auth status
        await checkAuthStatus();
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="bg-white shadow z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#553C2E] tracking-tighter">GlowSpace</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link to="/" className="px-3 py-2 rounded-md text-[#553C2E] hover:text-purple-500 hover:bg-gray-50 font-medium text-sm">
                Home
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-[#553C2E] hover:text-purple-500 hover:bg-gray-50 font-medium text-sm">
                About
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-md text-[#553C2E] hover:text-purple-500 hover:bg-gray-50 font-medium text-sm">
                Contact
              </Link>
              {!isAuthenticated && (
                <Link to="/auth/sign-in" className="px-3 py-2 rounded-md text-[#553C2E] hover:text-purple-500 hover:bg-gray-50 font-medium text-sm">
                Sign In
              </Link>
            )}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {/* Offline indicator */}
            {isOffline && (
              <div className="mr-4 px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center text-xs font-medium">
                <WifiOff size={14} className="mr-1" />
                <span>Offline</span>
                <button 
                  onClick={handleConnectionCheck}
                  className="ml-1 p-1 hover:bg-amber-200 rounded-full"
                  title="Try reconnecting"
                  disabled={isRefreshing}
                >
                  <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            )}

            {/* Debug bar */}
            <div className="mr-4 hidden md:flex space-x-2">
              <div className="px-2 py-1 rounded bg-gray-100 flex items-center text-xs">
                <button
                  onClick={refreshAuthStatus}
                  disabled={isRefreshing}
                  className="text-gray-600 flex items-center space-x-1 hover:text-indigo-600"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>Refresh Auth</span>
                </button>
              </div>
              <div className="px-2 py-1 rounded bg-gray-100 flex items-center text-xs">
                <button
                  onClick={forceLogout}
                  className="text-red-600 flex items-center space-x-1 hover:text-red-800"
                >
                  <LogOut size={14} />
                  <span>Force Logout</span>
                </button>
              </div>
              <div className="px-2 py-1 rounded bg-gray-100 flex items-center text-xs">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="text-gray-600 flex items-center space-x-1 hover:text-gray-800"
                >
                  <X size={14} />
                  <span>Clear Storage & Reload</span>
                </button>
              </div>
            </div>

            {/* Auth section */}
            {renderAuthSection()}

          {/* Mobile menu button */}
            <div className="flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 shadow-lg mt-2">
          <div className="flex flex-col space-y-2">
            {/* User info for mobile */}
            {user && isAuthenticated ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-2">
                <div className="relative">
                  {user && user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-12 h-12 rounded-full border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold border-2 border-purple-500">
                      {getUserInitials()}
                    </div>
                  )}
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full shadow-md"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
            ) : null}
            
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user && isAuthenticated ? (
              <>
                <hr className="my-2" />
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </button>
                <Link 
                  to="/settings" 
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 rounded-md font-medium transition-colors text-left w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Sign In button for mobile menu */}
                <hr className="my-2" />
              <Link 
                  to="/auth/sign-in" 
                  className="flex items-center text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                  <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
