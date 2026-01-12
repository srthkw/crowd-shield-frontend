import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiInfo, FiMapPin, FiCalendar, FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AnnouncementTab from "../components/tabs/AnnouncementTab";
import LostFoundTab from "../components/tabs/LostFoundTab";
import { Link } from "react-router-dom";
import ReportsTab from "../components/tabs/ReportsTab";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Bg from "../components/Bg";

export default function EventDashboard() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [pageload, setPageload] = useState(true);
    const [activeTab, setActiveTab] = useState("announcements"); // default tab
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

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

    if (pageload) return <div className="bg-default"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 w-[120vw] h-[120vh] z-10 bg-black/30"><Loader /></div></div>;
    if (!event) return <p className="p-4 text-red-500">Event not found</p>;

    return (
        <>
            <div className="bg-default"></div>
            <Navbar />
            <div className="w-full h-screen mx-auto relative z-1">
                {/* Header */}

                <div className={`flex flex-col justify-center text-stone-700 p-3 glass-bg shadow-lg shadow-black/10 text-left transition-all duration-300 ease-in-out ${expanded ? "rounded-t-none" : "rounded-none"}`}>
                    <div className="flex justify-center items-center my-1 mb-3">
                        <FiArrowLeft className="sm:text-2xl text-stone-600 absolute left-2 sm:left-5 text-xl font-bold cursor-pointer" onClick={() => navigate(-1)} /><h1 className="sm:text-xl text-stone-600 py-0 text-lg font-bold">Event Dashboard</h1>
                    </div>
                    <div className="border-b border-black/30 w-[98vw] sm:self-start mb-3 relative z-1 left-1/2 -translate-x-1/2"></div>

                    <div className="text-md font-bold mb-1 relative"><div className={`pr-15 overflow-hidden ${expanded ? "" : "line-clamp-2"} `}>{event.name}</div>
                    <span className={`absolute right-1 top-0 cursor-pointer transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} onClick={() => setExpanded(!expanded)} ><FiChevronDown className="size-7"/></span>
                    </div>
                    
                    <div className={`text-left text-xs sm:text-sm transition-all duration-300 ease-in-out ${expanded ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
                        <div className="border-b border-black/30 w-[98vw] sm:self-start my-2 relative z-1 left-1/2 -translate-x-1/2"></div>
                        <span className="flex items-top relative"><FiInfo className="absolute top-1 size-4"/><p className="pl-8" id="description">{event.description}</p></span>
                        <div className="border-b border-black/30 w-[98vw] sm:self-start my-2 relative z-1 left-1/2 -translate-x-1/2"></div>

                        <span className="flex items-top relative"><FiMapPin className="absolute top-1 size-4"/><p className="pl-8">{event.location}</p></span>
                        <div className="border-b border-black/30 w-[98vw] sm:self-start my-2 relative z-1 left-1/2 -translate-x-1/2"></div>

                        <span className="flex items-top relative mb-1"><FiCalendar className="absolute top-1 size-4"/><p className="pl-8 flex gap-1 items-center">{new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p></span>
                    </div>
                </div>


                {/* Desktop View */}
                <div className="relative z-5 flex flex-col">
                    {/* Tabs */}
                    <div className="flex items-center flex-wrap justify-center gap-2 mt-6 text-sm">
                        {["announcements", "Lost-Found", "reports", "SOS"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`p-2 bg-[#cc8ee7] text-xs sm:text-sm cursor-pointer font-semibold rounded-2xl w-[40%] sm:w-[20%] capitalize text-stone-600 transition-all duration-300 ease-in-out hover:bg-[#C47BE4] ${activeTab === tab ? "text-stone-900 shadow-[0px_3px_0px_#b26dcf] bg-[#b26dcf]" : ""
                                    }`}>
                                {tab}
                            </button>
                        ))}
                        <div className="border-b border-black/30 w-[98vw] sm:self-start my-3 relative z-1 left-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === "announcements" && (<AnnouncementTab eventId={event._id} />)}
                        {activeTab === "Lost-Found" && <LostFoundTab eventId={event._id} />}
                        {activeTab === "reports" && <ReportsTab eventId={event._id} />}
                        {activeTab === "SOS" && <p>Emergency/SOS tab coming next…</p>}
                    </div>

                </div>
            </div>
        </>
    );
}
