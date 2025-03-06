import React from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto pt-20 pb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to GlowSpace</h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8">Your digital creative playground</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary">
            Get Started
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
      </motion.div>
      
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-semibold mb-3">Interactive Design</h3>
            <p className="text-white/80">Create stunning visual experiences with our intuitive tools</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
            <p className="text-white/80">Work together with teammates in real-time on shared projects</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-semibold mb-3">Portfolio Showcase</h3>
            <p className="text-white/80">Display your creations to the world with beautiful galleries</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
