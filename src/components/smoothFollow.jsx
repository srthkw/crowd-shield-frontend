import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function SmoothFollow({ position, autoFollow, setAutoFollow, forceCenter, setForceCenter }) {
    const map = useMap();

    useEffect(() => {
      if (!position) return;
    
      if (forceCenter) {
        map.setView(position, 16);
        setForceCenter(false);
        return;
      }
    
      if (!autoFollow) return;
    
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
    }, [map, position, autoFollow, forceCenter, setForceCenter]);
  
    useEffect(() => {
      const handler = () => setAutoFollow(null);
    
      map.on("dragstart", handler);
    
      return () => map.off("dragstart", handler);
    }, [map, setAutoFollow]);

    const lastPos = useRef(null);

    useEffect(() => {
      if (!position || !autoFollow) return;
    
      if (!lastPos.current) {
        map.setView(position, 16);
        lastPos.current = position;
        return;
      }
    
      const getDistance = (a, b) => {
        const R = 6371e3;
        const φ1 = a[0] * Math.PI/180;
        const φ2 = b[0] * Math.PI/180;
        const Δφ = (b[0]-a[0]) * Math.PI/180;
        const Δλ = (b[1]-a[1]) * Math.PI/180;
    
        const x = Math.sin(Δφ/2)**2 +
                  Math.cos(φ1)*Math.cos(φ2) *
                  Math.sin(Δλ/2)**2;
    
        return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
      };
    
      const dist = getDistance(lastPos.current, position);
    
      if (dist < 5) return; // 🚫 ignore tiny movement
    
      map.flyTo(position, map.getZoom(), { animate: true, duration: 1.5 });
    
      lastPos.current = position;
    }, [position, autoFollow]);
  
    return null;
  }