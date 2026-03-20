import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;