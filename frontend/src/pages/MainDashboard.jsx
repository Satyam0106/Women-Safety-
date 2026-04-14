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
  
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [recentEmergencies, setRecentEmergencies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const coordinatesLabel = useMemo(() => {
    if (!location) return "Locating...";
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }, [location]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    // Set a timeout to stop waiting for GPS after 8 seconds
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
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Load contacts from profile
    api.get("/profile").then(({ data }) => {
      if (data?.emergencyContacts) {
        setEmergencyContacts(data.emergencyContacts);
      }
    }).catch(err => console.error("Could not fetch profile"));

    // Load recent emergencies from local storage
    const stored = localStorage.getItem("recentEmergencyInteractions");
    if (stored) {
      try {
        setRecentEmergencies(JSON.parse(stored));
      } catch (e) { }
    }
  }, []);

  const sendSMSActivity = (contact) => {
    const lat = location?.latitude || 0;
    const lng = location?.longitude || 0;
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const message = `Emergency Alert: I need help. My current location is: ${mapUrl}`;
    
    // Create native SMS trigger link
    let smsLink;
    // Basic heuristics for iOS vs Android, fallback to standard
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      smsLink = `sms:${contact.phoneNumber}&body=${encodeURIComponent(message)}`;
    } else {
      smsLink = `sms:${contact.phoneNumber}?body=${encodeURIComponent(message)}`;
    }

    window.location.href = smsLink;

    // Save interaction
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
          <p>Live Coordinates: {coordinatesLabel}</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <main className="dashboard-main-split">
        <div className="map-container-left">
          <section className="map-panel">
            {loadingLocation ? <p>Fetching current location...</p> : <MapView location={location} />}
          </section>

          <button className="sos-overlay-btn" onClick={() => setShowModal(true)}>
            <span>SOS</span>
          </button>
        </div>

        <aside className="sidebar-right">
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

      {/* SOS Contact Selection Modal */}
      {showModal && (
        <div className="contact-modal-overlay">
          <div className="contact-modal-content">
            <h3>Emergency SOS</h3>
            <p>Select a contact to instantly send an SMS with your live location.</p>
            
            <div className="contact-modal-list">
              {emergencyContacts.length === 0 ? (
                <p className="placeholder-note">No emergency contacts saved. Please add them in your Profile.</p>
              ) : (
                emergencyContacts.map(contact => (
                  <button 
                    key={contact._id} 
                    className="contact-modal-btn"
                    onClick={() => sendSMSActivity(contact)}
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
