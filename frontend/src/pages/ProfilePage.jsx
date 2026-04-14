import { useEffect, useState } from "react";
import api from "../api/client";
import DashboardFooterNav from "../components/DashboardFooterNav";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", age: "", address: "", bio: "" });
  const [contactForm, setContactForm] = useState({ contactName: "", phoneNumber: "", email: "" });
  const [trustedForm, setTrustedForm] = useState({
    memberName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
  });

  const loadProfile = async () => {
    const { data } = await api.get("/profile");
    setProfile(data);
    setForm({
      name: data.user?.name || "",
      phone: data.user?.phone || "",
      age: data.user?.profileInfo?.age || "",
      address: data.user?.profileInfo?.address || "",
      bio: data.user?.profileInfo?.bio || "",
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    await api.put("/profile/update", {
      name: form.name,
      phone: form.phone,
      profileInfo: { age: Number(form.age) || undefined, address: form.address, bio: form.bio },
    });
    loadProfile();
  };

  const addContact = async (e) => {
    e.preventDefault();
    await api.post("/profile/contacts", contactForm);
    setContactForm({ contactName: "", phoneNumber: "", email: "" });
    loadProfile();
  };

  const addTrustedMember = async (e) => {
    e.preventDefault();
    await api.post("/profile/trusted-circle", trustedForm);
    setTrustedForm({ memberName: "", relationship: "", phoneNumber: "", email: "" });
    loadProfile();
  };

  if (!profile) return <div className="dashboard-shell">Loading profile...</div>;

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <h2>User Profile</h2>
          <p>Manage your profile, emergency contacts, and trusted circle</p>
        </div>
      </header>

      <main className="dashboard-main profile-layout">
        <section className="card-like">
          <h3>Update Profile</h3>
          <form className="grid-form" onSubmit={saveProfile}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <input
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            />
            <textarea
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
            <button type="submit">Save Profile</button>
          </form>
        </section>

        <section className="card-like">
          <h3>Emergency Contacts</h3>
          <form className="grid-form" onSubmit={addContact}>
            <input
              placeholder="Contact Name"
              value={contactForm.contactName}
              onChange={(e) => setContactForm((prev) => ({ ...prev, contactName: e.target.value }))}
              required
            />
            <input
              placeholder="Phone Number"
              value={contactForm.phoneNumber}
              onChange={(e) => setContactForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
            <input
              placeholder="Email"
              value={contactForm.email}
              onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <button type="submit">Add Contact</button>
          </form>
          {profile.emergencyContacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <strong>{contact.contactName}</strong>
              <span>{contact.phoneNumber}</span>
            </div>
          ))}
        </section>

        <section className="card-like">
          <h3>Trusted Circle</h3>
          <form className="grid-form" onSubmit={addTrustedMember}>
            <input
              placeholder="Member Name"
              value={trustedForm.memberName}
              onChange={(e) => setTrustedForm((prev) => ({ ...prev, memberName: e.target.value }))}
              required
            />
            <input
              placeholder="Relationship"
              value={trustedForm.relationship}
              onChange={(e) =>
                setTrustedForm((prev) => ({ ...prev, relationship: e.target.value }))
              }
            />
            <input
              placeholder="Phone Number"
              value={trustedForm.phoneNumber}
              onChange={(e) => setTrustedForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
            <button type="submit">Add Member</button>
          </form>
          {profile.trustedCircle.map((member) => (
            <div key={member._id} className="contact-card">
              <strong>{member.memberName} ({member.relationship || "Trusted"})</strong>
              <span>{member.phoneNumber}</span>
            </div>
          ))}
        </section>
      </main>

      <DashboardFooterNav />
    </div>
  );
};

export default ProfilePage;
