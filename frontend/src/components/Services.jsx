import React from 'react';

const Services = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Design Solutions</h3>
            <p className="text-gray-700">Comprehensive design tools for all your creative needs</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Development Resources</h3>
            <p className="text-gray-700">Developer-friendly tools and resources</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
