import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ReportsTab() {
  const { eventId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const deleteReport = async (item) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
  
    try {
      await axios.delete(`/lostfound/${item._id}`);
      setItems(prev => prev.filter(r => r._id !== item._id));  // remove from UI instantly
    } catch (err) {
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

  if (loading) return <div className="flex flex-row justify-center items-center gap-2">
  <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce" />
  <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]" />
  <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]" />
</div>;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">My Reports</h2>

      {items.length === 0 && (
        <div className="p-6 text-center bg-gray-900 border border-gray-700 rounded">
          <p className="text-gray-300 text-lg">Nothing reported yet!</p>
          <p className="text-gray-500 text-sm">Report lost or found items to see them here.</p>
        </div>
      )}

{items.map(item => (
  <div
    key={item._id}
    className="border p-4 rounded bg-gray-900 mb-3 relative"
  >
    <p className="font-semibold text-lg">{item.itemName}</p>
    <p className="text-gray-300">{item.description}</p>
    <p className="text-gray-400 text-sm">
      {item.location} • {new Date(item.createdAt).toLocaleString()}
    </p>

    {/* STATUS LABEL */}
    <span
      className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded
        ${item.claimed ? "bg-green-600 text-white" : "bg-yellow-500 text-black"}
      `}
    >
      {item.claimed ? "CLAIMED" : "PENDING"}
    </span>

    {/* DELETE BUTTON */}
    <button
      onClick={() => deleteReport(item)}
      className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
    >
      Delete
    </button>
  </div>
))}

    </div>
  );
}
