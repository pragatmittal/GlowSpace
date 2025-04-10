import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Bell, LogOut, Settings, User, RefreshCw, Camera, Upload, X } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user, isAuthenticated, loading, logout, checkAuthStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Debug authentication state
  useEffect(() => {
    console.log('Navbar auth state:', { user, isAuthenticated, loading });
  }, [user, isAuthenticated, loading]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

  // Always show avatar for testing authentication state
  const showDebugAvatar = () => {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold border-2 border-amber-600">
          DN
        </div>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Debug</div>
      </div>
    );
  };

  return (
    <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                GlowSpace
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className={`text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium transition-colors ${location.pathname === '/' ? 'border-b-2 border-indigo-600' : ''}`}>
                Home
              </Link>
              <Link to="/services" className={`text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium transition-colors ${location.pathname === '/services' ? 'border-b-2 border-indigo-600' : ''}`}>
                Services
              </Link>
              <Link to="/about" className={`text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium transition-colors ${location.pathname === '/about' ? 'border-b-2 border-indigo-600' : ''}`}>
                About
              </Link>
              <Link to="/contact" className={`text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium transition-colors ${location.pathname === '/contact' ? 'border-b-2 border-indigo-600' : ''}`}>
                Contact
              </Link>
            </div>
          </div>

          {/* Auth debug status indicator */}
          <div className="hidden md:flex items-center px-3 py-1 mx-2 text-xs bg-gray-100 rounded-md">
            <span className="mr-1">Auth:</span>
            {isAuthenticated ? 
              <span className="text-green-600 font-medium">Authenticated</span> : 
              <span className="text-red-600 font-medium">Not Authenticated</span>
            }
            {loading && <span className="ml-1 text-blue-500">(Loading...)</span>}
            <button 
              onClick={refreshAuthStatus}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors" 
              disabled={isRefreshing}
              title="Refresh authentication status"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Right side section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Always show avatar for debugging */}
            {user || isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {/* Notifications */}
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    3
                  </span>
                </div>
                
                {/* Streak Animation */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <DotLottieReact
                    src="https://lottie.host/72842f7e-0a5d-4fed-b33f-96d80391b00a/Z4GHZpJxPi.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Profile Avatar with Image Upload */}
                <div className="relative profile-menu" ref={dropdownRef}>
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsProfileMenuOpen(true)}
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <button 
                      className="flex items-center space-x-2 group relative"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                    >
                      {user && user.image ? (
                        <div className="relative">
                          <img
                            src={user.image}
                            alt={user.name || 'User'}
                            className={`w-10 h-10 rounded-full border-2 ${isUploading ? 'border-yellow-500 animate-pulse' : 'border-purple-500 group-hover:border-purple-600'} transition-colors object-cover`}
                          />
                          {isProfileMenuOpen && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileInput();
                              }} 
                              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
                            >
                              <Camera className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold border-2 ${isUploading ? 'border-yellow-500 animate-pulse' : 'border-purple-500 group-hover:border-purple-600'} transition-colors`}>
                            {getUserInitials()}
                          </div>
                          {isProfileMenuOpen && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileInput();
                              }} 
                              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
                            >
                              <Camera className="h-5 w-5 text-white" />
                            </div>
                          )}
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
                  </div>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50 animated fadeIn">
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
                      
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                        <User className="mr-3 h-4 w-4 text-gray-500" />
                        Profile
                      </Link>
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
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshAuthStatus}
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  disabled={isRefreshing}
                  title="Refresh authentication status"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <Link to="/auth/sign-in" className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            {/* User info for mobile */}
            {user || isAuthenticated ? (
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
            {user || isAuthenticated ? (
              <>
                <hr className="my-2" />
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
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
                <button
                  onClick={refreshAuthStatus}
                  className="flex items-center text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Login Status
                </button>
                <Link 
                  to="/auth/sign-in" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
