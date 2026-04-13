import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import SOSButton from "../components/SOSButton";
import RiskBadge from "../components/RiskBadge";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [riskLevel, setRiskLevel] = useState("Low");
  const [status, setStatus] = useState("Safe");
  const [sosLoading, setSosLoading] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" });

  const fetchContacts = async () => {
    const { data } = await api.get("/contacts");
    setContacts(data);
  };

  const fetchIncidents = async () => {
    const { data } = await api.get("/sos/incidents");
    setIncidents(data);
  };

  useEffect(() => {
    fetchContacts();
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {}
    );
  }, []);

  const addContact = async (e) => {
    e.preventDefault();
    await api.post("/contacts", contactForm);
    setContactForm({ name: "", phone: "", email: "" });
    fetchContacts();
  };

  const deleteContact = async (id) => {
    await api.delete(`/contacts/${id}`);
    fetchContacts();
  };

  const editContact = async (contact) => {
    const name = window.prompt("Contact name", contact.name) ?? contact.name;
    const phone = window.prompt("Contact phone", contact.phone || "") ?? contact.phone;
    const email = window.prompt("Contact email", contact.email || "") ?? contact.email;
    await api.put(`/contacts/${contact._id}`, { name, phone, email });
    fetchContacts();
  };

  const triggerSOS = async () => {
    if (!location) return alert("Location unavailable. Enable GPS and try again.");
    setSosLoading(true);
    try {
      const { data } = await api.post("/sos/trigger", location);
      setStatus("Emergency Alert Sent");
      setRiskLevel(data.riskLevel);
      fetchIncidents();
      alert(`SOS sent. Contacts notified: ${data.notifiedContacts.length}`);
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="page dashboard">
      <header className="card dashboard-header">
        <div>
          <h2>Hi, {user?.name}</h2>
          <p className="muted">Safety status: {status}</p>
        </div>
        <div className="header-actions">
          <RiskBadge level={riskLevel} />
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="card">
        <h3>Emergency SOS</h3>
        <SOSButton onClick={triggerSOS} loading={sosLoading} />
      </section>

      <section className="card">
        <h3>Real-time Location</h3>
        <MapView location={location} />
      </section>

      <section className="card">
        <h3>Emergency Contacts</h3>
        <form className="form-inline" onSubmit={addContact}>
          <input
            placeholder="Name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={contactForm.phone}
            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
          />
          <input
            placeholder="Email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
        {contacts.map((contact) => (
          <div key={contact._id} className="list-row">
            <span>
              {contact.name} | {contact.phone || contact.email}
            </span>
            <div className="row-actions">
              <button onClick={() => editContact(contact)}>Edit</button>
              <button onClick={() => deleteContact(contact._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Incident History</h3>
        {incidents.length === 0 && <p className="muted">No incidents yet.</p>}
        {incidents.map((incident) => (
          <div key={incident._id} className="incident-item">
            <strong>{incident.riskLevel}</strong> - {new Date(incident.createdAt).toLocaleString()}
            <div className="muted">
              Lat: {incident.location.latitude}, Lng: {incident.location.longitude}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
