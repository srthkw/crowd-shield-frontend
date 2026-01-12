import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function LostFoundTab({ eventId }) {
    const { user } = useAuth();
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTypes, setShowTypes] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dropdownRef = useRef(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchInfo, setMatchInfo] = useState(null);
    const [form, setForm] = useState({
        type: "lost",
        itemName: "",
        description: "",
        location: "",
        phone: ""
    });

    const ITEM_TYPES = [
        "Phone",
        "Wallet",
        "Bag",
        "Laptop",
        "Earbuds",
        "Camera",
        "Headphones",
        "Watch",
        "Jewelry",
        "Keys",
        "Power Bank",
        "Water Bottle",
        "Book",
        "Clothes",
        "Shoes",
        "Passport",
        "Child",
        "Elderly Person",
        "Cash",
        "Person",
        "Documents",
        "Other"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/lostfound/${eventId}`);
                const lost = res.data.filter(i => i.type === "lost");
                const found = res.data.filter(i => i.type === "found");
                const sortByOwnership = (items) =>
                    items.sort((a, b) => (a.reportedBy === user.id ? -1 : 0) - (b.reportedBy === user.id ? -1 : 0));
                  
                  setLostItems(sortByOwnership(lost));
                  setFoundItems(sortByOwnership(found));
                  
            } catch (err) {
                console.error("Failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowTypes(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const openModal = (type) => {
        setForm(prev => ({ ...prev, type }));
        setShowModal(true);
    };

    const submitReport = async () => {
        const { type, itemName, description, location, phone } = form;
        if (!itemName.trim() || !description.trim() || !location.trim() || !phone.trim()) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await axios.post("/lostfound", {
                eventId,
                ...form
            });

            // Optimistic update — add new card instantly
            const createdItem = res.data.item;  // extract actual new report

            if (form.type === "lost") {
                setLostItems(prev => [createdItem, ...prev]);
            } else {
                setFoundItems(prev => [createdItem, ...prev]);
            }

            // 🔥 if a match exists, show highlight pop-up
            if (res.data.match) {
                setMatchInfo({
                    newItem: createdItem,
                    existingMatches: res.data.match
                });
            }


            // Reset + close modal
            setShowModal(false);
            setForm({
                type: "lost",
                itemName: "",
                description: "",
                location: "",
                phone: ""
            });
            setShowTypes(false); // hide dropdown

        } catch (err) {
            console.error("Report failed:", err);
            alert("Failed to report");
        }
    };

    const claimItem = async (item) => {
        try {
            await axios.patch(`/lostfound/claim/${item._id}`);

            // Remove from visible list immediately
            if (item.type === "lost") {
                setLostItems(prev => prev.filter(i => i._id !== item._id));
            } else {
                setFoundItems(prev => prev.filter(i => i._id !== item._id));
            }

            // If modal is showing matches, update that too
            if (matchInfo) {
                setMatchInfo(prev => ({
                    ...prev,
                    existingMatches: prev.existingMatches.filter(i => i._id !== item._id)
                }));
            }

        } catch (err) {
            alert(err.response?.data?.message || "Failed to claim item");
        }
    };

    const refreshMatches = async () => {
        if (!matchInfo?.newItem) return;

        try {
            const res = await axios.post("/lostfound/match-check", {
                eventId,
                itemId: matchInfo.newItem._id
            });

            setMatchInfo(prev => ({
                ...prev,
                existingMatches: res.data.match
            }));
        } catch (err) {
            console.error("Failed to refresh matches:", err);
        }
    };


    if (loading) return     <div className="flex flex-row justify-center items-center gap-2">
    <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce" />
    <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]" />
    <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]" />
  </div>;

    return (
        <div className="space-y-6">

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => openModal("lost")}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Report Lost
                </button>
                <button
                    onClick={() => openModal("found")}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Report Found
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded w-96 space-y-4">

                        <h2 className="text-xl font-bold">
                            {form.type === "lost" ? "Report Lost Item" : "Report Found Item"}
                        </h2>

                        <div className="relative" ref={dropdownRef}>
                            <input
                                type="text"
                                placeholder="Search item type..."
                                value={form.itemName}
                                onChange={e => setForm({ ...form, itemName: e.target.value })}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                                onFocus={() => setShowTypes(true)}
                            />

                            {showTypes && (
                                <div className="absolute left-0 right-0 bg-gray-900 border border-gray-700 max-h-40 overflow-y-auto z-50">
                                    {ITEM_TYPES
                                        .filter(type =>
                                            type.toLowerCase().includes(form.itemName.toLowerCase())
                                        )
                                        .map(type => (
                                            <div
                                                key={type}
                                                className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                                                onClick={() => {
                                                    setForm({ ...form, itemName: type });
                                                    setShowTypes(false);
                                                }}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>


                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        ></textarea>

                        <input
                            type="text"
                            placeholder="Location"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        />

                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                        />


                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-2 bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReport}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {matchInfo && (
                <div className="p-4 bg-yellow-500 text-black font-semibold rounded shadow-lg mb-4">
                    🔔 Match detected!
                    <button
                        className="underline ml-2"
                        onClick={() => setShowMatchModal(true)}
                    >
                        View Details
                    </button>
                </div>
            )}


            {/* LOST LIST */}
            <div>
                <h2 className="text-xl font-bold mb-2">Lost Items</h2>
                {lostItems.length === 0 && <p>No lost items reported yet.</p>}
                {lostItems.map(item => (
                    <div key={item._id} className="border p-4 rounded bg-gray-900 mb-3">
                        <p className="font-semibold text-lg">{item.itemName}</p>
                        <p className="text-gray-300">{item.description}</p>
                        <p className="text-gray-400 text-sm">{item.location} • {new Date(item.createdAt).toLocaleString()}</p>
                        {(user.id === item.reportedBy || user.role === "admin" || user.role === "organizer") && (
                            <button
                                onClick={() => claimItem(item)}
                                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
                            >
                                Mark as Claimed
                            </button>
                        )}
                        {console.log("user.id:", user.id, " reportedBy:", item.reportedBy)}
                    </div>
                ))}
            </div>

            {/* FOUND LIST */}
            <div>
                <h2 className="text-xl font-bold mb-2">Found Items</h2>
                {foundItems.length === 0 && <p>No found items reported yet.</p>}
                {foundItems.map(item => (
                    <div key={item._id} className="border p-4 rounded bg-gray-900 mb-3">
                        <p className="font-semibold text-lg">{item.itemName}</p>
                        <p className="text-gray-300">{item.description}</p>
                        <p className="text-gray-400 text-sm">{item.location} • {new Date(item.createdAt).toLocaleString()}</p>
                        {(user.id === item.reportedBy || user.role === "admin") && (
                            <button
                                onClick={() => claimItem(item)}
                                className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
                            >
                                Mark as Claimed
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showMatchModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded w-[500px] space-y-6">

                        <h2 className="text-2xl font-bold text-center">Possible Match Found</h2>

                        <button
                            onClick={refreshMatches}
                            className="px-3 py-1 bg-yellow-500 text-black rounded shadow text-sm"
                        >
                            🔄 Refresh Matches
                        </button>
                        <p className="text-gray-400 text-xs">
                            Last updated: {new Date().toLocaleTimeString()}
                        </p>

                        <div>Reported item:</div>

                        {/* NEWLY reported item */}
                        <div className="bg-gray-800 p-4 rounded">
                            <p className="font-semibold text-lg">{matchInfo.newItem.itemName}</p>
                            <p className="text-gray-300">{matchInfo.newItem.description}</p>
                            <p className="text-gray-400 text-sm">
                                {matchInfo.newItem.location} • {new Date(matchInfo.newItem.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div>Might be yours:</div>
                        {/* EXISTING match */}
                        {matchInfo.existingMatches.map(m => (
                            <div
                                key={m._id}
                                className="bg-gray-800 p-4 rounded border border-yellow-400"
                            >
                                <p className="font-semibold text-lg">{m.itemName}</p>
                                <p className="text-gray-300">{m.description}</p>
                                <p className="text-gray-400 text-sm">
                                    {m.location} • {new Date(m.createdAt).toLocaleString()}
                                </p>
                                <button
                                    onClick={() => window.location.href = `tel:${m.phone}`}
                                    className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded"
                                >
                                    Contact Reporter
                                </button>
                            </div>
                        ))}


                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowMatchModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}
