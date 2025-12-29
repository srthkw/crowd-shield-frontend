import React from 'react'
import Bg from '../components/Bg'
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setError(null);
    try {
      const res = await API.post("/auth/login", {
        email: data.username,   // using username input as email
        password: data.password,
      });

      login(res.data.token, res.data.role, res.data.name, res.data.id);
      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Bg />

      <div className="fixed inset-0 z-10 grid place-items-center p-4">

        <div className="glass-bg sm:w-auto w-[80vw] sm:max-w-max max-w-[300px] sm:h-auto">


          <h1 className="text-[var(--textcolor)] text-[clamp(1.5rem,4vw,2.2rem)] font-bold m-0">
            Crowd-Shield
          </h1>

          <p className="text-[var(--textcolor)] text-xs sm:text-[clamp(0.1rem,2vw,1.1rem)] font-[700] opacity-90 leading-relaxed mt-1 mb-5 sm:mb-8">
            Organizer Login</p>

          <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 items-center sm:w-auto">

            <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto text-white/90 relative left-0">Email</label>

            <input placeholder="Username" type="mail" {...register("username", { required: true })} className="glass-input" />

            <label htmlFor="password" className="font-semibold sm:text-base text-xs text-left mr-auto text-white/90 relative left-0">Password</label>

            <input placeholder="Password" type="password" {...register("password", { required: true })} className="glass-input" />

            <button type="submit" className="glass-btn w-[70%] sm:px-3 px-2 sm:py-2.5 py-2 mx-auto my-1 sm:my-3">Login</button>
            {error && (
              <p className="text-red-400 text-xs font-semibold mt-1">
                {error}
              </p>
            )}


            <div>
              <p className="text-white/85 text-xs sm:text-[clamp(0.5rem,2vw,1rem)] font-[500] opacity-90 leading-relaxed ">
                Don't have an account? <a href="/orgsignup" className="text-white">Sign-up here!</a></p>
            </div>

          </form>

        </div>

      </div>

    </>

  )
}

export default Login

