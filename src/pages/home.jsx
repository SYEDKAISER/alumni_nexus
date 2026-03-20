import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      <div className="home-card">

        <h1 className="home-title">Welcome to Alumni Portal</h1>
        <p className="home-sub">
          Select your course to continue
        </p>

        <div className="dropdown-wrapper">
          <select
            className="dropdown"
            onChange={(e) => navigate(`/course/${e.target.value}`)}
          >
            <option value="">Select Course</option>

            <option value="BTECH_CSE">B.Tech CSE</option>
            <option value="BTECH_EC">B.Tech E&C</option>
            <option value="BTECH_EE">Electrical</option>
            <option value="BTECH_CIVIL">Civil</option>
            <option value="BTECH_MECH">Mechanical</option>

            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>

            <option value="MTECH_MECH">M.Tech Mechanical</option>
            <option value="MTECH_EC">M.Tech E&C</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default Home;