const SOSButton = ({ onClick, loading }) => (
  <button className="sos-button" onClick={onClick} disabled={loading}>
    {loading ? "Sending..." : "SOS"}
  </button>
);

export default SOSButton;
