import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield, Key, ChevronLeft } from "lucide-react";
import { useLoading } from "../../context/LoadingContext";

export default function ForgotPassword() {
  const { navigateWithLoading, showSuccess, startFetching } = useLoading();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authMethods = [
    {
      id: "2fa",
      name: "Use 2FA",
      icon: <Shield className="h-10 w-10 text-[#5B3A29]" />,
      description: "Use your two-factor authentication app"
    },
    {
      id: "password",
      name: "Password",
      icon: <Key className="h-10 w-10 text-[#5B3A29]" />,
      description: "Reset using your email"
    },
    {
      id: "google",
      name: "Google Authenticator",
      icon: <Shield className="h-10 w-10 text-[#5B3A29]" />,
      description: "Use Google Authenticator app"
    }
  ];

  // Handle return to sign in
  const handleReturnToSignIn = (e) => {
    e.preventDefault();
    navigateWithLoading("/auth/sign-in");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedMethod || isSubmitting) return;
    
    setIsSubmitting(true);
    startFetching("Processing your request...");
    
    // Simulate API call delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess("Password reset instructions sent!");
      
      // Navigate back to sign in after showing success message
      setTimeout(() => {
        navigateWithLoading("/auth/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5B3A29] mb-3">Forgot Password</h1>
          <p className="text-[#8D735A]">
            Select contact details where you want to reset your password.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {authMethods.map((method) => (
            <div 
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center
                ${selectedMethod === method.id 
                  ? "border-[#B5C99A] bg-[#B5C99A]/10" 
                  : "border-[#E8E4D8] hover:border-[#B5C99A]"}
              `}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center
                ${selectedMethod === method.id 
                  ? "bg-[#B5C99A]/30" 
                  : "bg-[#F7F2EC]"}
              `}>
                {method.icon}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-[#5B3A29]">{method.name}</h3>
                <p className="text-sm text-[#8D735A]">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!selectedMethod || isSubmitting}
          className={`w-full bg-[#3E2723] text-white rounded-full py-4 flex items-center justify-center 
            ${selectedMethod && !isSubmitting ? "opacity-100 cursor-pointer" : "opacity-70 cursor-not-allowed"}
            transition-all shadow-md hover:shadow-lg`}
        >
          <Lock className="h-5 w-5 mr-2" />
          <span className="font-medium">Send Password Reset</span>
        </button>

        <div className="text-center mt-6">
          <Link 
            to="#" 
            onClick={handleReturnToSignIn}
            className="inline-flex items-center text-[#8D735A] hover:text-[#5B3A29] transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 