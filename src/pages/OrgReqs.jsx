import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { roleGradients } from '../constants/roleGradient';
import { FiUser, FiMail, FiPhoneCall } from "react-icons/fi";

const OrgReqs = () => {
  const [orgReqs, setOrgReqs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrgReqs() {
      try {
        const res = await API.get("/org-reqs");
        setOrgReqs(res.data);
      } catch (err) {
        setOrgReqs(err.response?.data?.message || "Failed to fetch organizer requests.");
      }
    }

    fetchOrgReqs();
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roleGradients[user.role] || ''} text-gray-600`}>
      <Navbar />
      {user.role !== "admin" ? <p className="text-center font-semibold text-2xl my-5">{orgReqs}</p> : (
      <div className='mx-auto p-4 md:p-6'>
        {orgReqs.length === 0 ? (
          <p className="text-center font-semibold text-2xl">No organizer requests found</p>
        ) : (
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-lg md:text-2xl font-bold md:mb-4">{orgReqs.length} users have requested to be an organizer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 gap-3 my-3">
              {orgReqs.map((orgReq) => (
                <div key={orgReq._id} className="flex flex-col md:grid md:grid-cols-[1.5fr_0.5fr] gap-4 bg-gray-50 rounded-lg border-l-4 border-blue-400 shadow-l-4 p-3">
                  <div className="flex flex-col gap-1 text-xs md:text-sm font-medium overflow-hidden">
                  <p className="text-md flex items-center gap-2"><span className="text-gray-900"><FiUser /></span>{orgReq.name}</p>
                  <p className="text-md flex items-center gap-2"><span className="text-gray-900"><FiMail /></span>{orgReq.email}</p>
                  <p className="text-md flex items-center gap-2"><span className="text-gray-900"><FiPhoneCall /></span>{orgReq.phone}</p>
                </div>
                <div className="flex md:flex-col justify-center items-center gap-3 text-sm text-white font-semibold"> 
                  <button className={`bg-green-400 w-full px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-500 transition ease-in-out duration-300 `}>Approve</button>
                  <button className={`bg-red-400 w-full px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-500 transition ease-in-out duration-300`}>Reject</button>
                </div>
                </div>
              ))}
            </div></div>
        )}</div>
      )}
    </div>
  )
}

export default OrgReqs
