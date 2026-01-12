import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { FiTrash2 } from "react-icons/fi";

export default function AnnouncementTab({ eventId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pop, setPop] = useState(false);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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


  if (loading) return <div className="flex flex-row justify-center items-center gap-2 mt-6">
    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-bounce" />
    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]" />
    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]" />
  </div>;

  return (
    <div className="relative ">

      {/* CREATE BUTTON — only for organizer/admin */}
      {(user.role === "organizer" || user.role === "admin") && (
        <div className="w-full h-10 my-5 sm:h-10 flex justify-center relative"><button
          onClick={() => setShowModal(true)}
          className="absolute cursor-pointer transition-all text-sm bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
          + Add Announcement
        </button></div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-xl font-bold">New Announcement</h2>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded outline-none"
              placeholder="Type your message..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="px-3 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS LIST */}
      {announcements.length === 0 && <p>No announcements yet.</p>}

      <div className="flex flex-row flex-wrap items-center justify-center">
        <div className="flex flex-row flex-wrap items-center justify-between w-[95vw]">
          {announcements.map(a => {
            const canDelete =
              user.role === "admin" || user.id === a.createdBy;

            return (
              <div
                key={a._id}
                className={`relative flex flex-col py-4 px-6 overflow-hidden bg-white/50 w-[95vw] sm:w-[47vw] rounded-lg mb-4`} onClick={() => setPop(pop === a._id ? null : a._id)}
              >
                {/* Delete button */}
                {canDelete && (
                  <button
                    onClick={(e) =>
                      e.stopPropagation() ||
                      handleDelete(a._id)}
                    className="absolute top-4 right-3 sm:right-5 text-red-400 hover:text-red-800 cursor-pointer"
                  >
                    <FiTrash2 className="size-5" />
                  </button>
                )}

                <div className="pointer-events-none">
                  <div className={`relative text-sm font-semibold text-stone-700 w-60 sm:w-160 min-w-0 cursor-pointer line-clamp-2`}>{a.message}</div>
                  </div>

                  {pop === a._id && (
                    <div className="bg-black/30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex items-center justify-center"><div className="w-70 sm:w-120 max-h-60 sm:max-h-80 overflow-y-scroll text-sm sm:text-md bg-white/70 rounded-2xl text-stone-800 font-semibold backdrop-blur-sm p-5
                    [scrollbar-color:rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-black/50
                    "><h2 className="text-xl font-bold mb-1">Announcement</h2>{a.message}</div></div>
                  )}

                <p className="text-xs italic sm:text-sm text-stone-700 mt-3">
                  {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
                <p className="text-xs italic sm:text-sm text-stone-700">
                  Announcement by: {a.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
