import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

export default function EmergencyMapPage() {
  const { id } = useParams();

  const [emergency, setEmergency] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  // Fetch emergency
  useEffect(() => {
    const fetchEmergency = async () => {
      const res = await API.get(`/api/emergency/${id}`);
      setEmergency(res.data);
    };

    fetchEmergency();
  }, [id]);

  // Get viewer location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
  
        console.log("📍 My location:", coords);
  
        setMyLocation(coords);
      },
      (err) => {
        console.error("Location error:", err);
      }
    );
  
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!emergency) return <p>Loading...</p>;

  const userPosition = [
    emergency.latitude,
    emergency.longitude,
  ];

  return (
    <MapContainer
      center={userPosition} // 🔥 center on user
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🚨 Emergency User */}
      <Marker position={userPosition} zIndexOffset={1000}>
        <Popup>
          🚨 {emergency.userName}
        </Popup>
      </Marker>

      {/* 🧍 Organizer */}
      {myLocation && (
        <Marker position={myLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}