import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function SmoothFollow({ position, autoFollow, setAutoFollow }) {
    const map = useMap();
    const isFirst = useRef(true);
  
    useEffect(() => {
      map.on("dragstart", () => {
        setAutoFollow(false);
      });
  
      return () => map.off("dragstart");
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