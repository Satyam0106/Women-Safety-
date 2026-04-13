const RiskBadge = ({ level }) => {
  const safeLevel = level || "Low";
  return <span className={`risk risk-${safeLevel.toLowerCase()}`}>Risk: {safeLevel}</span>;
};

export default RiskBadge;
