import React from 'react'
import Bg from '../components/Bg'
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

      login(res.data.token, res.data.role, res.data.name, res.data.id);
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Bg />

      <div className="fixed inset-0 z-10 grid place-items-center p-4">

        <div className="glass-bg text-shadow-lg shadow-black/50 sm:w-auto w-[80vw] sm:max-w-max max-w-[300px] sm:h-auto mb-10">


          <h1 className="text-[var(--textcolor)] text-[clamp(1.5rem,4vw,2.2rem)] font-bold mb-3 sm:mb-5">
            Crowd-Shield
          </h1>

          <form action="" onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-2 items-center sm:w-auto">

            <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto text-white/90 relative left-0">Email</label>

            <input placeholder="Username" type="mail" {...register("username", { required: true })} onChange={() => setError("")} className="glass-input py-3 font-medium text-xs sm:text-sm" />

            <label htmlFor="password" className="font-semibold sm:text-base text-xs text-left mr-auto text-white/90 relative left-0">Password</label>

            <input placeholder="Password" type="password" {...register("password", { required: true })} onChange={() => setError("")} className="glass-input py-3 font-medium text-xs mb-4 sm:mb-2 sm:text-sm" />

            {error && (
              <p className="sm:w-auto font-semibold text-xs sm:text-sm text-red-500 w-full">
                {error}
              </p>
            )}

            <button type="submit" className="glass-btn w-[70%] sm:px-3 px-2 sm:py-2.5 py-2 mx-auto my-1 sm:my-3 text-md">{loading ? "Logging you in..." : "Login"}</button>
            
            {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 w-[120vw] h-[120vh] z-10 bg-black/50"><Loader /></div>}

            <div>
              <p className="text-white/100 mt-2 text-xs sm:text-[clamp(0.5rem,2vw,1rem)] font-[500] opacity-90 leading-relaxed">
                Don't have an account? <span className="text-[var(--textcolor)] cursor-pointer underline" onClick={() => navigate("/underdev")}>Click here!</span></p>
            </div>

          </form>

        </div>

      </div>

    </>

  )
}

export default Login

