import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import signinImage from "../../assets/images/signin.svg"
import { useLoading } from "../../context/LoadingContext";
import { useAuth } from "../../context/AuthContext";
import SocialLogin from "../../components/SocialLogin";

export default function SignIn() {
  const { navigateWithLoading, startFetching, showSuccess, showError } = useLoading();
  const { login, checkAuthStatus, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect path from location state or default to "/"
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to home or intended page
  useEffect(() => {
    if (isAuthenticated) {
      navigateWithLoading(from);
    }
  }, [isAuthenticated, navigateWithLoading, from]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle sign in form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showError("Please provide both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    // Show the loading screen while authenticating
    startFetching("Authenticating...");
    
    try {
      // Use the login method from AuthContext instead of direct axios call
      const result = await login(formData.email, formData.password);
      
      // Check if login was successful
      if (result && result.success) {
        // Refresh auth context to ensure state is updated
        await checkAuthStatus();
        
        // Show success message
        showSuccess("Login successful!");
        
        // Navigate to home page or intended destination after a short delay
        setTimeout(() => {
          navigateWithLoading(from); // Redirect with loading animation
        }, 1000);
      } else {
        throw new Error(result?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Show specific error message
      showError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password link click
  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Use navigateWithLoading to show transition animation
    navigateWithLoading("/auth/forgotpassword");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <img 
            src={signinImage} 
            alt="Unity and Support Illustration" 
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right side - Sign In Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-brown text-center mb-10">Sign In To GlowSpace</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-brown font-medium text-lg">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-brown" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border border-[#E8E4D8] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#553C2E]/50"
                  placeholder="Enter your email..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-brown font-medium text-lg">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-brown" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 border border-[#E8E4D8] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#553C2E]/50"
                  placeholder="Enter your password..."
                  required
                />
                <div 
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#553C2E] text-white rounded-full py-4 border border-[#553C2E] flex items-center justify-center mt-8 text-lg font-medium hover:bg-[#46321F] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="mr-2">Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Social Login */}
          <SocialLogin />

          {/* Sign Up and Forgot Password */}
          <div className="text-center space-y-2 mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateWithLoading("/auth/signup");
                }} 
                className="text-orange-500 font-medium hover:underline"
              >
                Sign Up.
              </Link>
            </p>
            <Link 
              to="#" 
              onClick={handleForgotPassword} 
              className="text-orange-500 font-medium block hover:underline transition-all"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 