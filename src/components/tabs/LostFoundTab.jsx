import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Loader2 from "../Loader2";
import { FiInfo, FiMapPin, FiRefreshCw, FiCamera, FiXCircle, FiPhoneCall } from "react-icons/fi";
import ItemCard from "../ItemCard";

export default function LostFoundTab({ eventId }) {
    const { user } = useAuth();
    const dropdownRef = useRef(null);
    const refs = useRef({});
    const [overflowMap, setOverflowMap] = useState({});
    const [readMore, setReadMore] = useState(null);
    const [animate, setAnimate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimLoad, setClaimLoad] = useState(null);
    const [files, setFiles] = useState([]);
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [showTypes, setShowTypes] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [setDetails, setSetDetails] = useState(false);
    const [matchInfo, setMatchInfo] = useState(null);
    const [form, setForm] = useState({
        type: "lost",
        itemName: "",
        description: "",
        location: "",
        phone: ""
    });

    const ITEM_TYPES = [
        "Bag",
        "Book",
        "Camera",
        "Cash",
        "Charger",
        "Child",
        "Clothes",
        "Documents",
        "Earbuds",
        "Elderly Person",
        "Headphones",
        "ID Card",
        "Jewelry",
        "Keys",
        "Laptop",
        "Medication",
        "Passport",
        "Person",
        "Phone",
        "Power Bank",
        "Shoes",
        "Spectacles",
        "Tablet",
        "Umbrella",
        "Wallet",
        "Watch",
        "Water Bottle",
        "Other",
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

    const handleFileChange = (e) => {
        setFiles([e.target.files[0]]);
    };

    const submitReport = async () => {
        setAnimate("submit");
        const { itemName, description, location, phone, type } = form;

        if (!itemName || !description || !location || !phone) {
            alert("All fields are required");
            setAnimate(null);
            return;
        }

        if (type === "found" && files.length === 0) {
            alert("Select at least one image");
            setAnimate(null);
            return;
        }

        const formData = new FormData();

        formData.append("eventId", eventId);
        formData.append("type", type);
        formData.append("itemName", itemName);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("phone", phone);

        files.forEach(file => {
            formData.append("image", file); // MUST match multer field
        });

        try {
            const res = await axios.post("/lostfound", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const createdItem = res.data.item;

            if (type === "lost") {
                setLostItems(prev => [createdItem, ...prev]);
            } else {
                setFoundItems(prev => [createdItem, ...prev]);
            }

            setShowModal(false);
            setAnimate(null);
            setFiles([]);
            setForm({
                type: "lost",
                itemName: "",
                description: "",
                location: "",
                phone: "",
            });

        } catch (err) {
            console.error(err);
            alert("Failed to report item");
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

        } catch (err) {
            alert(err.response?.data?.message || "Failed to claim item");
        } finally {
            setClaimLoad(null);
        }
    };

    const checkMatches = async (item) => {
        try {
            setAnimate("refresh")
            const res = await axios.post(`/lostfound/matches/${eventId}`, { item });
            const matches = res.data;
            setMatchInfo(matches.length > 0 ? {
                newItem: item,
                existingMatches: matches,
            } : {
                newItem: item,
                existingMatches: null,
            });
            // Show matches modal when matches are found
            setShowMatchModal(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to check matches");
        } finally {
            setAnimate(null);
        }
    };

    useEffect(() => {
        if (!matchInfo?.existingMatches?.length) return;
      
        const next = {};
      
        matchInfo.existingMatches.forEach((m) => {
          const el = refs.current[m._id];
          if (!el) return;
      
          next[m._id] = el.scrollHeight > el.clientHeight;
        });
      
        setOverflowMap(next);
      }, [matchInfo]);


    if (loading) return <Loader2 />;

    return (
        <div className="space-y-8">

            {/* Report Buttons - Enhanced with gradient and hover effects */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
                <button
                    onClick={() => openModal("lost")}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/20 hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                >
                    Report Lost
                </button>
                <button
                    onClick={() => openModal("found")}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                >
                    Report Found
                </button>
            </div>

            {/* Main Modal - Redesigned with glass morphism and improved layout */}
            {showModal && (
                <div className="fixed inset-0 h-full bg-black/50 backdrop-blur-sm flex items-center justify-center md:text-md text-sm z-50 p-4">
                    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 w-full max-w-md md:space-y-3 space-y-2 p-5">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {form.type === "lost" ? "Report Lost Item" : "Report Found Item"}
                            </h2>
                        </div>

                        {/* File Input - Styled to match theme */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full p-3 text-stone-700 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white"
                            />
                        </div>

                        {/* Item Type Dropdown - Enhanced with better styling */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Item Type
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Select options from the dropdown for better results"
                                    value={form.itemName}
                                    onChange={e => setForm({ ...form, itemName: e.target.value })}
                                    className="w-full p-3 text-sm text-stone-700 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                    onFocus={() => setShowTypes(true)}
                                />

                                {showTypes && (
                                    <div className="absolute z-50 left-0 right-0 mt-1 text-stone-700 bg-white border border-gray-200 rounded-xl shadow-lg shadow-blue-500/10 max-h-48 overflow-y-auto">
                                        {ITEM_TYPES
                                            .filter(type =>
                                                type.toLowerCase().includes(form.itemName.toLowerCase())
                                            )
                                            .map(type => (
                                                <div
                                                    key={type}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
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
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                placeholder="Provide detailed description..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full p-3 text-stone-700 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 md:min-h-[100px] resize-y leading-relaxed"
                            />
                        </div>

                        {/* Location Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="Where was it lost/found?"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className="w-full p-3 text-stone-700 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Your contact number"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="w-full p-3 text-stone-700 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 text-gray-700 font-medium border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 min-h-[44px]"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={animate === "submit"}
                                onClick={submitReport}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all duration-300 min-h-[44px]"
                            >
                                {animate === "submit" ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lost Items Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Lost Items</h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 text-sm font-semibold rounded-full">
                        {lostItems.length} items
                    </span>
                </div>

                {lostItems.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-200/30">
                        <div className="text-gray-600 text-5xl mb-3"><FiInfo /></div>
                        <p className="text-gray-600 font-medium">No lost items reported yet</p>
                        <p className="text-gray-500 text-sm mt-1">Be the first to report a lost item</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lostItems.map(item => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                user={user}
                                checkMatches={checkMatches}
                                setSetDetails={setSetDetails}
                                claimItem={claimItem}
                                setClaimLoad={setClaimLoad}
                                claimLoad={claimLoad}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Found Items Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Found Items</h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 text-sm font-semibold rounded-full">
                        {foundItems.length} items
                    </span>
                </div>

                {foundItems.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-200/30">
                        <div className="text-gray-600 text-5xl mb-3"><FiInfo /></div>
                        <p className="text-gray-600 font-medium">No found items reported yet</p>
                        <p className="text-gray-500 text-sm mt-1">Be the first to report a found item</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {foundItems.map(item => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                user={user}
                                checkMatches={checkMatches}
                                setSetDetails={setSetDetails}
                                claimItem={claimItem}
                                setClaimLoad={setClaimLoad}
                                claimLoad={claimLoad}
                            />
                        ))}
                    </div>
                )}
            </div>


            {setDetails && (
                <div className="fixed inset-0 h-screen z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl shadow-blue-500/10 border border-gray-200 w-full max-w-sm">

                        {/* Header with close button */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
                            <button
                                onClick={() => setSetDetails(null)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            <div className="flex flex-col items-center">
                                {/* Item Name */}
                                <h3 className="font-medium text-gray-800 text-base">{setDetails.itemName}</h3>

                                <div className="px-1.5 py-2">
                                    <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
                                        {setDetails.imageUrls?.length > 0 ? (
                                            setDetails.imageUrls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={setDetails.itemName}
                                                    className="h-35 w-35 md:h-50 md:w-50 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                                                    loading="lazy"
                                                />
                                            ))
                                        ) : (
                                            <div className="h-35 w-35 md:h-50 md:w-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-100 flex-shrink-0">
                                                <div className="text-2xl text-gray-400 mb-1"><FiCamera /></div>
                                                <p className="text-xs text-gray-500">No image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Description */}
                            <div className="flex items-center gap-2">
                                <div className="gap-1.5 text-gray-700 bg-blue-50 w-full px-3 py-2 rounded-lg text-sm max-h-40 overflow-y-auto no-scrollbar">
                                    <div className="flex items-center gap-1 font-semibold mb-1"><FiInfo className="text-gray-400" /><span>Description</span></div>
                                    <span className="break-words whitespace-pre-wrap">{setDetails.description}</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <div className="gap-1.5 text-gray-700 bg-gray-50 w-full px-3 py-2 rounded-lg text-sm max-h-40 overflow-y-auto
                                no-scrollbar">
                                    <div className="flex items-center gap-1 font-semibold mb-1"><FiMapPin className="text-gray-400" /><span>Location</span></div>
                                    <span className="break-words whitespace-pre-wrap">{setDetails.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Match Details Modal */}
            {showMatchModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col bg-gray-50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden shadow-blue-500/20 w-screen h-[85vh] md:h-[95vh] max-w-4xl py-5 md:p-6">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center md:gap-15 gap-8 mb-6 px-6">
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Possible Match Found</h2>
                                <p className="text-gray-600 text-xs md:text-sm mt-">Compare details below</p>
                            </div>
                            <button
                                onClick={() =>{
                                     setReadMore(null);
                                     setShowMatchModal(false)}}
                                className="text-gray-500 hover:text-gray-700 text-3xl transition-colors"
                                aria-label="Close modal"
                            >
                                <FiXCircle />
                            </button>
                        </div>

                        {/* Newly Reported Item */}
                        {matchInfo &&
                            <div className="space-y-3 overflow-y-scroll no-scrollbar h-full rounded-lg bg-blue-50 p-3 border-1 border-blue-300/30">
                                <h3 className="font-bold text-gray-800 text-lg">Your Reported Item</h3>
                                <div className="bg-blue-100 p-2.5 rounded-xl max-w-100 border-1 border-dashed border-blue-800/30">
                                    <div className="flex flex-row items-center justify-around">
                                        {matchInfo.newItem.imageUrls?.length > 0 ? (
                                            matchInfo.newItem.imageUrls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={matchInfo.newItem.itemName}
                                                    className="h-20 w-20 object-cover rounded-l-lg border-1 border-white shadow-sm flex-shrink-0"
                                                    loading="lazy"
                                                />
                                            ))
                                        ) : (
                                            <div className="h-20 w-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-l-lg border-2 border-dashed border-blue-200/50 flex-shrink-0">
                                                <div className="text-4xl text-gray-400 mb-2"><FiCamera /></div>
                                                <p className="text-xs text-gray-500 text-center px-2">No image</p>
                                            </div>
                                        )}
                                        <div className="bg-gray-100/70 p-3.5 rounded-r-lg flex-1">
                                            <h3 className="font-semibold text-xl text-gray-600">{matchInfo.newItem.itemName}</h3>
                                            <span className="text-gray-600 text-sm">Reported at: {new Date(matchInfo.newItem.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-gray-800 text-lg flex flex-col md:flex-row gap-2 md:gap-0 items-cente md:justify-between">
                                        <div className="flex items-center gap-2">
                                            <span>Potential Matches</span>
                                            <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-full">
                                                {matchInfo.existingMatches == null ? "No" : matchInfo.existingMatches.length} items
                                            </span>
                                        </div>

                                        {/* Refresh Button */}
                                        <div className="flex mt-auto font-medium">
                                            <div
                                                className="flex items-center justify-center bg-blue-200/20 border-2 border-gray-200 px-3 py-2 rounded-xl"
                                                onClick={() => checkMatches(matchInfo.newItem)}
                                            >
                                                <div className="text-xs text-gray-900 flex items-center justify-center">
                                                    <button className="flex items-center justify-center rounded-lg mr-3 bg-gray-300/80 px-2 py-2">
                                                        <span >
                                                            <FiRefreshCw className={`size-3.5 mr-2 ${animate === "refresh" && "animate-spin"}`} />
                                                        </span>Refresh</button>
                                                    <span>Last updated: {new Date().toLocaleTimeString(
                                                        "en-US",
                                                        { hour12: true, hour: "numeric", minute: "numeric" }
                                                    )}</span></div>
                                            </div>
                                        </div>
                                    </h3>

                                    <div className="space-y-4">
                                        {matchInfo.existingMatches == null && (
                                            <h2 className="text-stone-700">No matches found</h2>
                                        )}

                                        {matchInfo.existingMatches !== null && matchInfo.existingMatches.map(m => (
                                            <div
                                                key={m._id}
                                                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                            >
                                                {/* Top Gradient Accent */}
                                                <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>

                                                {/* Content */}
                                                <div className="p-4 space-y-4">

                                                    {/* Header with Images and Title */}
                                                    <div className="flex items-start gap-4">
                                                        {/* Image Container */}
                                                        <div className="flex-shrink-0">
                                                            {m.imageUrls?.length > 0 ? (
                                                                <div className="relative">
                                                                    <img
                                                                        src={m.imageUrls[0]}
                                                                        alt={m.itemName}
                                                                        className="h-16 w-16 object-cover rounded-lg border border-gray-100 shadow-sm"
                                                                        loading="lazy"
                                                                    />
                                                                    {m.imageUrls.length > 1 && (
                                                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white text-xs font-medium rounded-full flex items-center justify-center border border-white">
                                                                            +{m.imageUrls.length - 1}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="h-16 w-16 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                                                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <p className="text-xs text-gray-500">No image</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Title and Date */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h4 className="font-semibold text-gray-800 text-base line-clamp-2 flex-1">
                                                                    {m.itemName}
                                                                </h4>
                                                                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                                                    {new Date(m.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>

                                                            {/* Location */}
                                                            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                                                                <div><FiMapPin className="text-gray-400" /></div>
                                                                <span className="line-clamp-1 wrap-break-word">{m.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div>
                                                        <div key={m._id} className={`relative pr-1 bg-gray-200/50 p-1.5 rounded-lg`}>
                                                            <p ref={(el) => {
                                                                if (el) {
                                                                    refs.current[m._id] = el;
                                                                }
                                                            }} className={`text-sm text-gray-600 leading-relaxed whitespace-pre-wrap wrap-break-word ${readMore === m._id ? "line-clamp-none" : "line-clamp-3"}`}>
                                                                {m.description}
                                                            </p>
                                                        </div>
                                                        
                                                        {overflowMap[m._id] &&
                                                        <button onClick={() => setReadMore(readMore === m._id ? null : m._id)} className="text-xs text-blue-600 hover:underline">
                                                            {readMore === m._id ? "Show Less" : "Read More"}
                                                        </button>
                                                        }
                                                    </div>

                                                    {/* Contact Button */}
                                                    <button
                                                        onClick={() => window.location.href = `tel:${m.phone}`}
                                                        className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 text-sm shadow-sm hover:shadow flex items-center justify-center gap-2 group"
                                                    >
                                                        <FiPhoneCall />
                                                        Contact Reporter
                                                    </button>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            )}
        </div>

    );
}
