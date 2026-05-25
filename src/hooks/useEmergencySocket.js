import { useEffect, useState } from "react";
import socket, { connectSocket } from "../socket";
import API from "../api/axios";

export default function useEmergencySocket(id) {
  const [emergency, setEmergency] = useState(null);

  // 1. Initial fetch
  useEffect(() => {
    const fetchEmergency = async () => {
      try {
        const res = await API.get(`/emergency/${id}`);
        setEmergency(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmergency();
  }, [id]);

  // 2. Socket listener
  useEffect(() => {
    connectSocket();

    const handler = (data) => {
      // Ensure the update is for the current emergency
      if (data._id === id) {
        setEmergency(data);
      }
    };

    socket.on("emergency-alert", handler);

    return () => {
      socket.off("emergency-alert", handler);
    };
  }, [id]);

  return emergency;
}
