import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function SmoothFollow({ position, autoFollow, setAutoFollow }) {
    const map = useMap();
    const isFirst = useRef(true);
  
    useEffect(() => {
      const handler = () => setAutoFollow(null);
    
      map.on("dragstart", handler);
    
      return () => map.off("dragstart", handler);
    }, [map, setAutoFollow]);
  
    useEffect(() => {
      if (!position || !autoFollow) return;
  
      if (isFirst.current) {
        map.setView(position, 16);
        isFirst.current = false;
      } else {
        map.flyTo(position, map.getZoom(), {
          duration: 1.5,
        });
      }
    }, [position, autoFollow]);
  
    return null;
  }