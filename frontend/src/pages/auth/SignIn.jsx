import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Instagram } from "lucide-react"
import { Link } from "react-router-dom"
import signinImage from "../../assets/images/signin.svg"
import { useLoading } from "../../context/LoadingContext";

export default function SignIn() {
  const { navigateWithLoading, startFetching, showSuccess } = useLoading();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      return; // Simple validation - don't submit if fields are empty
    }
    
    setIsSubmitting(true);
    
    // Show the loading screen while "fetching" data
    startFetching("Authenticating...");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      showSuccess("Login successful!");
      
      // Navigate to home page
      setTimeout(() => {
        navigateWithLoading("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
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
          <div className="flex justify-center space-x-4 mt-10">
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30">
              <span className="text-xl text-brown font-medium">f</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30">
              <span className="text-xl text-brown font-medium">G</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center transition-colors hover:bg-[#E8E4D8]/30">
              <Instagram className="h-5 w-5 text-brown" />
            </button>
          </div>

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