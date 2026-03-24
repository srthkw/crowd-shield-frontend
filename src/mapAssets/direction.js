export const getBearing = (start, end, smoothHeading) => {
  const lat1 = (start[0] * Math.PI) / 180;
  const lon1 = (start[1] * Math.PI) / 180;
  const lat2 = (end[0] * Math.PI) / 180;
  const lon2 = (end[1] * Math.PI) / 180;

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing =
    ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  return (bearing - smoothHeading + 360) % 360;
};