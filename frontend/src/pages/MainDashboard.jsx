import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import DashboardFooterNav from "../components/DashboardFooterNav";

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const coordinatesLabel = useMemo(() => {
    if (!location) return "Locating...";
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }, [location]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleAlert = async () => {
    if (!location) return;
    setPredicting(true);
    try {
      const { data } = await api.post("/predict-crime", location);
      setResult(data);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <h2>Welcome, {user?.name || "Guardian User"}</h2>
          <p>Live Coordinates: {coordinatesLabel}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <main className="dashboard-main">
        <section className="map-panel">
          {loadingLocation ? <p>Fetching current location...</p> : <MapView location={location} />}
        </section>

        <section className="risk-panel">
          <button className="alert-trigger-btn" onClick={handleAlert} disabled={!location || predicting}>
            {predicting ? "Processing..." : "Send ALERT"}
          </button>
          {result ? (
            <div className="risk-result">
              <p>
                <strong>Crime Risk Score:</strong> {result.crimeRiskScore}
              </p>
              <p>
                <strong>Risk Level:</strong> {result.riskLevel}
              </p>
              <p>
                <strong>Safety Analysis:</strong> {result.analysis}
              </p>
            </div>
          ) : (
            <p className="placeholder-note">
              Press ALERT to send location to backend and retrieve crime risk prediction.
            </p>
          )}
        </section>
      </main>

      <DashboardFooterNav />
    </div>
  );
};

export default MainDashboard;
