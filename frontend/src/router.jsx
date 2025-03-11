import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import GenderAssessment from "./pages/GenderAssessment";
import AgeAssessment from "./pages/AgeAssessment";

// Create router with routes
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
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
    path: "/gender-assessment",
    element: <GenderAssessment />
  },
  {
    path: "/age-assessment",
    element: <AgeAssessment />
  }
]);
