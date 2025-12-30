import { useRef, useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Bg from "../components/Bg";
import Navbar from "../components/Navbar";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="p-0 relative z-0">

        <Navbar />

        <div className="flex justify-between items-center mb-4">
          <h1 className="sm:text-4xl px-3 text-2xl font-bold">Events</h1>
        </div>


        {loading && <p className="px-4" >Loading...</p>}

        {!loading && events.length === 0 && (
          <p className="text-white/90 p-3 flex justify-center font-bold text-2xl">No events available</p>
        )}

        {!loading && events.length > 0 && (
          <div className="p-2 w-[99vw] sm:w-[91vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event) => (
              <div
                key={event._id}
                className="glass-bg py-6 px-6 text-start flex flex-col border rounded shadow cursor-pointer hover:scale-[1.01] transition h-full"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <h2 className="text-md font-bold mb-3">{event.name}</h2>

                {/* description button */}
                <button className="absolute top-0 right-0 p-1 text-xs font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:outline-none" onClick={(e) => {
                  e.stopPropagation();
                  const card = document.getElementById(`event-desc-${event._id}`);
                  card.classList.toggle("hidden");

                }}>
                  <i className="fa fa-info-circle">View more</i>
                </button>

                <div id={`event-desc-${event._id}`} className="bg-white/90 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-2 hidden rounded shadow overflow-y-auto" onClick={(e) => {
                  e.stopPropagation();
                }}>
                <button className="text-black fixed top-1 z-10" onClick={(e) => {
                  e.stopPropagation();
                  const card = document.getElementById(`event-desc-${event._id}`);
                  card.classList.toggle("hidden");}}>
                  X
                </button>
                  <div>
                    <p className="text-sm text-black mt-0 ml-5">{event.description}</p>
                  </div>
                </div>
                {/* ------------ */}

                <div className="grid grid-cols-[repeat(2,1fr)] grid-rows-[1fr] gap-3 mt-auto">
                  <span className="text-xs font-semibold text-white truncate">{event.location}</span>
                  <span className="text-xs font-semibold text-white">
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
