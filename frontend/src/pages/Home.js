import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import ServicesSection from '../components/Home/ServicesSection';
import PositiveStreakSection from '../components/Home/PositiveStreakSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import HealingConnectSection from '../components/Home/HealingConnectSection';
import GetConnectedSection from '../components/Home/GetConnectedSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero section comes after navbar */}
      <HeroSection />
      
      {/* Services section */}
      <ServicesSection />
      
      {/* Positive streak container */}
      <PositiveStreakSection />
      
      {/* How it works */}
      <HowItWorksSection />
      
      {/* Healing connect */}
      <HealingConnectSection />
      
      {/* Get connected with us */}
      <GetConnectedSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
