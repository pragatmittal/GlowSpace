// Matrix of quotes for each mood and time of day combination
export const MOOD_QUOTES = {
  overjoyed: {
    'Morning': "Start each day with a grateful heart and boundless joy!",
    'Afternoon': "Your happiness is contagious, keep spreading the joy!",
    'Evening': "Let your joy light up the evening like stars in the sky.",
    'Night': "Another beautiful day filled with moments of pure happiness.",
    'Late Night': "Even in the quiet hours, joy finds its way to shine."
  },
  happy: {
    'Morning': "Happiness is not by chance, but by choice.",
    'Afternoon': "Your smile can change someone's entire day.",
    'Evening': "Find joy in the journey, not just the destination.",
    'Night': "Happiness is the best makeup you can wear.",
    'Late Night': "In the stillness of night, happiness whispers sweet dreams."
  },
  neutral: {
    'Morning': "Every new day brings new possibilities.",
    'Afternoon': "Stay balanced, stay present, stay you.",
    'Evening': "Peace comes from within.",
    'Night': "Sometimes neutral is exactly where you need to be.",
    'Late Night': "In calmness lies strength and clarity."
  },
  sad: {
    'Morning': "This feeling is temporary, just like the morning dew.",
    'Afternoon': "It's okay to have bad days; tomorrow is a new start.",
    'Evening': "Even the darkest hour has only 60 minutes.",
    'Night': "Stars can't shine without darkness.",
    'Late Night': "Your story isn't over; this is just a chapter."
  },
  depressed: {
    'Morning': "Each sunrise is a new chance to feel again.",
    'Afternoon': "You are stronger than you think, braver than you know.",
    'Evening': "This too shall pass, like all evenings do.",
    'Night': "Even in darkness, you are not alone.",
    'Late Night': "Hold on. The light will find its way back to you."
  }
};

// Get quote based on mood and time of day
export const getQuote = (mood, timeOfDay) => {
  return MOOD_QUOTES[mood]?.[timeOfDay] || 
    "Every moment is a fresh beginning."; // Default fallback quote
};

// Allow custom quote updates
export const updateQuote = (mood, timeOfDay, newQuote) => {
  if (MOOD_QUOTES[mood] && timeOfDay) {
    MOOD_QUOTES[mood][timeOfDay] = newQuote;
  }
}; 