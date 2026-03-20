import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Dashboard</h3>

      <button onClick={() => navigate("/")} className="side-link">
        Home
      </button>

      <button className="side-link">Courses</button>
      <button className="side-link">Students</button>
    </div>
  );
};

export default Sidebar;