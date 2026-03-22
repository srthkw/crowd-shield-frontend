import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import SmoothFollow from "../components/smoothFollow";
import RecenterButton from "../components/buttons/RecenterButton";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { getBearing } from "../mapAssets/direction";
import { redIcon, createArrowIcon } from "../mapAssets/mapIcons"; // Fixes marker icons

export default function EmergencyMapPage() {
  const { id } = useParams();
  const [autoFollow, setAutoFollow] = useState(true);
  const [emergency, setEmergency] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);

  useEffect(() => {
    setSmoothHeading(prev => prev + (heading - prev) * 0.1);
  }, [heading]);

  useEffect(() => {
    function handleOrientation(event) {
      let alpha = event.alpha;

      // iOS fix
      if (event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
      }

      if (alpha !== null) {
        setHeading(alpha);
      }
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

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
      {/* Smoothly follow user */}
      <SmoothFollow
        position={userPosition}
        autoFollow={autoFollow}
        setAutoFollow={setAutoFollow}
      />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🚨 Emergency User */}
      <Marker position={userPosition} zIndexOffset={1000} icon={redIcon}>
        <Popup>
          🚨 {emergency.userName}
        </Popup>
      </Marker>

      {/* 🧍 Organizer */}
      {myLocation && userPosition && (
        <Marker position={myLocation} zIndexOffset={500} icon={createArrowIcon(getBearing(myLocation, userPosition, smoothHeading) - 90)}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      <span className="absolute top-3 right-3 z-[1000]">
        <RecenterButton
          text={"Center User"}
          position={userPosition}
          setAutoFollow={setAutoFollow}
        />
      </span>

      <span className="absolute top-15 right-3 z-[1000]">
        <RecenterButton
        text={"Center Me"}
          position={myLocation}
          setAutoFollow={setAutoFollow}
        />
      </span>

    </MapContainer>
  );
}