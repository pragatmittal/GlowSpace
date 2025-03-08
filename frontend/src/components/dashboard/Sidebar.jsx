import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Shield, 
  Settings, 
  User,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../ui/utils';

export default function Sidebar({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/dashboard/analytics' },
    { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/security' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  // Update the active item based on the current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => 
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "h-screen fixed left-0 top-0 w-[15%] py-8 px-4 flex flex-col",
        "bg-sidebar text-white z-30 shadow-sidebar",
        "dark:bg-sidebar-dark"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-12">
        <h1 className="text-2xl font-bold">GlowSpace</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className="block"
              >
                {({isActive}) => (
                  <motion.div
                    className={cn(
                      "flex items-center py-3 px-4 rounded-full transition-all",
                      "hover:bg-white/10",
                      (isActive || activeItem === item.id) ? "bg-white/20 font-medium" : ""
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                    
                    {(isActive || activeItem === item.id) && (
                      <motion.div 
                        className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="mt-auto">
        <button 
          onClick={toggleDarkMode}
          className={cn(
            "flex items-center justify-center w-full py-3 px-4 rounded-full", 
            "hover:bg-white/10 transition-colors"
          )}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 mr-3" />
          ) : (
            <Moon className="w-5 h-5 mr-3" />
          )}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </motion.div>
  );
} 