import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { findNestedRouters } from './utils/findRouterComponents';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { LoadingProvider } from './context/LoadingContext';
import LoadingScreen from './components/LoadingScreen';
import AssessmentPage from './pages/AssessmentPage';
import ErrorPage from './components/ErrorPage';

// Higher-order component to apply LoadingProvider
const withLoadingProvider = (Component) => {
  const WithLoadingProvider = (props) => {
    // Wrap with LoadingProvider and include LoadingScreen
    return (
      <LoadingProvider>
        <LoadingScreen />
        <Component {...props} />
      </LoadingProvider>
    );
  };
  
  return WithLoadingProvider;
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

// Wrap the Layout component with the LoadingProvider
const LayoutWithLoading = withLoadingProvider(Layout);

// Create router with proper route definitions and future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWithLoading>
        <Home />
      </LayoutWithLoading>
    ),
    errorElement: <ErrorPage />
  },
  // Redirect from /login to /auth/sign-in
  {
    path: "/login",
    element: <Navigate to="/auth/sign-in" replace />,
  },
  // Sign-in route
  {
    path: "/auth/sign-in",
    element: withLoadingProvider(SignIn)(),
  },
  // Sign-up route
  {
    path: "/auth/signup",
    element: withLoadingProvider(SignUp)(),
  },
  // Forgot Password route
  {
    path: "/auth/forgotpassword",
    element: withLoadingProvider(ForgotPassword)(),
  },
  // Dashboard route
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  // Dashboard sub-routes
  {
    path: "/dashboard/:section",
    element: <Dashboard />,
  },
  // Assessment route
  {
    path: "/assessment",
    element: withLoadingProvider(AssessmentPage)(),
  },
  // Handle the misspelled assessment route
  {
    path: "/assesment",
    element: <Navigate to="/assessment" replace />,
  },
  // Catch-all route for 404 pages
  {
    path: "*",
    element: <ErrorPage />,
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

  return <RouterProvider router={router} />;
}

export default App;
