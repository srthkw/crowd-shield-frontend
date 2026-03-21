import { useEffect, useState } from "react";
import socket from "../../socket";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function EmergencyResponse({ eventId }) {
  const [emergencies, setEmergencies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const res = await API.get(
          `/api/emergency/active/${eventId}`
        );

        setEmergencies(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmergencies();
  }, [eventId]);

  useEffect(() => {
    const handler = (data) => {

      setEmergencies((prev) => {
        const exists = prev.find(
          (e) => e.user?.toString() === data.user?.toString()
        );

        if (exists) {
          return prev.map((e) =>
            e.user?.toString() === data.user?.toString() ? data : e
          );
        } else {
          return [...prev, data];
        }
      });
    };

    socket.on("emergency-alert", handler);

    return () => {
      socket.off("emergency-alert", handler);
    };
  }, []);

  return (
    <div className={`text-black`}>
      <h2>🚨 Emergencies</h2>

      {emergencies.length === 0 ? (
        <p>No emergencies yet...</p>
      ) : (
        emergencies.map((e) => (
          <div
            key={e._id}
            onClick={() => navigate(`/map/${e._id}`)}
            style={{ cursor: "pointer", border: "1px solid red", margin: 10 }}
          >
            <p><strong>{e.userName}</strong></p>
            <p>{e.userPhone}</p>
            <p>
              Updated:{" "}
              {e.lastUpdated
                ? new Date(e.lastUpdated).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}