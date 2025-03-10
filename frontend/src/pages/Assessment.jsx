import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AssessmentOption = ({ icon, text, isSelected, onClick }) => {
  return (
    <motion.div
      className={`flex items-center p-4 my-2 rounded-full border cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#A4B97F] border-[#A4B97F]' 
          : 'bg-white border-gray-200 hover:border-[#563C26]/30'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className={`font-medium ${isSelected ? 'text-[#563C26]' : 'text-[#563C26]'}`}>
        {text}
      </span>
    </motion.div>
  );
};

const Assessment = () => {
  const [selectedOption, setSelectedOption] = useState('ai_therapy');
  
  const options = [
    { id: 'reduce_stress', icon: '🤍', text: 'I wanna reduce stress' },
    { id: 'cope_trauma', icon: '🚩', text: 'I want to cope with trauma' },
    { id: 'trying_out', icon: '🎒', text: 'Just trying out the app, mate!' },
    { id: 'ai_therapy', icon: '🤖', text: 'I wanna try AI Therapy' },
    { id: 'better_person', icon: '😊', text: 'I want to be a better person' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EC] p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-xl mr-2">🌙</span>
            <span className="font-bold text-[#563C26]">Assessment</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#563C26]">
            What's your health goal for today?
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-6">
          {options.map(option => (
            <AssessmentOption
              key={option.id}
              icon={option.icon}
              text={option.text}
              isSelected={selectedOption === option.id}
              onClick={() => setSelectedOption(option.id)}
            />
          ))}
        </div>

        <motion.button
          className="w-full bg-[#563C26] text-white py-4 rounded-full font-medium shadow-sm"
          whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
        >
          Continue →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Assessment; 