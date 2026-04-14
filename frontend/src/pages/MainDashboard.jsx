import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import DashboardFooterNav from "../components/DashboardFooterNav";
import { useSafetyTracking } from "../hooks/useSafetyTracking";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import RiskVitalSign from "../components/RiskVitalSign";

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  
  // Tracking & Alert State
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const [policeStations, setPoliceStations] = useState([]);
  
  const { path, riskTrend, distance, resetTracking } = useSafetyTracking(isAlertActive || isSosActive);
  
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const coordinatesLabel = useMemo(() => {
    if (!location) return "Locating...";
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }, [location]);

  // Sync current location for tracking
  useEffect(() => {
    if (path.length > 0) {
      setLocation(path[path.length - 1]);
    }
  }, [path]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoadingLocation(false);
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoadingLocation(false);
      },
      () => {
        clearTimeout(timeoutId);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      if (data?.emergencyContacts) {
        setEmergencyContacts(data.emergencyContacts);
      }
    }).catch(err => console.error("Could not fetch profile"));

    const stored = localStorage.getItem("recentEmergencyInteractions");
    if (stored) {
      try {
        setRecentEmergencies(JSON.parse(stored));
      } catch (e) { }
    }
  }, []);

  const handleStartAlert = () => {
    if (!isAlertActive) {
      resetTracking();
      setIsAlertActive(true);
    }
  };

  const handleStopTracking = () => {
    setIsAlertActive(false);
    setIsSosActive(false);
    // useSafetyTracking will automatically clear watchers when its dependency (active) becomes false
  };

  const triggerSOS = async (contact) => {
    try {
      setIsSosActive(true);
      const res = await api.post("/sos/trigger", { 
        latitude: location?.latitude, 
        longitude: location?.longitude 
      });
      
      if (res.data.policeStations) {
        setPoliceStations(res.data.policeStations);
      }

      sendSMSActivity(contact);
    } catch (err) {
      console.error("SOS trigger failed", err);
    }
  };

  const sendSMSActivity = (contact) => {
    const lat = location?.latitude || 0;
    const lng = location?.longitude || 0;
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const message = `Emergency Alert: I need help. My current location is: ${mapUrl}`;
    
    let smsLink;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      smsLink = `sms:${contact.phoneNumber}&body=${encodeURIComponent(message)}`;
    } else {
      smsLink = `sms:${contact.phoneNumber}?body=${encodeURIComponent(message)}`;
    }

    window.location.href = smsLink;

    const newInteraction = { 
      id: Date.now(),
      contactName: contact.contactName, 
      phone: contact.phoneNumber,
      time: new Date().toISOString(), 
      status: "Sent" 
    };

    const updated = [newInteraction, ...recentEmergencies].slice(0, 10);
    setRecentEmergencies(updated);
    localStorage.setItem("recentEmergencyInteractions", JSON.stringify(updated));

    setShowModal(false);
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <h2>Welcome, {user?.name || "Guardian User"}</h2>
          <p>
            {isAlertActive || isSosActive ? (
              <span className="live-pill blinking">LIVE TRACKING ACTIVE</span>
            ) : (
              `Live Coordinates: ${coordinatesLabel}`
            )}
          </p>
        </div>
        <div className="topbar-actions">
          <button 
            className={`alert-toggle-btn ${isAlertActive ? 'active' : ''}`}
            onClick={handleStartAlert}
            disabled={isAlertActive || isSosActive}
          >
            Start Alert
          </button>
          
          <button 
            className="stop-tracking-btn"
            onClick={handleStopTracking}
            disabled={!(isAlertActive || isSosActive)}
          >
            Stop Tracking
          </button>

          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main-split">
        <div className="map-container-left">
          <section className="map-panel">
            {loadingLocation ? (
              <div className="map-loading">Fetching current location...</div>
            ) : (
              <MapView 
                location={location} 
                path={path} 
                policeStations={policeStations}
              />
            )}
          </section>

          {isSosActive && (
             <div className="sos-stats-overlay">
                <div className="stat-item">
                  <label>Distance Since SOS</label>
                  <span>{distance.toFixed(2)} km</span>
                </div>
                <div className="stat-item">
                  <label>Notified</label>
                  <span>{policeStations.length} Police Stations</span>
                </div>
             </div>
          )}

          <button className="sos-overlay-btn" onClick={() => setShowModal(true)}>
            <span>SOS</span>
          </button>
        </div>

        <aside className="sidebar-right">
          <section className="sidebar-panel risk-trend-card">
            <h3>Risk Trend</h3>
            
            {(isAlertActive || isSosActive) && (
              <RiskVitalSign 
                score={riskTrend.length > 0 ? riskTrend[riskTrend.length - 1].score : 0} 
                isActive={true} 
              />
            )}

            <div className="trend-chart-container">
              {riskTrend.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={riskTrend}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#f43f5e' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#f43f5e" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="placeholder-note">Start Alert to see live risk analysis.</p>
              )}
            </div>
            {riskTrend.length > 0 && (
               <div className="last-check-note">
                 Last analysis: <strong>{riskTrend[riskTrend.length-1].place}</strong>
               </div>
            )}
          </section>

          <section className="sidebar-panel">
            <h3>Recent Alerts</h3>
            <div className="emergencies-list">
              {recentEmergencies.length === 0 && (
                <p className="placeholder-note">No recent emergency alerts triggered.</p>
              )}
              {recentEmergencies.map((interaction) => (
                <div key={interaction.id} className="emergency-item">
                  <strong>{interaction.contactName}</strong>
                  <span>{new Date(interaction.time).toLocaleString()}</span>
                  <div className="emergency-status">{interaction.status}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>

      {showModal && (
        <div className="contact-modal-overlay">
          <div className="contact-modal-content">
            <h3>Emergency SOS</h3>
            <p>Select a contact to instantly send an SOS with your live location and notify nearest police stations.</p>
            
            <div className="contact-modal-list">
              {emergencyContacts.length === 0 ? (
                <p className="placeholder-note">No emergency contacts saved. Please add them in your Profile.</p>
              ) : (
                emergencyContacts.map(contact => (
                  <button 
                    key={contact._id} 
                    className="contact-modal-btn"
                    onClick={() => triggerSOS(contact)}
                  >
                    <strong>{contact.contactName}</strong>
                    <span>{contact.phoneNumber}</span>
                  </button>
                ))
              )}
            </div>

            <button className="contact-modal-close" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <DashboardFooterNav />
    </div>
  );
};

export default MainDashboard;
