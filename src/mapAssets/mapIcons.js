import L from "leaflet";

export const redIcon = new L.Icon({
  iconUrl: "https://pngimg.com/uploads/google_maps_pin/google_maps_pin_PNG76.png",
  iconSize: [32, 32],
});


export const createArrowIcon = () =>
  L.divIcon({
    className: "custom-arrow text-3xl text-blue-700",
    html: `<div class="arrow-inner">⏏</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });