import React from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import Loader from "../components/Loader";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", {
        email: data.username,
        password: data.password,
      });

      login(res.data.token, res.data.role, res.data.name, res.data.id, res.data.email, res.data.phone);
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 grid place-items-center p-4 bg-gradient-to-br from-blue-300/50 via-purple-300/50 to-gray-200">

        <div className="fixed inset-0 z-20 grid place-items-center p-4">

          <div className="p-8 md:py-12 md:px-10 rounded-2xl bg-white/90 text-gray-600 w-full md:w-auto md:max-w-ma sm:h-auto mb-10">


            <div className="text-center">
              <h1 className="text-violet-400 text-[clamp(1.5rem,4vw,2.2rem)] font-bold mb-3 sm:mb-5 px-5">
                Crowd-Shield
              </h1></div>

            <form action="" onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-2 items-center sm:w-auto">

              <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Email</label>

              <input placeholder="Username" type="mail" {...register("username", { required: true })} onChange={() => setError("")} className="p-3 bg-gray-200 w-full font-medium text-xs mb-4 md:mb-5 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300" />

              <label htmlFor="password" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Password</label>

              <input placeholder="Password" type="password" {...register("password", { required: true })} onChange={() => setError("")} className="p-3 bg-gray-200 w-full font-medium text-xs mb-4 md:mb-5 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300" />

              {error && (
                <div className="w-full flex justify-center text-center">
                <p className="sm:w-auto font-semibold text-xs sm:text-sm text-red-500 w-full">
                  {error}
                </p></div>
              )}

              <button type="submit" className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]">{loading ? "Logging you in..." : "Login"}</button>

              {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 w-screen h-screen z-50 bg-white/50"><Loader /></div>}

              <div>
                <p className="mt-5 text-xs md:text-sm opacity-90 leading-relaxed">
                  Don't have an account? <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer underline" onClick={() => navigate("/signup")}>Click here!</span></p>
              </div>

            </form>

          </div>

        </div>

      </div>

    </>

  )
}

export default Login

