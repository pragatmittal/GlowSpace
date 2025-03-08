import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../ui/utils';

// Simulated data - in a real app would come from an API
const sleepData = [
  { name: 'Core Sleep', value: 45, color: '#79A66D' },  // Green
  { name: 'REM Sleep', value: 30, color: '#E37A3E' },   // Orange
  { name: 'Post-REM', value: 25, color: '#F8C55A' },    // Yellow
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-sidebar-dark p-3 rounded-lg shadow-lg">
        <p className="text-text-primary dark:text-text-dark-primary font-medium">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% of sleep cycle
        </p>
      </div>
    );
  }
  return null;
};

export default function StressChart() {
  const [hoveredSection, setHoveredSection] = useState(null);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "bg-card dark:bg-card-dark rounded-2xl p-6",
        "shadow-card hover:shadow-card-hover transition-shadow", 
        "h-full"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
          Stress Level
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center h-[90%]">
        <motion.div 
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-4xl font-bold text-text-primary dark:text-text-dark-primary">
              8.2x
            </div>
            <div className="text-text-secondary dark:text-text-dark-secondary text-sm">
              Stress Level
            </div>
          </div>
          
          <div className="h-60 w-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sleepData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(_, index) => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {sleepData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="none"
                      style={{
                        filter: hoveredSection === index 
                          ? 'drop-shadow(0px 0px 8px rgba(0,0,0,0.2))' 
                          : 'none',
                        opacity: hoveredSection === null || hoveredSection === index 
                          ? 1 
                          : 0.6,
                        transform: hoveredSection === index 
                          ? 'scale(1.03)' 
                          : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="flex justify-center items-center mt-4 space-x-4">
          {sleepData.map((entry, index) => (
            <div 
              key={`legend-${index}`}
              className="flex items-center"
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary dark:text-text-dark-secondary text-sm">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 