import { Mail, Lock, Eye, ArrowRight, Instagram } from "lucide-react"
import { Link } from "react-router-dom"
import signinImage from "../../assets/images/signin.svg"

export default function SignIn() {
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
          <h1 className="text-4xl font-bold text-brown text-center mb-10">Sign In To freud.ai</h1>

          <div className="space-y-6">
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
                  className="w-full pl-12 pr-4 py-4 border border-[#E8E4D8] rounded-full bg-white focus:outline-none"
                  placeholder="princesskaguya@gmail.co"
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
                  type="password"
                  id="password"
                  className="w-full pl-12 pr-12 py-4 border border-[#E8E4D8] rounded-full bg-white focus:outline-none"
                  placeholder="Enter your password..."
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#553C2E] text-white rounded-full py-4 border border-[#553C2E] flex items-center justify-center mt-8 text-lg font-medium hover:bg-[#46321F] transition-colors">
            <span className="mr-2">Sign In</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Social Login */}
          <div className="flex justify-center space-x-4 mt-10">
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center">
              <span className="text-xl text-brown font-medium">f</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center">
              <span className="text-xl text-brown font-medium">G</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#E8E4D8] flex items-center justify-center">
              <Instagram className="h-5 w-5 text-brown" />
            </button>
          </div>

          {/* Sign Up and Forgot Password */}
          <div className="text-center space-y-2 mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="#" className="text-orange-500 font-medium">
                Sign Up.
              </Link>
            </p>
            <Link to="#" className="text-orange-500 font-medium block">
              Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 