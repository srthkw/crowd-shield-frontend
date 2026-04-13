import { useEffect, useState } from "react";
import socket from "../../socket";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Loader2 from "../Loader2";

export default function EmergencyResponse({ eventId }) {
  const [emergencies, setEmergencies] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading("emergencies");
    const fetchEmergencies = async () => {
      try {
        const res = await API.get(
          `/emergency/active/${eventId}`
        );

        setEmergencies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(null);
      }
    };

    fetchEmergencies();
  }, [eventId]);

  useEffect(() => {
    const handler = (data) => {

      if (!data.active){
        setEmergencies((prev) => prev.filter((e) => e._id !== data._id));
        return
      }

      setEmergencies((prev) => {
        const exists = prev.find(
          (e) => e.user?.toString() === data.user?.toString()
        );

        if (exists) {
          return prev.map((e) =>
            e.user?.toString() === data.user?.toString() ? data : e
          );
        } else {
          return [...prev, data];
        }
      });
    };

    socket.on("emergency-alert", handler);

    return () => {
      socket.off("emergency-alert", handler);
    };
  }, [socket]);

  const deleteEmergency = async (id) => {
    try {
      await API.delete(`/emergency/${id}`);
      setEmergencies((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading === "emergencies") {
    return (
      <Loader2/>
    );
  }

  return (
<div className="">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
    Emergencies
  </h2>

  {emergencies.length === 0 ? (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-2">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">No emergencies yet...</p>
      <p className="text-gray-400 text-sm mt-1">All clear for now</p>
    </div>
  ) : (
    <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
      {emergencies.map((e) => (
        <div
          key={e._id}
          onClick={() => navigate(`/map/${e._id}`)}
          className="group relative h-full bg-red-100 border border-red-200 rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all duration-200 cursor-pointer overflow-hidden"
        >
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/0 to-red-100/0 group-hover:from-red-100/30 group-hover:to-transparent transition-all duration-300"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {e.userName}
                </h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{e.userPhone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Updated:{" "}
                    {e.lastUpdated
                      ? new Date(e.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(a) =>{ 
                a.stopPropagation();
                deleteEmergency(e._id)}} className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md hover:bg-red-600 transition-colors duration-200">
                Delete
                </button>  
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
}