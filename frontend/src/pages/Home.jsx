import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        <Services />
        <Testimonials />
      </main>
      <div className="p-4 mt-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Debug Links</h3>
        <div className="flex flex-col space-y-2">
          <Link to="/assessment" className="text-blue-500 hover:underline">Assessment Page 1</Link>
          <Link to="/assessment2" className="text-blue-500 hover:underline">Assessment Page 2</Link>
          <Link to="/debug" className="text-blue-500 hover:underline">Debug Page</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
