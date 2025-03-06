import React from 'react';

const HealingConnectSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Healing Connect</h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="/images/healing-connect.jpg" 
              alt="People connecting and healing together" 
              className="rounded-xl shadow-lg w-full h-auto"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "https://via.placeholder.com/600x400?text=Healing+Connect";
              }}
            />
          </div>
          
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Schedule Your Healing Session</h3>
            <p className="text-gray-600 mb-6">
              Take the first step towards better mental health by scheduling a one-on-one session with our certified counselors.
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <select 
                  id="session" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select session type</option>
                  <option value="individual">Individual Counseling</option>
                  <option value="group">Group Therapy</option>
                  <option value="assessment">Mental Health Assessment</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Concerns (Optional)</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us briefly about your concerns..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300"
              >
                Schedule Session
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealingConnectSection;
