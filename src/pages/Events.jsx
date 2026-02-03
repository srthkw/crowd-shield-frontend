import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { FiSearch, FiMapPin, FiCalendar, FiInfo, FiX } from 'react-icons/fi';
import Loader from "../components/Loader";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  // Add to your component's state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      alert("Event deleted successfully");
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Failed to delete event");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        console.log("API events →", res.data);
        setEvents(res.data);

      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50">
        {/* Background decorative element */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />

        <Navbar />

        <div className="p-2">
        {/* Header Section */}
        <div className="relative z-10 mb-8 mt-3 md:mb-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-600 mb-3">
              Events
            </h1>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Showing {filteredEvents.length} of {events.length} events
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              {searchQuery ? (
                <FiSearch className="w-12 h-12 text-gray-400" />
              ) : (
                <FiCalendar className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No Matching Events Found' : 'No Events Available'}
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchQuery
                ? `No events found for "${searchQuery}". Try a different search term.`
                : 'There are no events scheduled at the moment. Check back later!'}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 cursor-pointer relative"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  {/* Info Button - Positioned properly on all cards */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all cursor-pointer z-10 shadow-sm hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                  >
                    <FiInfo className="w-5 h-5" />
                  </button>

                  {/* Event Header */}
                  <div className="p-6 pb-4 flex flex-col justify-between min-h-[165px]">
                    <div className="mb-4">
                      <h2 className="text-md font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 pr-10">
                        {event.name}
                      </h2>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />
                        <span className="text-sm line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar className="w-4 h-4 flex-shrink-0 text-purple-500" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Footer */}
                  <div className="p-4 pt-0">
                    <button
                      className="w-full py-2 bg-gradient-to-r text-sm from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity group-hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/event/${event._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-fadeIn"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full sm:max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex-1 min-w-0 pr-10">
                  {/* Fixed: Title now wraps properly */}
                  <h3 className="text-md md:text-2xl font-bold text-gray-800 break-words whitespace-normal">
                    {selectedEvent.name}
                  </h3>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer flex-shrink-0 absolute top-4 right-4"
                  onClick={() => setSelectedEvent(null)}
                >
                  <FiX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div className=" text-sm sm:text-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <FiInfo className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg">Event Description</h4>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                        {selectedEvent.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-sm sm:text-md">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <FiMapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-gray-600 font-medium break-words">{selectedEvent.location}</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-sm sm:text-md">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <FiCalendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Event Date</span>
                      </div>
                      <p className="text-gray-600 font-medium">
                        {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
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

              {/* Modal Footer */}
              <div className="sm:p-6 p-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-between">
                <button
                  className="sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/event/${selectedEvent._id}`);
                  }}
                >
                  View Full Event Details
                </button>
                
                { (user._id === selectedEvent.createdBy || user.role === 'admin') && (
                <button onClick={() => {
                  deleteEvent(selectedEvent._id);
                  setSelectedEvent(null);
                }}
                  className="sm:px-6 py-2 bg-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  Delete Event
                </button>)}
                
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
