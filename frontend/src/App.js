import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { findNestedRouters } from './utils/findRouterComponents';
import SignIn from './pages/auth/SignIn';

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

// Create router with proper route definitions and future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  // Redirect from /login to /auth/sign-in
  {
    path: "/login",
    element: <Navigate to="/auth/sign-in" replace />,
  },
  // Sign-in route
  {
    path: "/auth/sign-in",
    element: <SignIn />,
  },
  // Add more routes here as needed
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
