import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { FiSearch, FiMapPin, FiCalendar, FiInfo, FiX } from 'react-icons/fi';
import Loader from "../components/Loader";
import { roleGradientsBG, roleGradients } from "../constants/roleGradient";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(null);
  const [regEvent, setRegEvent] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const registerEvent = async (eventId) => {
    setLoader("reg");
    if (!eventId) return;
    try {
      await API.post("/auth/register-event", { eventId });

      localStorage.setItem("eventRegistered", eventId);

      setUser(prev => prev ? {
        ...prev,
        eventRegistered: eventId
      } : prev);

      console.log({
        eventId,
        eventIdType: typeof eventId,
      });

      navigate(`/event/${eventId}`);

    } catch (err) {
      console.error("Failed to register event", err);
    } finally {
      setLoader(null);
    }

  };

  // Add to your component's state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEvents = filteredEvents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // 1. Sort by event date (ascending)
    if (dateA - dateB !== 0) {
      return dateA - dateB;
    }

    // 2. If same date → sort by createdAt (descending)
    const createdA = new Date(a.createdAt);
    const createdB = new Date(b.createdAt);

    return createdB - createdA;
  });

  const deleteEvent = async (eventId) => {
    try {
      const res = await API.delete(`/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      alert(res.data.message);
    } catch (err) {
      console.error("Failed to delete event", err);
      alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
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
      <div className={`min-h-screen bg-gradient-to-br ${roleGradientsBG[user.role] || ''}`}>
        {/* Background decorative element */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />
        <Navbar />

        <div className="p-2">
          {/* Header Section */}
          <div className="relative z-10 mb-8 mt-3 md:mb-12">
            <div className="flex flex-col items-center text-center">
              <h1 className={`text-2xl md:text-5xl font-bold bg-gradient-to-r ${roleGradients[user.role] || ''} text-transparent bg-clip-text mb-3`}>
                Events
              </h1>

              {/* Search Bar */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-white rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
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
                {sortedEvents.map((event) => (
                  <div
                    key={event._id}
                    className={`group bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-3 ${user.id === event.createdBy ? 'border-green-400/70' : 'border-gray-300/70'} cursor-pointer relative`}
                    onClick={() => {
                      if (user.eventRegistered == event._id) {
                        navigate(`/event/${event._id}`);
                      } else {
                        console.log(event._id);
                        setRegEvent(event._id);
                      }
                    }
                    }
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
                        className={`w-full py-2 bg-gradient-to-r text-sm ${roleGradients[user.role]} text-white font-medium rounded-xl hover:opacity-90 transition-opacity group-hover:shadow-lg cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.eventRegistered == event._id) {
                            navigate(`/event/${event._id}`);
                          } else {
                            setRegEvent(event._id);
                          }
                        }}
                      >
                        Open Event Dashboard
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
                <div className="sm:p-6 p-2 border-t border-gray-100 flex flex-row sm:flex-row gap-2 justify-center">
                  <button
                    className="sm:px-6 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                    onClick={() => {
                      if (user.eventRegistered == selectedEvent._id) {
                        navigate(`/event/${selectedEvent._id}`);
                      } else {
                        setRegEvent(selectedEvent._id);
                      }
                    }}
                  >
                    Open Dashboard
                  </button>

                  {(user.id === selectedEvent.createdBy || user.role === 'admin') && (
                    <button onClick={() => {
                      deleteEvent(selectedEvent._id);
                      setSelectedEvent(null);
                    }}
                      className="sm:px-6 px-3 py-2 bg-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Delete Event
                    </button>)}

                </div>
              </div>
            </div>
          )}

        </div>
        {regEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-500 bg-black/30 backdrop-blur-sm">
            <div className="bg-white w-[400px] max-w-[90%] rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-200 animate-in fade-in zoom-in-95">
              <h1 className="text-xl font-bold text-gray-900 mb-3 bg-gray-200 px-6 py-4 rounded-t-2xl">
                Register for the Event
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed px-6">
                You must register to access the event dashboard. Your details like name, email, and phone number will be used for registration. Click OK to proceed.
              </p>
              <div className="flex justify-end gap-3 px-6 py-2 border-t border-gray-100">
                <button
                  className="px-5 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegEvent(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loader === "reg"}
                  className={`px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow`}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(regEvent);
                    registerEvent(regEvent);
                  }}
                >
                  {loader === "reg" ? "Registering..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
