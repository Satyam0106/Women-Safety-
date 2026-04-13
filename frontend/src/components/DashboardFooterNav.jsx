import { NavLink } from "react-router-dom";

const DashboardFooterNav = () => (
  <footer className="dashboard-footer-nav">
    <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
      Travel History
    </NavLink>
    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active alert" : "alert")}>
      ALERT
    </NavLink>
    <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
      Profile
    </NavLink>
  </footer>
);

export default DashboardFooterNav;
