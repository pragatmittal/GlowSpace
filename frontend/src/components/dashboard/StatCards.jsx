import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Zap,
  Trophy
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { cn } from '../ui/utils';

// Simulated data for sleep bar chart
const sleepData = [
  { day: 'M', hours: 7.5 },
  { day: 'T', hours: 8.2 },
  { day: 'W', hours: 6.8 },
  { day: 'T', hours: 9.0 },
  { day: 'F', hours: 8.5 },
  { day: 'S', hours: 7.8 },
  { day: 'S', hours: 8.4 },
];

// Simulated data for journal heatmap
const generateHeatmapData = () => {
  const data = [];
  // Create a 4x7 grid (4 weeks, 7 days)
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      // Last 16 days are active, rest are inactive
      const isActive = (week * 7 + day) >= (28 - 16);
      data.push({
        week,
        day,
        value: isActive ? Math.random() * 0.5 + 0.5 : 0 // Randomize intensity for active days
      });
    }
  }
  return data;
};

const heatmapData = generateHeatmapData();

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Sleep Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6",
          "shadow-card hover:shadow-card-hover transition-shadow",
          "flex flex-col"
        )}
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
              Avg Sleep Level
            </h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mr-1">
                8.2
              </span>
              <span className="text-text-secondary dark:text-text-dark-secondary text-lg">
                h
              </span>
            </div>
          </div>
          <div className="bg-chart-green/10 p-3 rounded-full">
            <Clock className="w-6 h-6 text-chart-green" />
          </div>
        </div>
        
        <div className="mt-2 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sleepData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6D5B4B', fontSize: 12 }}
              />
              <Bar 
                dataKey="hours" 
                fill="#79A66D" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center mt-2 text-chart-green text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+0.7h from last week</span>
        </div>
      </motion.div>

      {/* Health Journal Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6",
          "shadow-card hover:shadow-card-hover transition-shadow",
          "flex flex-col"
        )}
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
              Health Journal Streak
            </h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mr-1">
                16
              </span>
              <span className="text-text-secondary dark:text-text-dark-secondary text-lg">
                days
              </span>
            </div>
          </div>
          <div className="bg-chart-orange/10 p-3 rounded-full">
            <Calendar className="w-6 h-6 text-chart-orange" />
          </div>
        </div>
        
        {/* Calendar Heatmap */}
        <div className="mt-2 grid grid-cols-7 gap-1">
          {heatmapData.map((day, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-full aspect-square rounded-sm",
                day.value === 0 
                  ? "bg-gray-200 dark:bg-gray-700" 
                  : "bg-chart-orange"
              )}
              style={{ 
                opacity: day.value === 0 ? 0.3 : (0.4 + day.value * 0.6)
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
        
        <div className="flex items-center mt-4 text-chart-orange text-sm">
          <Trophy className="w-4 h-4 mr-1" />
          <span>You're on a roll!</span>
        </div>
      </motion.div>

      {/* AI Chatbot Conversations Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={cn(
          "bg-card dark:bg-card-dark rounded-2xl p-6",
          "shadow-card hover:shadow-card-hover transition-shadow",
          "flex flex-col"
        )}
        whileHover={{ y: -4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
              AI Chatbot Conversations
            </h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mr-1">
                187
              </span>
              <span className="text-text-secondary dark:text-text-dark-secondary text-lg">
                +
              </span>
            </div>
          </div>
          <div className="bg-chart-purple/10 p-3 rounded-full">
            <MessageSquare className="w-6 h-6 text-chart-purple" />
          </div>
        </div>
        
        {/* Chat Bubbles Visualization */}
        <div className="relative h-24 mt-2 flex items-center justify-center">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full",
                "bg-chart-purple/80 dark:bg-chart-purple/60"
              )}
              style={{
                width: `${30 + Math.random() * 20}px`,
                height: `${30 + Math.random() * 20}px`,
                left: `${i * 30 + Math.random() * 40}px`,
                top: `${20 + Math.random() * 40}px`,
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        
        <div className="flex items-center mt-2 text-chart-purple text-sm">
          <Zap className="w-4 h-4 mr-1" />
          <span>23 new conversations this week</span>
        </div>
      </motion.div>
    </div>
  );
} 