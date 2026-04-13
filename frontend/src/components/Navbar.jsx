import navLogo from "../assets/her-guardian-logo.png";

const Navbar = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <img src={navLogo} alt="" className="nav-logo" />
        Her Guardian
      </div>
      <div className="nav-links">
        <button onClick={() => handleScroll("home")}>Home</button>
        <button onClick={() => handleScroll("about")}>About Us</button>
        <button onClick={() => handleScroll("auth")}>Join Now</button>
      </div>
    </nav>
  );
};

export default Navbar;
