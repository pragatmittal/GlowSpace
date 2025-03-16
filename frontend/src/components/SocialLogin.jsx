import React from 'react';
import { Instagram } from "lucide-react";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="flex justify-center space-x-4 mt-10">
      <button 
        className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30"
      >
        <span className="text-xl text-brown font-medium">f</span>
      </button>
      <button 
        onClick={handleGoogleLogin}
        className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30"
      >
        <span className="text-xl text-brown font-medium">G</span>
      </button>
      <button 
        className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30"
      >
        <Instagram className="h-5 w-5 text-brown" />
      </button>
    </div>
  );
};

export default SocialLogin; 