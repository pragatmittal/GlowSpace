import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Fonts are applied via Tailwind classes to match the warm, friendly look

const AssessmentOption = ({ icon, text, isSelected, onClick }) => {
  return (
    <motion.div
      className={`flex items-center justify-between p-4 my-2 rounded-full cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#A4B97F] text-[#563C26]' 
          : 'bg-white text-[#563C26] shadow-sm'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center">
        <span className="mr-3.5 text-xl">{icon}</span>
        <span className="font-medium">
          {text}
        </span>
      </div>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
        isSelected ? 'border-white' : 'border-gray-300'
      }`}>
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
      </div>
    </motion.div>
  );
};

const AssessmentPage = () => {
  const [selectedOption, setSelectedOption] = useState('ai_therapy');
  const navigate = useNavigate();
  
  const options = [
    { id: 'reduce_stress', icon: '🤍', text: 'I wanna reduce stress' },
    { id: 'cope_trauma', icon: '🚩', text: 'I want to cope with trauma' },
    { id: 'trying_out', icon: '🎒', text: 'Just trying out the app, mate!' },
    { id: 'ai_therapy', icon: '🤖', text: 'I wanna try AI Therapy' },
    { id: 'better_person', icon: '😊', text: 'I want to be a better person' },
  ];

  const handleBackButtonClick = () => {
    window.location.href = "http://localhost:3000/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EC] p-4">
      <motion.div 
        className="w-full max-w-4xl bg-[#F7F2EC] rounded-3xl shadow-lg p-8 md:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with back button, title, and progress indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full border border-[#563C26] flex items-center justify-center mr-4 cursor-pointer"
              onClick={handleBackButtonClick}
            >
              <span className="text-[#563C26]">←</span>
            </div>
            <span className="font-bold text-[#563C26] text-xl">Assessment</span>
          </div>
          <span className="text-sm text-[#563C26] opacity-70">1 of 14</span>
        </div>
        
        {/* Question */}
        <h1 className="text-3xl font-bold text-[#563C26] leading-tight mb-10">
          What's your health goal for today?
        </h1>

        {/* Options grid - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="md:pr-2">
            <AssessmentOption
              icon="🤍"
              text="I wanna reduce stress"
              isSelected={selectedOption === 'reduce_stress'}
              onClick={() => setSelectedOption('reduce_stress')}
            />
          </div>
          <div className="md:pl-2">
            <AssessmentOption
              icon="🤖"
              text="I wanna try AI Therapy"
              isSelected={selectedOption === 'ai_therapy'}
              onClick={() => setSelectedOption('ai_therapy')}
            />
          </div>
          <div className="md:pr-2">
            <AssessmentOption
              icon="🚩"
              text="I want to cope with trauma"
              isSelected={selectedOption === 'cope_trauma'}
              onClick={() => setSelectedOption('cope_trauma')}
            />
          </div>
          <div className="md:pl-2">
            <AssessmentOption
              icon="😊"
              text="I want to be a better person"
              isSelected={selectedOption === 'better_person'}
              onClick={() => setSelectedOption('better_person')}
            />
          </div>
          <div className="md:pr-2">
            <AssessmentOption
              icon="🎒"
              text="Just trying out the app, mate!"
              isSelected={selectedOption === 'trying_out'}
              onClick={() => setSelectedOption('trying_out')}
            />
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-center">
          <motion.button
            className="w-full max-w-xs bg-[#563C26] text-white py-4 rounded-full font-medium text-base shadow-md"
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(86, 60, 38, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/assessment2')}
          >
            Continue →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentPage;