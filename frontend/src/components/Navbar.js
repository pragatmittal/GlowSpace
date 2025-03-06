import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/images/logo.svg"
                  alt="GlowSpace Logo"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "https://via.placeholder.com/120x40?text=GlowSpace";
                  }}
                />
                <span className="ml-2 text-xl font-bold text-gray-900">GlowSpace</span>
              </Link>
            </div>
            
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
              <Link to="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <Link to="/services" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Services
              </Link>
              <Link to="/resources" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Resources
              </Link>
              <Link to="/community" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Community
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
              Log In
            </Link>
            <Link to="/signup" className="ml-4 inline-flex items-center px-5 py-2.5 bg-primary-600 border border-transparent rounded-lg font-medium text-white hover:bg-primary-700 transition duration-300">
              Sign Up
            </Link>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu toggle */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary-600 hover:bg-gray-100">
            Home
          </Link>
          <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
            Services
          </Link>
          <Link to="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
            Resources
          </Link>
          <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
            Community
          </Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
            About Us
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
            Contact
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100">
              Log In
            </Link>
            <Link to="/signup" className="ml-4 block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
