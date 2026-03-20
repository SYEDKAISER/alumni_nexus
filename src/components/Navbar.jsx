// components/Navbar.jsx
import "../styles/dashboard.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <img src="/logo.png" alt="SSM Logo" className="logo" />
        <div className="brand-block">
          <span className="brand-title">SSM College of Engineering</span>
          <span className="brand-sub">Alumni Nexus</span>
        </div>
      </div>

      <div className="nav-right">
        <span className="user">Admin Panel</span>
      </div>
    </div>
  );
};

export default Navbar;