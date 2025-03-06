import React from 'react';

const PositiveStreakSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-8 lg:mb-0 lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Build Your Positive Streak</h2>
              <p className="text-lg text-gray-700 mb-6">
                Consistency is key to mental wellness. Start a challenge and build your positive streak with daily activities designed to improve your mental health.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">7</div>
                  <div className="text-gray-600">Day Challenge</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">21</div>
                  <div className="text-gray-600">Day Challenge</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">30</div>
                  <div className="text-gray-600">Day Challenge</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Start a Challenge</h3>
                <p className="text-gray-600 mb-6">
                  Choose a challenge duration and start your journey to better mental health today.
                </p>
                <div className="flex items-center mb-4">
                  <input type="radio" id="7days" name="challenge" value="7" className="mr-2" />
                  <label htmlFor="7days">7 Days</label>
                </div>
                <div className="flex items-center mb-4">
                  <input type="radio" id="21days" name="challenge" value="21" className="mr-2" />
                  <label htmlFor="21days">21 Days</label>
                </div>
                <div className="flex items-center mb-6">
                  <input type="radio" id="30days" name="challenge" value="30" className="mr-2" />
                  <label htmlFor="30days">30 Days</label>
                </div>
                <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition duration-300">
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositiveStreakSection;
