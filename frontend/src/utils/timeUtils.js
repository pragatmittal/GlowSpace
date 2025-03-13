// Time of Day ranges
export const TIME_RANGES = {
  LATE_NIGHT: { start: 0, end: 4.99, label: 'Late Night' },
  MORNING: { start: 5, end: 11.99, label: 'Morning' },
  AFTERNOON: { start: 12, end: 16.99, label: 'Afternoon' },
  EVENING: { start: 17, end: 20.99, label: 'Evening' },
  NIGHT: { start: 21, end: 23.99, label: 'Night' }
};

// Get current time of day based on hour
export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours() + (new Date().getMinutes() / 60);
  
  for (const [timeOfDay, range] of Object.entries(TIME_RANGES)) {
    if (hour >= range.start && hour <= range.end) {
      return range.label;
    }
  }
  
  return TIME_RANGES.MORNING.label; // Default fallback
};

// Format time for display
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

// Get all possible time of day options
export const getTimeOfDayOptions = () => {
  return Object.values(TIME_RANGES).map(range => range.label);
}; 