import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Components from Home.js
import HeroSection from '../components/Home/HeroSection';
import ServicesSection from '../components/Home/ServicesSection';
import PositiveStreakSection from '../components/Home/PositiveStreakSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import HealingConnectSection from '../components/Home/HealingConnectSection';
import GetConnectedSection from '../components/Home/GetConnectedSection';
import TestimonialSection from '../components/TestimonialSection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is included in layout in App.jsx, so we don't need it here */}
      <main className="flex-grow">
        {/* Hero section */}
        <HeroSection />
        
        {/* Services section */}
        <ServicesSection />
        
        {/* Positive streak container */}
        <PositiveStreakSection />
        
        {/* How it works */}
        <HowItWorksSection />
        
        {/* Testimonials */}
        <TestimonialSection />
        
        {/* Healing connect */}
        <HealingConnectSection />
        
        {/* Get connected with us */}
        <GetConnectedSection />
      </main>
      
      {/* Footer - included at the end */}
      <Footer />
    </div>
  );
};

export default Home;
