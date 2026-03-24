import { useEffect, useState, useRef } from "react";
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
import { redIcon, createArrowIcon } from "../mapAssets/mapIcons";

export default function EmergencyMapPage() {
  const { id } = useParams();

  const [autoFollow, setAutoFollow] = useState(true);
  const [emergency, setEmergency] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  const [heading, setHeading] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);
  const [rotation, setRotation] = useState(0);

  const arrowRef = useRef(null);

  // ✅ Fetch emergency
  useEffect(() => {
    const fetchEmergency = async () => {
      const res = await API.get(`/api/emergency/${id}`);
      setEmergency(res.data);
    };

    fetchEmergency();
  }, [id]);

  // ✅ Watch user location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setMyLocation(coords);
      },
      (err) => {
        console.error("Location error:", err);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ✅ Device orientation (compass)
  useEffect(() => {
    function handleOrientation(event) {
      let alpha = event.alpha;

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

  // ✅ Smooth heading (with wrap fix)
  useEffect(() => {
    setSmoothHeading((prev) => {
      let diff = heading - prev;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      return prev + diff * 0.1;
    });
  }, [heading]);

  // ✅ Safe user position
  const userPosition = emergency
    ? [emergency.latitude, emergency.longitude]
    : null;

  // ✅ Calculate relative direction
  const relativeDirection =
    myLocation && userPosition
      ? getBearing(myLocation, userPosition, smoothHeading)
      : 0;

  // ✅ Smooth rotation (shortest path)
  useEffect(() => {
    setRotation((prev) => {
      let target = relativeDirection - 90; // arrow offset fix
      let diff = target - prev;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      return prev + diff;
    });
  }, [relativeDirection]);

  // ✅ Apply rotation to arrow DOM
  useEffect(() => {
    if (!arrowRef.current) return;

    const el = arrowRef.current.getElement();
    if (!el) return;

    const arrow = el.querySelector(".arrow-inner");

    if (arrow) {
      arrow.style.transform = `rotate(${rotation}deg)`;
      arrow.style.transition = "transform 0.2s linear";
    }
  }, [rotation]);

  if (!emergency) return <p>Loading...</p>;

  return (
    <MapContainer
      center={userPosition}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Follow target */}
      <SmoothFollow
        position={userPosition}
        autoFollow={autoFollow}
        setAutoFollow={setAutoFollow}
      />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🚨 Emergency User */}
      <Marker position={userPosition} zIndexOffset={1000} icon={redIcon}>
        <Popup>{emergency.userName}</Popup>
      </Marker>

      {/* 🧍 You (with compass arrow) */}
      {myLocation && (
        <Marker
          position={myLocation}
          zIndexOffset={500}
          icon={createArrowIcon()}
          ref={arrowRef}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* UI Buttons */}
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