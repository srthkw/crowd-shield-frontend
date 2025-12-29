import { useRef, useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Bg from "../components/Bg";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      <Bg />
      <div className="p-4 relative z-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="sm:text-4xl text-2xl font-bold">Events</h1>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex items-center gap-4 mr-3">
            {(user.role === "admin" || user.role === "organizer") && (
              <button
                className="glass-btn sm:text-sm text-xs"
                onClick={() => navigate("/events/create")}
              >
                Create an event
              </button>
            )}

            <button onClick={handleLogout} className="text-white font-semibold">
              Logout
            </button>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="text-white text-3xl sm:hidden"
          >
            ☰
          </button>

          {/* MOBILE DROPDOWN MENU */}
          {open && (
            <div ref={menuRef} className="absolute z-10 top-14 right-4 bg-white/30 border-1 border-white/40 backdrop-blur-sm p-4 rounded-xl flex flex-col gap-3 justify-center shadow-lg items-center sm:hidden">
              {(user.role === "admin" || user.role === "organizer") && (
                <button
                  className="text-black/80 bg-white/70 w-full p-2 px-3 rounded-2xl font-semibold"
                  onClick={() => {
                    setOpen(false);
                    navigate("/events/create");
                  }}
                >
                  Create an event
                </button>
              )}

              <button
                  className="text-black/80 bg-white/70 w-full p-2 px-3 rounded-2xl font-semibold"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {loading && <p>Loading...</p>}

        {!loading && events.length === 0 && (
          <p className="text-white/90 display flex justify-center font-bold text-2xl">No events available</p>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event) => (
              <div
                key={event._id}
                className="glass-bg py-6 px-6 text-start flex flex-col border relative rounded shadow cursor-pointer hover:scale-[1.01] transition h-full"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <h2 className="text-2xl font-bold mb-3">{event.name}</h2>
                <p className="text-md font-semibold text-black/80 max-h-18 line-clamp-3 mb-3">{event.description}</p>
                <div className="flex flex-col justify-around items-start mt-auto">
                  <p className="text-md font-semibold text-white truncate">{event.location}</p>
                  <span className="text-md font-semibold text-white">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
