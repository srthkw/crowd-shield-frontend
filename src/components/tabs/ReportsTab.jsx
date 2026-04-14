import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import Loader2 from "../../components/Loader2";
import { FiClock, FiCheck, FiCamera } from "react-icons/fi";

export default function ReportsTab() {
  const { eventId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function timeAgo(input) {
    const date = new Date(input);
  
    if (isNaN(date.getTime())) {
      console.warn("Invalid date passed to timeAgo:", input);
      return "";
    }
  
    const now = Date.now();
    const diffMs = now - date.getTime();
  
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffSeconds < 10) return "Just now";
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
  
    // only show date for really old stuff
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }  

  const deleteReport = async (item) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`/lostfound/${item._id}`);
      setItems(prev => prev.filter(r => r._id !== item._id));  // remove from UI instantly
    } catch {
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`/lostfound/mine/${eventId}`);
        setItems(res.data);
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [eventId]);

  if (loading) return <Loader2 />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
        {items.length > 0 && (
          <span className="text-sm font-semibold text-gray-500">
            {items.length} {items.length === 1 ? 'report' : 'reports'}
          </span>
        )}
      </div>

      {items.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reports Yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Report lost or found items to see them listed here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div
            key={item._id}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${item.claimed
              ? "border-b-4 border-green-500/70"
              : "border-b-4 border-yellow-500/70"
            }`}
          >
            {/* Status Header */}
            <div className={`px-4 py-3 ${item.claimed
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100"
                : "bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100"
              }`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${item.claimed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {item.claimed ? <span className="flex items-center justify-center gap-1"><FiCheck />Claimed</span> : <span className="flex items-center justify-center gap-1"><FiClock />Pending</span>}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-2 space-y-3">
              {/* Item Name */}
              <div className="mb-1 flex items-center justify-center text-gray-500"> 
              <h1 className="font-bold text-md line-clamp-1">
                  {item.itemName}
                </h1></div>
              {/* Description and Images */}
              <div>
                <div className="mb-2 flex gap-1">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {item.imageUrls?.length > 0 ? (
                    item.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={item.itemName}
                        className="h-21 w-21 md:h-20 md:w-20 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                        loading="lazy"
                      />
                    ))
                  ) : (
                    <div className="h-21 w-21 md:h-20 md:w-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-100 flex-shrink-0">
                      <div className="text-2xl text-gray-400 mb-1"><FiCamera /></div>
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-gray-50 p-1.5 rounded-lg">
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
                  {item.description}
                </p>
                </div>
                </div>
              </div>


              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Reported {timeAgo(item.createdAt)}
                </div>
                <button
                  onClick={() => deleteReport(item)}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
