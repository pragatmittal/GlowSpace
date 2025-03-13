import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Import mood animations
import happyAnim from '../../assets/animations/happy.json';
import sadAnim from '../../assets/animations/sad.json';
import neutralAnim from '../../assets/animations/neutral.json';
import excitedAnim from '../../assets/animations/excited.json';
import depressedAnim from '../../assets/animations/depressed.json';

const moodColors = {
  overjoyed: '#FFC107',
  happy: '#4CAF50',
  neutral: '#9E9E9E',
  sad: '#2196F3',
  depressed: '#673AB7'
};

const moodAnimations = {
  overjoyed: excitedAnim,
  happy: happyAnim,
  neutral: neutralAnim,
  sad: sadAnim,
  depressed: depressedAnim
};

// Sample data (replace with real data)
const sampleData = [
  { date: '2024-03-01', mood: 'overjoyed', note: 'Started a new project!' },
  { date: '2024-03-02', mood: 'happy', note: 'Had a great workout' },
  { date: '2024-03-03', mood: 'neutral', note: 'Regular day' },
  { date: '2024-03-04', mood: 'sad', note: 'Missing family' },
  { date: '2024-03-05', mood: 'happy', note: 'Caught up with friends' },
  { date: '2024-03-06', mood: 'overjoyed', note: 'Started a new project' },
  { date: '2024-03-07', mood: 'neutral', note: 'Working from home' }
];

function MoodStatistics() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);

  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline();
    
    tl.to('#mood-stats', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .from('.chart-container', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(1.2)'
    })
    .from('.insight-card', {
      x: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, []);

  // Transform data for charts
  const chartData = sampleData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: ['depressed', 'sad', 'neutral', 'happy', 'overjoyed'].indexOf(entry.mood) + 1,
    mood: entry.mood
  }));

  // Calculate mood distribution
  const moodDistribution = sampleData.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(moodDistribution).map(([mood, count]) => ({
    mood,
    count,
    color: moodColors[mood]
  }));

  // Calculate insights
  const insights = [
    {
      id: 'most-common',
      title: 'Most Common Mood',
      value: Object.entries(moodDistribution).sort((a, b) => b[1] - a[1])[0][0],
      icon: '📊'
    },
    {
      id: 'streak',
      title: 'Current Streak',
      value: '5 days',
      icon: '🔥'
    },
    {
      id: 'improvement',
      title: 'Mood Improvement',
      value: '+15%',
      icon: '📈'
    }
  ];

  const handleInsightClick = (insight) => {
    setSelectedInsight(insight);
    
    // Animate insight details
    gsap.from('#insight-details', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.2)'
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <Lottie
                animationData={moodAnimations[data.mood]}
                loop={true}
                autoplay={true}
              />
            </div>
            <div>
              <p className="font-medium capitalize" style={{ color: moodColors[data.mood] }}>
                {data.mood}
              </p>
              <p className="text-sm text-[#4F3222]/60">{data.date}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="mood-stats"
      className="min-h-screen bg-[#F9F6F2] text-[#4F3222] opacity-0 p-4 md:p-8"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/mood/select')}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Mood Insights</h1>
          <button
            onClick={() => navigate('/mood/history')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            View History →
          </button>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-full capitalize transition-all ${
                selectedPeriod === period
                  ? 'bg-[#4F3222] text-white'
                  : 'bg-white text-[#4F3222] hover:bg-[#4F3222]/10'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mood Line Chart */}
          <div className="chart-container bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4F3222"
                    strokeWidth={2}
                    dot={{ fill: '#4F3222' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="chart-container bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="count"
                    nameKey="mood"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    onMouseEnter={(_, index) => {
                      setHoveredMood(distributionData[index].mood);
                      gsap.to(`#mood-${distributionData[index].mood}`, {
                        scale: 1.1,
                        duration: 0.3
                      });
                    }}
                    onMouseLeave={(_, index) => {
                      setHoveredMood(null);
                      gsap.to(`#mood-${distributionData[index].mood}`, {
                        scale: 1,
                        duration: 0.3
                      });
                    }}
                  >
                    {distributionData.map((entry) => (
                      <Cell
                        key={entry.mood}
                        fill={entry.color}
                        opacity={hoveredMood === entry.mood ? 1 : 0.7}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Column */}
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="insight-card bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleInsightClick(insight)}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h3 className="font-medium text-[#4F3222]">{insight.title}</h3>
                  <p className="text-[#4F3222]/70">{insight.value}</p>
                </div>
              </div>
            </div>
          ))}

          {selectedInsight && (
            <div 
              id="insight-details"
              className="bg-white rounded-xl p-6 shadow-md mt-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                {selectedInsight.title} Details
              </h3>
              {/* Add detailed analysis based on the selected insight */}
              <p className="text-[#4F3222]/70">
                Detailed analysis and recommendations would go here...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodStatistics; 