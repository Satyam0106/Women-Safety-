import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authSideImage from "../assets/auth-section-side.png";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const AuthSection = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (activeTab === "signup" && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "login") {
        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        const { data } = await api.post("/auth/signup", {
          name: form.email.split("@")[0] || "Her Guardian User",
          email: form.email,
          password: form.password,
        });
        login(data.token, data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Make sure backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth" className="auth-section">
      <div className="auth-bg-pattern" />
      <div className="auth-layout">
        <div className="auth-layout__col auth-layout__col--form">
          <div className="auth-card fade-up">
            <div className="auth-tabs">
              <button
                type="button"
                className={activeTab === "login" ? "active" : ""}
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={activeTab === "signup" ? "active" : ""}
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                }}
              >
                Sign Up
              </button>
            </div>

            <div className="auth-panel" key={activeTab}>
              <h2>{activeTab === "login" ? "Welcome Back" : "Join Her Guardian"}</h2>
              <p>
                {activeTab === "login"
                  ? "Log in to access your safety dashboard."
                  : "Create your account and protect your journey."}
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                />

                {activeTab === "signup" && (
                  <>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                    />
                  </>
                )}
                {error ? <p className="auth-error">{error}</p> : null}
                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? "Please wait..." : activeTab === "login" ? "Login Securely" : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="auth-layout__col auth-layout__col--image">
          <div className="auth-image-wrap">
            <img src={authSideImage} alt="" className="auth-side-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
