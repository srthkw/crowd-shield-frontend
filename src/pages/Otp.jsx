import React, { useState, useEffect } from 'react'
import axios from "../api/axios";
import { useNavigate, useLocation } from 'react-router-dom';

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const email = location.state?.email;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyOtp, setVerifyOtp] = useState(false);

    useEffect(() => {
        if (!email) {
          navigate("/");
        }   
    }, []);

    const handleSubmit = async (e) => {

      setVerifyOtp(true);
      setLoading(true);
        e.preventDefault();
        try {
        
          await axios.post("/auth/verify-otp", { email, otp });
          setError("");
          setSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (err) {
          setError(err.response?.data?.message || "OTP verification failed. Please try again.");
          console.error(err);
          setLoading(false);
        } finally {
          setVerifyOtp(false);
        }
      };

    
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
  <div className="w-full max-w-sm">
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
        <p className="text-gray-500 text-sm">Enter the verification code sent to your email. Code expires in 5 minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength="6"
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-center text-lg font-mono tracking-wider focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            autoFocus
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400 px-2">
            <span>Only numbers allowed</span>
            <span>{otp.length}/6 digits</span>
          </div>
        </div>

        {success && (
          <div className="text-green-500 text-center text-sm font-semibold">
            OTP verified successfully! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        <button disabled={otp.length !== 6 || loading} type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg">
          {verifyOtp ? "Verifying..." : "Verify OTP"}
        </button>

      </form>
    </div>
  </div>
</div>
  )
}

export default Otp
