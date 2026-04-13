import heroLogo from "../assets/her-guardian-logo.png";

const members = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop",
];

const HeroSection = () => {
  const goToAuth = () => {
    const element = document.getElementById("auth");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="hero-section">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        src="https://www.pexels.com/download/video/8729373/"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-left fade-up">
          <p className="label">Safety Platform</p>
          <div className="hero-title-row">
            <img src={heroLogo} alt="" className="hero-logo" />
            <h1>Her Guardian</h1>
          </div>
          <p className="hero-subtitle">Your safety companion wherever you go.</p>
        </div>
        <div className="hero-right slide-in">
          <button className="join-btn" onClick={goToAuth}>
            JOIN NOW
          </button>
          <div className="member-row">
            {members.map((src) => (
              <img key={src} src={src} alt="Member" />
            ))}
          </div>
          <p className="trusted-text">Trusted by thousands of women</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
