import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      setError("All fields are mandatory. Please fill them out.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/signup-init",
        formData
      );
      setSuccess("Redirecting to OTP verification. Please check your email for the OTP.");
      setFormData({ name: "", email: "", phone: "", password: "" });
      setTimeout(() => {
        navigate("/enter-otp", { state: { email: formData.email } });
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-300/50 via-purple-300/50 to-gray-200 flex items-center justify-center px-2">
  {/* Background decorative elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-300/20 rounded-full blur-3xl" />
  </div>

  <div className="relative w-full max-w-lg">
    {/* Card */}
    <div className="bg-white/90 py-1 backdrop-blur-sm rounded-xl shadow-xl shadow-blue-500/10 border border-blue-200/30">
      {/* Header */}
      <div className="p-5 text-center"><h1 className="text-violet-400 md:mb-1 text-[clamp(1.5rem,4vw,2.2rem)] font-bold">
            Crowd-Shield
          </h1>
        <h1 className="text-md md:text-lg font-bold text-gray-600">
          Create Account
        </h1>
      </div>

      {/* Form */}
      <div className="px-5 md:px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-5">
          {/* Name Field */}
          <div>
            <label className="font-semibold text-gray-500 sm:text-base text-xs text-left mr-auto relative left-0">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 bg-gray-200 w-full font-medium text-xs mb-2 md:mb-3 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="font-semibold text-gray-500 sm:text-base text-xs text-left mr-auto relative left-0">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 bg-gray-200 w-full font-medium text-xs mb-2 md:mb-3 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="font-semibold text-gray-500 sm:text-base text-xs text-left mr-auto relative left-0">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 bg-gray-200 w-full font-medium text-xs mb-2 md:mb-3 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="font-semibold text-gray-500 sm:text-base text-xs text-left mr-auto relative left-0">
              Create a Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 bg-gray-200 w-full font-medium text-xs mb-1 md:mb-3 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-3 border-t border-gray-100 text-center">
          
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default SignUp;
