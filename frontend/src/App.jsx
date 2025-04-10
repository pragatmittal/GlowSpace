import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { findNestedRouters } from './utils/findRouterComponents';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import AssessmentPage from './pages/AssessmentPage';
import GenderAssessment from './pages/GenderAssessment';
import AgeAssessment from './pages/AgeAssessment';
import WeightAssessment from './pages/WeightAssessment';
import ProfessionalHelpAssessment from './pages/ProfessionalHelpAssessment';
import PhysicalDistressAssessment from './pages/PhysicalDistressAssessment';
import SleepQualityAssessment from './pages/SleepQualityAssessment';
import MedicationAssessment from './pages/MedicationAssessment';
import MedicationSelection from './pages/MedicationSelection';
import MentalHealthSymptoms from './pages/MentalHealthSymptoms';
import AISoundAnalysis from './pages/AISoundAnalysis';
import StressLevelAssessment from './pages/StressLevelAssessment';
import ExpressionAnalysis from './pages/ExpressionAnalysis';
import MoodTracker from './pages/MoodTracker';
import MoodOverview from './pages/mood/MoodOverview';
import MoodStatistics from './pages/mood/MoodStatistics';
import MoodSelection from './pages/mood/MoodSelection';
import MoodHistory from './pages/mood/MoodHistory';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';

// Improved error fallback component with debugging info
const ErrorFallback = ({ error }) => {
  console.error("Application error:", error);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F2EC] p-4 text-[#563C26]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-2">We're sorry for the inconvenience. Please try again later.</p>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md max-w-md overflow-auto">
          <p className="font-medium">Error details (for developers):</p>
          <p className="text-sm">{error.toString()}</p>
        </div>
      )}
      <div className="flex space-x-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-[#A4B97F] text-[#563C26] rounded-full font-medium"
        >
          Return Home
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white border border-[#A4B97F] text-[#563C26] rounded-full font-medium"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Higher-order component to apply LoadingProvider and AuthProvider
const withProviders = (Component) => {
  const WithProviders = (props) => {
    // Wrap with LoadingProvider and include LoadingScreen
    return (
      <AuthProvider>
        <LoadingProvider>
          <LoadingScreen />
          <Component {...props} />
        </LoadingProvider>
      </AuthProvider>
    );
  };

  return WithProviders;
};

// Define a layout component that includes the Navbar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

// Wrap the Layout component with the providers
const LayoutWithProviders = withProviders(Layout);

// Create router with proper route definitions and future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWithProviders>
        <Home />
      </LayoutWithProviders>
    ),
    errorElement: <ErrorBoundary FallbackComponent={ErrorFallback} />
  },
  // Protected route for /home
  {
    path: "/home",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Redirect from /login to /auth/sign-in
  {
    path: "/login",
    element: <Navigate to="/auth/sign-in" replace />,
  },
  // Sign-in route
  {
    path: "/auth/sign-in",
    element: withProviders(SignIn)(),
  },
  // Sign-up route
  {
    path: "/auth/signup",
    element: withProviders(SignUp)(),
  },
  // Forgot Password route
  {
    path: "/auth/forgotpassword",
    element: withProviders(ForgotPassword)(),
  },
  // Dashboard route - protected
  {
    path: "/dashboard",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Dashboard sub-routes - protected
  {
    path: "/dashboard/:section",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Assessment route - protected
  {
    path: "/assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <AssessmentPage />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Added assessment2 route as protected
  {
    path: "/assessment2",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <AssessmentPage />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Added test route as protected
  {
    path: "/test",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Handle the misspelled assessment route
  {
    path: "/assesment",
    element: <Navigate to="/assessment" replace />,
  },
  // Gender Assessment route - protected
  {
    path: "/gender-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <GenderAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Age Assessment route - protected
  {
    path: "/age-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <AgeAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Weight Assessment route - protected
  {
    path: "/weight-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <WeightAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Professional Help Assessment route - protected
  {
    path: "/professional-help-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <ProfessionalHelpAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Physical Distress Assessment route - protected
  {
    path: "/physical-distress-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <PhysicalDistressAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Sleep Quality Assessment route - protected
  {
    path: "/sleep-quality-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <SleepQualityAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Medication Assessment route - protected
  {
    path: "/medication-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MedicationAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Medication Selection route - protected
  {
    path: "/medication-selection",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MedicationSelection />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Mental Health Symptoms route - protected
  {
    path: "/mental-health-symptoms",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MentalHealthSymptoms />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // AI Sound Analysis route - protected
  {
    path: "/ai-sound-analysis",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <AISoundAnalysis />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Stress Level Assessment route - protected
  {
    path: "/stress-level-assessment",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <StressLevelAssessment />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Expression Analysis route - protected
  {
    path: "/expression-analysis",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <ExpressionAnalysis />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Mood Tracker route - protected
  {
    path: "/mood-tracker",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MoodTracker />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Mood Tracker Routes - all protected
  {
    path: "/mood",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MoodOverview />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  {
    path: "/mood/stats",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MoodStatistics />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  {
    path: "/mood/:mood",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MoodSelection />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  {
    path: "/mood/history",
    element: (
      <LayoutWithProviders>
        <ProtectedRoute>
          <MoodHistory />
        </ProtectedRoute>
      </LayoutWithProviders>
    )
  },
  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  // This is a temporary diagnostic hook to help find nested routers
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Wait a bit for components to mount
      setTimeout(() => {
        findNestedRouters();
      }, 1000);
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
