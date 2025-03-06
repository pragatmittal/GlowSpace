import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Mental Health <span className="text-primary-600">Matters</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Join GlowSpace and start your journey toward mental wellness and peace of mind.
              Our platform offers personalized support and resources for your well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">
                Get Started
              </button>
              <button className="px-8 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="animate-float">
              <img 
                src="/images/hero-illustration.svg" 
                alt="Mental Health Illustration" 
                className="w-full h-auto"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "https://via.placeholder.com/600x400?text=Mental+Health+Illustration";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-primary-100 rounded-full -z-10"></div>
            <div className="absolute -top-4 -left-4 w-40 h-40 bg-purple-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
