import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { roleGradientsBG, roleGradients } from '../constants/roleGradient';
import { FiUser, FiMail, FiPhoneCall } from "react-icons/fi";
import Loader from '../components/Loader';

const OrgReqs = () => {
  const [orgReqs, setOrgReqs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    }
  }, [user]);

  useEffect(() => {
    setLoading("page");
    async function fetchOrgReqs() {
      try {
        const res = await API.get("/org-reqs");
        setOrgReqs(res.data);
      } catch {
        setOrgReqs([]);

      } finally {
        setLoading(null);
      }
    }

    fetchOrgReqs();
  }, []);

  const handleAccept = async (orgReq) => {
    setLoading(`accept ${orgReq._id}`);
    try {
      const res = await API.patch("/auth/makeorg", { orgReq });
      if (res.data.message === "Role updated successfully") {
        alert(`Approved ${orgReq.name} as organizer`);
        await API.patch(`/org-reqs/${orgReq._id}`, { status: "approved" });
      }
      setOrgReqs(orgReqs.filter((req) => req._id !== orgReq._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept organizer request.");
    } finally {
      setLoading(null);
    }
  }

  const handleDecline = async (orgReq) => {
    setLoading(`decline ${orgReq._id}`);
    try {
      await API.patch(`/org-reqs/${orgReq._id}`, { status: "rejected" });
      alert(`Declined ${orgReq.name}'s request to be an organizer`);
      setOrgReqs(orgReqs.filter((req) => req._id !== orgReq._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to decline organizer request.");
    } finally {
      setLoading(null);
    }
  }

  if (loading === "page") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${roleGradientsBG[user.role] || ''} text-gray-600`}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roleGradientsBG[user.role] || ''} text-gray-600`}>
      <Navbar />
      {user.role !== "admin" ? <div className="text-center font-semibold text-2xl my-5">You are not authorized to view this page</div> : (
        <div className='mx-auto p-4 md:p-6'>
          {orgReqs.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900 rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className={`relative bg-gradient-to-br ${roleGradients[user.role]} p-4 rounded-full shadow-lg`}>
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${roleGradients[user.role]} dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent`}>
                    No Requests Yet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                    Your organizer requests inbox is empty
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    When someone submits an organizer application, it will appear here for your review
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="flex gap-2 pt-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-400/50 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-400/50 animate-bounce"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-lg md:text-2xl font-bold md:mb-4 text-center">{orgReqs.length === 1 ? "1 user" : `${orgReqs.length} users`} have requested to be an organizer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                {orgReqs.map((orgReq) => (
                  <div key={orgReq._id} className="group bg-gray-50 rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
                    {/* Card Header with Status Indicator */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400"></div>

                    <div className="p-5">
                      {/* Main Content */}
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        {/* User Info Section */}
                        <div className="flex-1 space-y-3">
                          {/* Name */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <FiUser className="text-blue-600 text-lg" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium mb-1">Full Name</p>
                              <p className="text-gray-900 font-semibold text-base line-clamp-1">{orgReq.name}</p>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                              <FiMail className="text-purple-600 text-lg" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium mb-1">Email Address</p>
                              <p className="text-gray-700 text-sm break-all line-clamp-1">{orgReq.email}</p>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <FiPhoneCall className="text-green-600 text-lg" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                              <p className="text-gray-700 text-sm break-all line-clamp-1">{orgReq.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="flex md:flex-col justify-center gap-3 md:min-w-[140px]">
                          <button
                            disabled={loading === `accept ${orgReq._id}` || loading === `decline ${orgReq._id}`}
                            onClick={() => handleAccept(orgReq)}
                            className={`
                          md:w-full px-4 py-2 md:py-4 rounded-lg font-medium text-sm
                          transition-all duration-200 transform active:scale-95
                          ${loading === `accept ${orgReq._id}`
                                ? 'bg-green-100 text-green-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md cursor-pointer'
                              }
                        `}
                          >
                            {loading === `accept ${orgReq._id}` ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Approving</span>
                              </span>
                            ) : "Approve"}
                          </button>

                          <button
                            disabled={loading === `accept ${orgReq._id}` || loading === `decline ${orgReq._id}`}
                            onClick={() => handleDecline(orgReq)}
                            className={`
                          md:w-full px-4 py-2 md:py-4 rounded-lg font-medium text-sm
                          transition-all duration-200 transform active:scale-95
                          ${loading === `decline ${orgReq._id}`
                                ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md cursor-pointer'
                              }
                        `}
                          >
                            {loading === `decline ${orgReq._id}` ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Declining</span>
                              </span>
                            ) : "Decline"}
                          </button>
                        </div>
                      </div>

                      {/* Timestamp or Additional Info (Optional) */}
                      {orgReq.createdAt && (
                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
                          <span>Requested</span>
                          <span>•</span>
                          <span>{new Date(orgReq.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                      )}
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
