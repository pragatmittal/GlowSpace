import React from 'react';
import FreudScore from './FreudScore';
import StressBreakdown from './StressBreakdown';
import MoodTracker from './MoodTracker';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Freud AI Score */}
        <div className="col-span-1">
          <FreudScore />
        </div>

        {/* Stress Breakdown */}
        <div className="col-span-1">
          <StressBreakdown />
        </div>

        {/* Mood Tracker */}
        <div className="col-span-1 lg:col-span-2">
          <MoodTracker />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 