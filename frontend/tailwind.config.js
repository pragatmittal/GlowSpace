/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F5ECE3", // Soft beige background
          dark: "#1E1915", // Dark mode background
        },
        sidebar: {
          DEFAULT: "#4D2D21", // Deep brown sidebar
          dark: "#2A1A14", // Dark mode sidebar
        },
        card: {
          DEFAULT: "#E7D7CE", // Light brown card background
          dark: "#302520", // Dark mode card
        },
        text: {
          primary: "#3A2A1C", // Dark brown text
          secondary: "#6D5B4B", // Warm gray text
          dark: {
            primary: "#E7D7CE", // Light text for dark mode
            secondary: "#A99584", // Gray text for dark mode
          }
        },
        chart: {
          green: "#79A66D", // Soft green
          orange: "#E37A3E", // Warm orange
          purple: "#A389E6", // Pastel purple
          yellow: "#F8C55A", // Pastel yellow
        },
        button: {
          primary: "#F8C55A", // Pastel yellow
          hover: "rgba(255,255,255,0.1)", // Soft glow
        },
        indicator: {
          red: "#E74C3C", // Red dot indicator
        }
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'sidebar': '4px 0 15px rgba(0, 0, 0, 0.03)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      gridTemplateColumns: {
        'dashboard': '15% 85%',
        'card-row': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};
