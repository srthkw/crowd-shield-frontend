import { useMap } from "react-leaflet";
import { FiCrosshair } from "react-icons/fi";

export default function RecenterButton({ position, setAutoFollow, text }) {
  const map = useMap();

  return (
    <button
  onClick={() => {
    setAutoFollow(true);
    map.flyTo(position, 16, { duration: 1.5 });
  }}
  className="
    px-4 py-2
    bg-white/90 backdrop-blur
    border border-gray-300
    rounded-lg shadow-md
    text-sm text-black font-medium
    flex items-center gap-2
    hover:bg-white hover:shadow-lg
    active:scale-95
    transition-all duration-200
  "
>
  <span className="text-xl"><FiCrosshair /></span>
  {text}
</button>
  );
}