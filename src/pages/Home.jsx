import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const branches = [
  "CSE",
  "CIVIL",
  "ECE",
  "ELECTRICAL",
  "MECHANICAL",
  "Computer Applications",
  "Business School"
];

const Home = () => {
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!branch) return alert("Select Department");
    navigate("/courses", { state: { branch } });
  };

  return (
    <div className="home-wrapper">

      <div className="home-card">

        {/* LOGO + NAME (SAME STYLE AS COURSE PAGE) */}
        <div className="home-top">
          <img src="/ssmlogo.png" alt="logo" className="home-logo" />

          <div>
            <h1 className="college-names">SSM College of Engineering</h1>
            <p className="portal-names">Alumni Portal</p>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="home-title">Select Department</h2>

        {/* DROPDOWN */}
        <select
          className="home-dropdown"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Select Department</option>

          {branches.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        {/* BUTTON */}
        <button className="home-btn" onClick={handleProceed}>
          Proceed →
        </button>

      </div>

    </div>
  );
};

export default Home;