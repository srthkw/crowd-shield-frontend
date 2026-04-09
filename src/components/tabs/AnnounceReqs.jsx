import React from 'react'
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Loader2 from "../Loader2";
import { roleGradients } from "../../constants/roleGradient";

const AnnounceReqs = ({ eventId }) => {

    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [maximize, setMaximize] = useState(null);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                setLoading(true);
                const annRes = await axios.get(`/announcements/event/pending/${eventId}`);
                setAnnouncements(annRes.data);
            } catch (err) {
                console.error("Failed to load event data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const approveAnnouncement = async (id, user) => {
        try {
            await axios.put(`/announcements/approve/${id}`, { user });
            const annRes = await axios.get(`/announcements/event/pending/${eventId}`);
            setAnnouncements(annRes.data);
        } catch (err) {
            console.error("Failed to load event data", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteAnnouncement = async (id) => {
        try {
            await axios.delete(`/announcements/${id}`);
            const annRes = await axios.get(`/announcements/event/pending/${eventId}`);
            setAnnouncements(annRes.data);
            alert("Announcement request declined and removed.");
        } catch (err) {
            console.error("Failed to load event data", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader2 />;
    }


    return (
<div className="space-y-4">
  {announcements.length === 0 && (
    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-gray-500 font-medium">No pending announcements</p>
      <p className="text-sm text-gray-400 mt-1">All caught up!</p>
    </div>
  )}
  
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {announcements.map(ann => (
      <div onClick={() => setMaximize(ann)} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden" key={ann._id}>
        {/* Gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${roleGradients[user.role]}`}></div>
        
        <div className="p-5">
          {/* Message content */}
          <div className="flex items-start space-x-3 mb-4 h-16">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium leading-relaxed line-clamp-3 text-sm">{ann.message}</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={(e) => {
                approveAnnouncement(ann._id);
                e.stopPropagation();
              }} 
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow transform hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </div>
            </button>
            
            <button 
              onClick={(e) => {
                deleteAnnouncement(ann._id);
                e.stopPropagation();
              }} 
              className="flex-1 bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Decline
              </div>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {maximize && (
  <div 
    onClick={() => setMaximize(null)}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="bg-white rounded-xl shadow-xl max-w-lg w-full relative"
    >
      {/* Close button */}
      <button
        onClick={() => setMaximize(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Content */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 px-3 py-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Announcement</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-100 p-2 max-h-100 overflow-y-auto no-scrollbar rounded-xl">{maximize.message}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

</div>
    )
}

export default AnnounceReqs
