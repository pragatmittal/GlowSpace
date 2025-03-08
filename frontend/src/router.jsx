import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Error boundary component
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-700 mb-6">
          The page you're looking for doesn't seem to exist.
        </p>
        <a 
          href="/"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

// Create router with routes
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/auth/signin",
    element: <SignIn />
  },
  {
    path: "/auth/signup",
    element: <SignUp />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]); 