import React from 'react';

const Step = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="bg-primary-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center md:text-left">{title}</h3>
      <p className="text-gray-600 text-center md:text-left">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up and create your profile with basic information to get started."
    },
    {
      number: 2,
      title: "Complete Assessment",
      description: "Take our comprehensive mental health assessment to help us understand your needs."
    },
    {
      number: 3,
      title: "Get Personalized Plan",
      description: "Receive a customized wellness plan based on your assessment results."
    },
    {
      number: 4,
      title: "Engage with Resources",
      description: "Access therapy sessions, community groups, and self-help tools."
    },
    {
      number: 5,
      title: "Track Your Progress",
      description: "Monitor your journey and celebrate improvements in your mental wellbeing."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        
        <div className="relative">
          {/* Progress line (hidden on mobile) */}
          <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-200 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <Step
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
