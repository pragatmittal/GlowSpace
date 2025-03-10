import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

// Simplified version to isolate the error
const AssessmentPage2 = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#F7F2EC] flex flex-col p-4">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate('/assessment')}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E7E2DC]"
        >
          <IoArrowBack size={24} className="text-[#563C26]" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-medium text-[#563C26]">Assessment</h1>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#563C26] mb-6">What's your official gender?</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <button className="bg-white p-4 rounded-xl shadow-sm">Male</button>
          <button className="bg-white p-4 rounded-xl shadow-sm">Female</button>
        </div>
        <button className="bg-[#E0E9CA] px-6 py-2 rounded-full text-[#563C26]">
          Skip
        </button>
      </div>
    </div>
  );
};

export default AssessmentPage2;
