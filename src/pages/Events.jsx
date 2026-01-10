import { useRef, useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Bg from "../components/Bg";
import Navbar from "../components/Navbar";
import { FiXCircle, FiInfo, FiMapPin, FiCalendar } from "react-icons/fi";
import Loader from "../components/Loader";

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
      <div className="w-full h-full z-30 sm:visible invisible"><Bg /></div>
      <div className="p-0 relative z-0 bg-gradient-to-b from-[#D18EAD] to-[#F8E2CF] sm:bg-none">

        <Navbar className=""/>

        <div className="flex justify-between items-center my-2">
          <h1 className="sm:text-4xl px-3 text-2xl font-bold">Events</h1>
        </div>

        <div className="border-b border-black/30 w-[90vw] sm:w-[95vw] my-2 relative z-1 left-1/2 -translate-x-1/2"></div>

        {loading && <div className="flex justify-center h-screen" ><div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" /></div>}

        {!loading && events.length === 0 && (
          <p className="text-white/90 p-3 flex justify-center font-bold text-2xl">No events available</p>
        )}

        {!loading && events.length > 0 && (
          <div className="p-2 w-[99vw] sm:w-[91vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white/70 glass-bg text-black/80 border-none py-4 px-6 text-start flex flex-col relative border rounded shadow cursor-pointer hover:scale-[1.01] transition h-"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <div className="w-[93%] h-[50%]">
                <h2 className="h-12 text-md font-semibold mb-5 line-clamp-2 text-ellipsis text-black/70">{event.name}</h2>
                </div>
                <div className="border-b border-black/20 w-full my-2"></div>

                {/* description button */}
                <button className="absolute top-2 right-1 p-1 text-xs font-medium text-black/70 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  const card = document.getElementById(`event-desc-${event._id}`);
                  card.classList.toggle("hidden");

                }}>
                  <FiInfo className="text-2xl m-1" />
                </button>

                <div id={`event-desc-${event._id}`} className="bg-[#fef2f2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[150%] w-full h-full p-2 hidden rounded shadow flex gap-2 cursor-default" onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  <button className="absolute text-black top-4 right-3 z-10 cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    const card = document.getElementById(`event-desc-${event._id}`);
                    card.classList.toggle("hidden");
                  }}>
                    <FiXCircle className="text-2xl " />
                  </button>
                  <div className="overflow-y-auto scrollbar-thin [scrollbar-color:rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-black/50">
                  <p className="text-sm font-semibold text-black/80 mt-0 ml-5 w-[80%] mb-5 italic">{event.name}</p>
                    <p className="text-sm font-semibold text-black/80 mt-0 ml-5 mb-5 w-[80%]"><p className="font-bold flex items-center gap-1"><FiMapPin/> At:</p>{event.location}</p>
                    <p className="text-sm font-semibold text-black/80 mt-0 ml-5 w-[80%]"><p className="font-bold flex items-center gap-1"><FiInfo/> Event Description:</p> {event.description}</p>
                  </div>
                </div>
                {/* ------------ */}

                <div className="flex flex-col gap-1 mt-auto text-sm font-normal">
                  <div className=" flex gap-1.5 items-center"><FiMapPin className="text-md"/><span className="line-clamp-1 w-full">{event.location}</span></div>
                  <span className=" truncate flex gap-1.5 items-center"><FiCalendar />
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
