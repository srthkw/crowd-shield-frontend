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
import useEmergencySocket from "../hooks/useEmergencySocket";

export default function EmergencyMapPage() {
  const { id } = useParams();

  const [followTarget, setFollowTarget] = useState("user");
  const [myLocation, setMyLocation] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [heading, setHeading] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);
  const [rotation, setRotation] = useState(0);
  const arrowRef = useRef(null);
  const prevLocationRef = useRef(null);
  const emergency = useEmergencySocket(id);
  const [forceCenter, setForceCenter] = useState(false);

  const getDistance = (a, b) => {
    const R = 6371e3;
    const φ1 = a[0] * Math.PI / 180;
    const φ2 = b[0] * Math.PI / 180;
    const Δφ = (b[0] - a[0]) * Math.PI / 180;
    const Δλ = (b[1] - a[1]) * Math.PI / 180;

    const x = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  // ✅ Watch user location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        // ✅ If moving → use movement direction
        const speed = pos.coords.speed;

        if (speed && speed > 1 && prevLocationRef.current) {
          const movementHeading = getBearing(
            prevLocationRef.current,
            coords,
            0
          );

          setHeading(movementHeading);
          setIsMoving(true); // ✅ IMPORTANT
        } else {
          setIsMoving(false); // ✅ fallback mode
        }


        if (!prevLocationRef.current) {
          setMyLocation(coords);
        } else {
          const dist = getDistance(prevLocationRef.current, coords);

          if (dist > 5) { // 👈 5 meters threshold
            setMyLocation(coords);
            // store for next calculation
            prevLocationRef.current = coords;
          }
        }
      },
      (err) => {
        console.error("Location error:", err);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ✅ Device orientation (compass)
  useEffect(() => {

    let lastUpdate = 0;

    function handleOrientation(event) {
      if (isMoving) return; // 🚨 THIS IS THE KEY FIX

      const now = Date.now();
      if (now - lastUpdate < 100) return;
      lastUpdate = now;

      let alpha = event.alpha;

      if (event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
      }

      if (alpha === null) return;

      alpha = (alpha + 360) % 360;

      setHeading(alpha);
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isMoving]);

  // ✅ Smooth heading (with wrap fix)
  useEffect(() => {
    setSmoothHeading(prev => {
      let diff = heading - prev;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      if (Math.abs(diff) < 2) return prev;

      return prev + diff * 0.25;
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
    setRotation(prev => {
      let target = relativeDirection - 80; // Arrow points down by default
      let diff = target - prev;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      if (Math.abs(diff) < 2) return prev;
      return prev + diff * 0.25;
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
      arrow.style.transition = "none";
    }
  }, [rotation]);

  const arrowIcon = useRef(createArrowIcon()).current;

  if (!emergency) return <p>Loading...</p>;


  return (
    <MapContainer
      center={userPosition}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Follow target */}
      <SmoothFollow
        position={
          followTarget === "user"
            ? userPosition
            : followTarget === "me"
              ? myLocation
              : null
        }
        autoFollow={!!followTarget}
        setAutoFollow={() => setFollowTarget(null)}
        forceCenter={forceCenter}
        setForceCenter={() => setForceCenter(false)}
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
          icon={arrowIcon}
          ref={arrowRef}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* UI Buttons */}
      <span onClick={() => {
        setForceCenter(true);
        setFollowTarget("user");
      }} className="absolute top-3 right-3 z-[1000]">
        <RecenterButton
          text={"Center User"}
          position={userPosition}
        />
      </span>

      <span onClick={() => {
        setForceCenter(true);
        setFollowTarget("me");
      }} className="absolute top-15 right-3 z-[1000]">
        <RecenterButton
          text={"Center Me"}
          position={myLocation}
        />
      </span>
    </MapContainer>
  );
}