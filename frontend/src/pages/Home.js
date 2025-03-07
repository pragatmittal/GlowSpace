import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import ServicesSection from '../components/Home/ServicesSection';
import PositiveStreakSection from '../components/Home/PositiveStreakSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import HealingConnectSection from '../components/Home/HealingConnectSection';
import GetConnectedSection from '../components/Home/GetConnectedSection';
import Footer from '../components/Footer';
import TestimonialSection from '../components/TestimonialSection';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero section comes after navbar */}
      <HeroSection />
      
      {/* Services section */}
      <ServicesSection />
      
      {/* Positive streak container */}
      <PositiveStreakSection />
      
      {/* How it works */}
      <HowItWorksSection />
      
      {/* Add the TestimonialSection after How it Works */}
      <TestimonialSection />
      
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
