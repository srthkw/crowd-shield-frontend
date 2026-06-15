import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { roleGradientsBG } from "../constants/roleGradient";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", { email });

      setSuccess(res.data.message);

      setTimeout(() => {
        setStep(2);
        setSuccess("");
        setError("");
      }, 1500);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-reset-otp", { email, otp });

      setSuccess(res.data.message);
      setError("");

      setTimeout(() => {
        setStep(3);
        setSuccess("");
        setError("");
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", { email, password });

      setSuccess(res.data.message);
      setError("");

      setTimeout(() => {
        navigate("/login");
      } , 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-5 py-10 bg-gradient-to-br from-slate-200 to-slate-300`}>
      {step === 1 && <div className="w-full max-w-md bg-gray-100 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-500">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email address and we'll send
          you an OTP to reset your password.
        </p>

        {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center mb-2">{success}</p>}

        <form
          onSubmit={sendOtp}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="rounded-lg px-4 py-3 outline-none bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-blue-500 hover:underline w-full font-semibold"
        >
          Back to Login
        </button>
      </div> }

      {step === 2 && <div className="w-full max-w-md bg-gray-100 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-500">
          Enter Otp
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to your email address. Make sure to check your spam folder. Refresh the page and enter the email again if you haven't received the OTP.
        </p>

        {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center mb-2">{success}</p>}

        <form
          onSubmit={verifyOtp}
          className="flex flex-col gap-4"
        >
          <input
            type="number"
            placeholder="Enter the OTP"
            value={otp}
            required
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="rounded-lg px-4 py-3 outline-none bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            onClick
            className="bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
        </div>}

        {step === 3 && <div className="w-full max-w-md bg-gray-100 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-500">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password. Make sure to use a strong and secure password.
        </p>

        {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center mb-2">{success}</p>}

        <form
          onSubmit={resetPassword}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            required
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="rounded-lg px-4 py-3 outline-none bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
        </div>}
    </div>
  );
};

export default ForgotPassword;