const getRiskLevel = (latitude, longitude) => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 21;

  // Very basic heuristic for demo purposes.
  const nearDenseArea = Math.abs(latitude) < 23 && Math.abs(longitude) < 80;

  if (isNight && !nearDenseArea) return "High";
  if (isNight || !nearDenseArea) return "Medium";
  return "Low";
};

module.exports = { getRiskLevel };
