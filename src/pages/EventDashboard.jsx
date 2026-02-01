import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiInfo, FiMapPin, FiCalendar, FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import API from "../api/axios";
import AnnouncementTab from "../components/tabs/AnnouncementTab";
import LostFoundTab from "../components/tabs/LostFoundTab";
import { Link } from "react-router-dom";
import ReportsTab from "../components/tabs/ReportsTab";
import HelplinesTab from "../components/tabs/HelplinesTab";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function EventDashboard() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [pageload, setPageload] = useState(true);
    const [activeTab, setActiveTab] = useState("announcements"); // default tab
    const [expanded, setExpanded] = useState(false);

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

    if (pageload) return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 md:w-full w-screen h-screen z-10 bg-white/10"><Loader /></div>;
    if (!event) return <p className="p-4 text-red-500">Event not found</p>;

    return (
        <>
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 min-h-screen flex flex-col">
                <Navbar />

                <div className="max-w-screen flex-1 flex flex-col min-h-0 mx-auto px-1 md:px-3 py-2 md:py-8">
                    {/* Event Header Card */}
                    <div className={`bg-white/60 rounded-2xl shadow-lg mb-1 md:mb-3 overflow-hidden transition-all duration-300 border-t-4 border-violet-500/70`}>

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
                    <div className="bg-white/60 rounded-2xl shadow-lg overflow-auto flex-1 min-h-0  border-b-4 border-violet-500/70">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto no-scrollbar-zero px-4 md:px-6">
                                {["announcements", "Helplines", "Lost-Found", "reports" ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`shrink-0 px-6 py-4 font-medium text-sm md:text-base capitalize transition-all duration-300 relative ${activeTab === tab
                                            ? "text-blue-600"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                            }`}
                                    >
                                        {tab.replace("-", " ")}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 md:p-6">
                            {activeTab === "announcements" && (
                                <AnnouncementTab eventId={event._id} />
                            )}
                            {activeTab === "Lost-Found" && (
                                <LostFoundTab eventId={event._id} />
                            )}
                            {activeTab === "reports" && (
                                <ReportsTab eventId={event._id} />
                            )}
                            {activeTab === "Helplines" && (
                                <HelplinesTab eventId={event._id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
