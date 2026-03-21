import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function EmergencyButton() {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false); // 👈 add this

    useEffect(() => {
      const runCycle = () => {
        setExpanded(true);
        const shrinkTimer = setTimeout(() => {
          setExpanded(false);
        }, 3000);
        return shrinkTimer;
      };

      let shrinkTimer;
      const startTimer = setTimeout(() => {
        shrinkTimer = runCycle();
      }, 1000);

      const interval = setInterval(() => {
        shrinkTimer = runCycle();
      }, 10000);

      return () => {
        clearTimeout(startTimer);
        clearInterval(interval);
        clearTimeout(shrinkTimer);
      };
    }, []);

  const isExpanded = expanded || hovered; // 👈 add this

  return (
    <button
      onMouseEnter={() => setHovered(true)}  // 👈 add this
      onMouseLeave={() => setHovered(false)} // 👈 add this
      className={`
        fixed bottom-6 right-6 md:bottom-8 md:right-8
        flex items-center justify-center
        rounded-full text-white font-bold text-sm shadow-lg
        bg-red-600 overflow-hidden whitespace-nowrap
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 z-50 cursor-pointer
        ${isExpanded ? "w-44 h-14 px-3" : "w-14 h-14 px-0 animate-pulse"} // 👈 use isExpanded
      `}
    >
      <FiAlertTriangle className="text-2xl flex-shrink-0" />
      <span
        className={`
          overflow-hidden transition-all duration-500
          ${isExpanded ? "max-w-xs opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"} // 👈 use isExpanded
        `}
      >
        Emergency
      </span>
    </button>
  );
}