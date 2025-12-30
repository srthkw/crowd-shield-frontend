import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function AnnouncementTab({ eventId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
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
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">

      {/* CREATE BUTTON — only for organizer/admin */}
      {(user.role === "organizer" || user.role === "admin") && (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          + Add Announcement
        </button>
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
      {announcements.map(a => {
        const canDelete =
          user.role === "admin" || user.id === a.createdBy;

        return (
          <div
            key={a._id}
            className="relative border border-gray-700 p-4 rounded bg-gray-900"
          >
            {/* Delete button */}
            {canDelete && (
              <button
                onClick={() => handleDelete(a._id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-200"
              >
                Delete
              </button>
            )}

            <p className="text-lg font-semibold">{a.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Announcement by: {a.role}
              </p>
          </div>
        );
      })}

    </div>
  );
}
