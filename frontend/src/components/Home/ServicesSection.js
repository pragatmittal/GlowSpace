import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
      <div className="mb-4 text-primary-600 text-3xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: "👨‍⚕️",
      title: "Virtual Counselling",
      description: "Connect with licensed therapists from the comfort of your home."
    },
    {
      icon: "🎤",
      title: "Voice Detector",
      description: "AI-powered tool that analyzes your voice to detect stress and emotional patterns."
    },
    {
      icon: "👥",
      title: "Community Support",
      description: "Join supportive communities of people who understand what you're going through."
    },
    {
      icon: "📝",
      title: "Mood Tracking",
      description: "Track your moods and identify patterns to better manage your mental health."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
        
        <div className="flex justify-end mt-8">
          <button className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition duration-300">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
