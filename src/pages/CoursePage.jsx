import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/course.css";

const branchCourseMap = {
  CSE: ["BTECH", "DIPLOMA"],
  CIVIL: ["BTECH", "DIPLOMA"],
  ECE: ["BTECH", "DIPLOMA", "MTECH"],
  ELECTRICAL: ["BTECH", "DIPLOMA"],
  MECHANICAL: ["BTECH", "DIPLOMA", "MTECH"],
  "Computer Sciences": ["BCA", "MCA"],
  "Business School": ["BBA", "MBA"]
};

const CoursePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");

  const [students, setStudents] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [search, setSearch] = useState("");

  // SAFE NAVIGATION
  useEffect(() => {
    const selectedBranch = location.state?.branch;

    if (!selectedBranch) {
      navigate("/");
    } else {
      setBranch(selectedBranch);
      setStep(2);
    }
  }, [location, navigate]);

  // RESET
  useEffect(() => {
    setCourse("");
    setBatch("");
  }, [branch]);

  // FETCH DATA
  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv")
      .then(res => res.text())
      .then(text => {
        const rows = text.trim().split("\n");

        const headers = rows[0].split(",").map(h => h.trim());

        const data = rows.slice(1).map(row => {
          const values = row.split(",");
          let obj = {};
          headers.forEach((h, i) => obj[h] = values[i]?.trim());
          return obj;
        });

        setStudents(data);
      });
  }, []);

  // FILTER BATCHES
  useEffect(() => {
    if (!branch || !course) return;

    const batches = students
      .filter(s => s.Branch === branch && s.Course === course)
      .map(s => s.Batch);

    setAvailableBatches([...new Set(batches)]);
  }, [branch, course, students]);

  // FILTER STUDENTS
  const filteredStudents = students.filter(
    s =>
      s.Branch === branch &&
      s.Course === course &&
      s.Batch === batch &&
      (
        s.Name?.toLowerCase().includes(search.toLowerCase()) ||
        s.Roll?.toLowerCase().includes(search.toLowerCase())
      )
  );

  // BACK BUTTON
  const handleBack = () => {
    if (step === 2) {
      navigate("/");
    } else {
      setStep(step - 1);
    }
  };

  // FILL FORM
  const openForm = (s) => {
    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSfRBkbeqT0XhyeLfHRKn8i7eA1Neip8Y3U63QM7g8aWv6_Lmg/viewform?usp=pp_url";

    const url =
      `${base}` +
      `&entry.2061477684=${encodeURIComponent(s.Name)}` +
      `&entry.1519676616=${encodeURIComponent(s.Roll)}` +
      `&entry.1161002506=${encodeURIComponent(course)}` +
      `&entry.1972342123=${encodeURIComponent(batch)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="course-page">

      <div className="course-card">

        {/* ✅ TOP CENTERED (LIKE ORIGINAL) */}
        <div className="course-top">
          <img src="/ssmlogo.png" alt="logo" className="course-logo" />

          <div>
            <h1 className="college-name">SSM College of Engineering</h1>
            <p className="portal-name">Alumni Portal</p>
          </div>
        </div>

        {/* BACK */}
        {step > 1 && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div key={branch}>
            <h3>{branch}</h3>

            <div className="course-pills">
              {branchCourseMap[branch].map(c => (
                <span
                  key={c}
                  className="pill"
                  onClick={() => {
                    setCourse(c);
                    setStep(3);
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h3>{branch} / {course}</h3>

            <select
              className="dropdown"
              onChange={(e) => {
                setBatch(e.target.value);
                setStep(4);
              }}
            >
              <option value="">Select Batch</option>

              {availableBatches.map((b, i) => (
                <option key={i}>{b}</option>
              ))}
            </select>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h3>{branch} / {course} / {batch}</h3>

            <input
              className="search"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredStudents.length === 0 ? (
              <p className="empty">No students found</p>
            ) : (
              filteredStudents.map((s, i) => (
                <div key={i} className="student-row">
                  <span>{s.Name}</span>
                  <span>{s.Roll}</span>

                  <button className="btn" onClick={() => openForm(s)}>
                    Fill Form
                  </button>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default CoursePage;