const faqs = [
  {
    q: "How does Her Guardian improve my safety?",
    a: "Her Guardian combines community, quick help access, and trusted contact support in one place.",
  },
  {
    q: "Can I use it while traveling alone?",
    a: "Yes. The platform is designed to support women during commutes, travel, and late hours.",
  },
  {
    q: "Is my personal data protected?",
    a: "Yes. We follow secure architecture and responsible data practices to protect account information.",
  },
];

const Footer = () => (
  <footer id="about" className="footer-section">
    <div className="footer-grid">
      <div>
        <h3>Her Guardian</h3>
        <p className="muted-light">
          We are a women-first safety team building technology that feels supportive, calm, and
          trustworthy.
        </p>
        <p className="muted-light">Contact: +91 90000 00000</p>
        <p className="muted-light">Email: support@herguardian.app</p>
      </div>

      <div>
        <h4>FAQ</h4>
        {faqs.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <div>
        <h4>Follow Us</h4>
        <div className="social-row">
          <a href="#" aria-label="Instagram">
            IG
          </a>
          <a href="#" aria-label="LinkedIn">
            IN
          </a>
          <a href="#" aria-label="YouTube">
            YT
          </a>
          <a href="#" aria-label="X">
            X
          </a>
        </div>
      </div>
    </div>
    <p className="copyright">© {new Date().getFullYear()} Her Guardian. All rights reserved.</p>
  </footer>
);

export default Footer;
