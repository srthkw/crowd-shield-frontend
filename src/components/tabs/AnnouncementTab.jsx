import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { FiTrash2, FiVolume2, FiCalendar, FiUser, FiX } from "react-icons/fi";
import Loader2 from "../Loader2";

export default function AnnouncementTab({ eventId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pop, setPop] = useState(false);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [eventCreator, setEventCreator] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`/announcements/event/${eventId}`);
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    const fetchEvent = async () => {
      try {
          const res = await axios.get(`/events/${eventId}`);
          setEventCreator(res.data.createdBy);
      } catch (err) {
          console.error("Failed to load event", err);
      }
  };
  fetchEvent();
  }, [eventId]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);

    try {
      const res = await axios.post("/announcements", {
        eventId,
        message,
      });

      // Optimistic update (no refetch)
      setAnnouncements(prev => [res.data, ...prev]);
      setMessage("");
      setShowModal(false);

    } catch (err) {
      console.error("Failed to create announcement", err);
      alert("Error adding announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!confirm("Delete announcement?")) return;

    try {
      await axios.delete(`/announcements/${announcementId}`);

      // Remove instantly without refetch
      setAnnouncements(prev =>
        prev.filter(a => a._id !== announcementId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete announcement");
    }
  };


  if (loading) return <Loader2/>;

  return (
    <div className="py-2 md:py-3">
      {/* CREATE BUTTON — only for organizer/admin */}
      {(user.id === eventCreator || user.role === "admin") && (
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <span className="text-xl">+</span>
            Add Announcement
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
          <div
            className="bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                New Announcement
              </h2>
            </div>

            <textarea
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none text-black"
              placeholder="Type your announcement message here..."
            />

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="py-2.5 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Announcement"
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS LIST */}
      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <FiVolume2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Announcements Yet
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {announcements.map((a) => {
            const canDelete = user.role === "admin" || user.id === a.createdBy;

            return (
              <div
                key={a._id}
                className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 rounded-2xl hover:shadow-sm transition-all duration-300 overflow-hidden cursor-pointer group border-y-4 border-gray-300"
                onClick={() => setPop(pop === a._id ? null : a._id)}
              >
                {/* Delete button */}
                {canDelete && (
                  <button
                    onClick={(e) => e.stopPropagation() || handleDelete(a._id)}
                    className="absolute top-1 md:top-4 right-1 md:right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all shadow-sm"
                  >
                    <FiTrash2 className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                )}

                {/* Announcement Content */}
                <div className="p-3 pb-4 flex flex-col">
                  <div className="mb-4 relative md:pr-10 h-full">
                    <div className="flex items-start gap-3">
                      <div className="md:p-2 p-1 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex-shrink-0">
                        <FiVolume2 className="md:w-5 md:h-5  text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0 md:h-20">
                        <h3 className="font-semibold text-gray-800 line-clamp-3 text-sm leading-relaxed break-words">
                          {a.message}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {new Date(a.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        <span className="font-medium capitalize">{a.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ANNOUNCEMENT DETAIL MODAL */}
      {pop && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setPop(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Announcement Details
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiUser className="w-4 h-4" />
                  <span className="font-medium text-md capitalize">
                    Posted by: {announcements.find(a => a._id === pop)?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPop(null)}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <FiVolume2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Announcement</h4>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-1 md:p-4">
                    <p className="text-gray-700 md:text-md leading-relaxed whitespace-pre-wrap break-words">
                      {announcements.find(a => a._id === pop)?.message}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <FiCalendar className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Posted On</span>
                  </div>
                  <p className="text-gray-800">
                    {new Date(
                      announcements.find(a => a._id === pop)?.createdAt
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
