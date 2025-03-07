import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import { placeholders } from '../assets/images/placeholder';

const Navbar = () => {
  const location = useLocation();
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation items
  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <ImageWithFallback
            src={placeholders.logo()}
            alt="GlowSpace Logo"
            width={120}
            height={40}
            className="h-10"
          />
        </Link>

        {/* Main navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-base font-medium ${
                isActive(item.path)
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600 transition-colors'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Sign In
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
