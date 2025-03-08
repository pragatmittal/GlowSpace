import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';

export default function Header() {
  // Simulated user data - would come from a context or API in a real app
  const userData = {
    name: "Shinomiya",
    profilePicture: "https://i.pravatar.cc/100?img=32", // Placeholder profile pic
    notifications: 3,
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "h-20 sticky top-0 ml-[15%] w-[85%] z-20",
        "flex items-center justify-between px-8",
        "bg-background shadow-nav",
        "dark:bg-background-dark"
      )}
    >
      {/* Greeting */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center"
      >
        <h2 className="text-xl font-medium text-text-primary dark:text-text-dark-primary">
          Hello, <span className="font-bold">{userData.name}</span> 👋
        </h2>
      </motion.div>

      {/* Search */}
      <div className="flex-1 mx-12 max-w-md">
        <div className={cn(
          "bg-white dark:bg-sidebar-dark relative rounded-full h-12",
          "shadow-sm border border-gray-100 dark:border-transparent",
          "flex items-center px-4"
        )}>
          <Search className="h-5 w-5 text-text-secondary dark:text-text-dark-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "bg-transparent border-none outline-none w-full pl-3",
              "text-text-primary placeholder:text-text-secondary",
              "dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
            )}
          />
        </div>
      </div>

      {/* User Menu & Notifications */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <div className="relative">
          <button className="relative p-2 hover:bg-white/30 dark:hover:bg-white/5 rounded-full transition-colors">
            <Bell className="h-6 w-6 text-text-primary dark:text-text-dark-primary" />
            {userData.notifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "absolute top-0 right-0 w-4 h-4 bg-indicator-red rounded-full",
                  "flex items-center justify-center text-[10px] text-white font-bold"
                )}
              >
                {userData.notifications}
              </motion.span>
            )}
          </button>
        </div>

        {/* Profile Menu */}
        <div className="flex items-center">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={userData.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-sidebar-dark"
          />
          <ChevronDown className="h-4 w-4 text-text-primary dark:text-text-dark-primary ml-2" />
        </div>
      </div>
    </motion.header>
  );
} 