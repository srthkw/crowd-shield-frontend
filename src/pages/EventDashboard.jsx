import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import AnnouncementTab from "../components/tabs/AnnouncementTab";
import LostFoundTab from "../components/tabs/LostFoundTab";
import { Link } from "react-router-dom";
import Bg from "../components/Bg";
import ReportsTab from "../components/tabs/ReportsTab";

export default function EventDashboard() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("announcements"); // default tab
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await API.get(`/events/${eventId}`);
                setEvent(res.data);
            } catch (err) {
                console.error("Failed to load event", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!event) return <p className="p-4 text-red-500">Event not found</p>;

    return (
        <>
            <Bg />
            <div className="p-4 w-full h-[100vh] mx-auto relative z-1">
                {/* Header */}
                <h1 className="text-2xl font-bold mb-1">{event.name}</h1>
                <h2 className={` ${expanded ? "" : "line-clamp-2"}`} id="description">{event.description}</h2>
                <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Show less" : "Read more"}
                </button>
                <p className="text-gray-200">{event.location} • {new Date(event.date).toLocaleDateString()}</p>

                {/* Mobile View */}
                <div className="sm:hidden"> Meow Meow</div>

                {/* Desktop View */}
                <div className="hidden sm:flex sm:flex-col">
                    {/* Tabs */}
                    <div className="flex gap-4 mt-6 border-b border-gray-600 pb-2">
                        {["announcements", "Lost-Found", "reports", "SOS"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 capitalize ${activeTab === tab ? "border-b-2 border-white font-bold" : "text-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
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
