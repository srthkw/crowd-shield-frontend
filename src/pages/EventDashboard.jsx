import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FiInfo, FiMapPin, FiCalendar, FiArrowLeft, FiChevronDown, FiChevronUp, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import API from "../api/axios";
import { Link } from "react-router-dom";
import AnnouncementTab from "../components/tabs/AnnouncementTab";
import LostFoundTab from "../components/tabs/LostFoundTab";
import ReportsTab from "../components/tabs/ReportsTab";
import HelplinesTab from "../components/tabs/HelplinesTab";
import EmergencyResponse from "../components/tabs/EmergencyResponse";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { roleGradientsBG, roleBorders } from "../constants/roleGradient";
import { useAuth } from "../hooks/useAuth";
import EmergencyButton from "../components/buttons/EmergencyBTN";

export default function EventDashboard() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [pageload, setPageload] = useState(true);
    const [activeTab, setActiveTab] = useState("Helplines"); // default tab
    const [expanded, setExpanded] = useState(false);
    const { user } = useAuth();
    const [showSOS, setShowSOS] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emergencyMSG, setEmergencyMSG] = useState("");

    const watchIdRef = useRef(null);
    let lastSent = 0;

    const startEmergency = () => {
        setLoading("location");
        watchIdRef.current = navigator.geolocation.watchPosition(
            async (pos) => {
                const now = Date.now();

                if (now - lastSent > 5000) {
                    lastSent = now;

                    const { latitude, longitude } = pos.coords;

                    const res = await API.post("/api/emergency/start", {
                        eventId,
                        latitude,
                        longitude,
                    });

                    if (res.data) {
                        setEmergencyMSG(res.data.message);
                        setShowSOS(false);
                        setLoading(null);
                    }
                }
            }
        );
    };

    // const stopEmergency = async () => {
    //     if (watchId) {
    //       navigator.geolocation.clearWatch(watchIdRef.current);
    //     }

    //     await API.post("/api/emergency/stop", { eventId });
    //   };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await API.get(`/events/${eventId}`);
                setEvent(res.data);
                setPageload(true);
            } catch (err) {
                console.error("Failed to load event", err);
            } finally {
                setPageload(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (pageload) return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 md:w-full w-screen h-screen z-10"><Loader /></div>;
    if (!event) return <p className="p-4 text-red-500">Event not found</p>;

    return (
        <>
            <div className={`bg-gradient-to-br ${roleGradientsBG[user.role] || ''} min-h-screen flex flex-col`}>
                <Navbar />

                <div className="w-full flex-1 flex flex-col min-h-0 px-1 md:px-3 py-2 md:py-8">
                    <div className={`w-full bg-gray-50 rounded-2xl shadow-lg mb-1 md:mb-3 overflow-hidden transition-all duration-300 border-t-4 
    ${roleBorders[user.role]} `}>

                        {/* Header */}
                        <div className={`px-4 md:px-8 md:pt-8 pt-4 ${expanded ? "mb-4" : ""}`}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className={`text-lg md:text-2xl font-bold text-gray-800 transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}>
                                        {event.name}
                                    </h1>
                                </div>

                                {/* Expand/Collapse Button */}
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className={`p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-300 flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
                                >
                                    <FiChevronDown className="md:w-6 md:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details - FIXED WITH SCROLLABILITY */}
                        <div className={`px-6 md:px-8 pb-6 md:pb-8 transition-all duration-300 ease-in-out overflow-hidden ${expanded ? "max-h-full opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className={`border-t border-gray-200 pt-3 space-y-6 ${expanded ? "overflow-y-auto max-h-[400px] md:max-h-none" : ""}`}>

                                {/* Description */}
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div>
                                                <FiInfo className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-800 text-md">Event Description</h3>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Location */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                                            <FiMapPin className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold">Location</span>
                                        </div>
                                        <p className="text-gray-800 font-medium break-words">
                                            {event.location}
                                        </p>
                                    </div>

                                    {/* Date */}
                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                                            <FiCalendar className="w-5 h-5 text-purple-600" />
                                            <span className="font-semibold">Event Date</span>
                                        </div>
                                        <p className="text-gray-800 font-medium">
                                            {new Date(event.date).toLocaleDateString("en-IN", {
                                                weekday: 'long',
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className={`bg-gray-50 rounded-2xl shadow-lg overflow-auto flex-1 min-h-0  border-b-4 ${roleBorders[user.role]} `}>
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto no-scrollbar-zero px-4 md:px-6">
                                {["Helplines", user.role === "organizer" && "emergencies reported", "announcements", "Lost Found", "item reports"].filter(Boolean).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`shrink-0 px-6 py-4 font-medium text-sm md:text-base capitalize transition-all duration-300 relative ${activeTab === tab
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                            }`}
                                    >
                                        {tab.replaceAll("-", " ")}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 md:p-6">
                            {activeTab === "Helplines" && (
                                <HelplinesTab eventId={event._id} />
                            )}
                            {activeTab === "emergencies reported" && (
                                <EmergencyResponse eventId={event._id} />
                            )}
                            {activeTab === "announcements" && (
                                <AnnouncementTab eventId={event._id} />
                            )}
                            {activeTab === "Lost-Found" && (
                                <LostFoundTab eventId={event._id} />
                            )}
                            {activeTab === "item reports" && (
                                <ReportsTab eventId={event._id} />
                            )}

                        </div>
                    </div>
                </div>
                {user.role === "attendee" && (
                    <span onClick={() => setShowSOS(true)} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
                        <EmergencyButton />
                    </span>
                )}

                {showSOS && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
                        <div className="flex flex-col relative bg-white rounded-lg p-6 w-80 text-center">
                        <span
                        onClick={() => {
                            if (loading !== "location") setShowSOS(false);
                        }}
                        className="absolute top-3 right-3 text-xl text-gray-400 cursor-pointer">
                            <FiXCircle />
                            </span>
                            <span className={`text-4xl mb-4 mx-auto ${emergencyMSG.length > 0 ? "text-green-500" : "text-red-600"}`}><FiAlertTriangle /></span>
                            <h2 className="text-xl font-bold mb-2 text-gray-900">Alert</h2>
                            <p className={`text-gray-700 mb-4`}>{ emergencyMSG.length > 0 ? emergencyMSG : "Clicking below button shares your location with the organizers. Please do not click if you are not in immediate danger. After sharing, please wait for our team to reach you." }</p>
                            {emergencyMSG.length === 0 && (
                                <button
                                disabled={loading === "location"}
                                onClick={startEmergency}
                                className={`px-4 py-2 text-white rounded-md cursor-pointer bg-red-600 hover:bg-red-700`}
                                >{loading === "location" ? "Sharing..." : "Share Location"}</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
