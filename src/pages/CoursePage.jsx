import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/course.css";

const departmentCourseMap = {
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

  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");

  const [students, setStudents] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [search, setSearch] = useState("");

  /* SAFE NAVIGATION */
  useEffect(() => {
    const selectedDepartment = location.state?.branch;

    if (!selectedDepartment) {
      navigate("/");
    } else {
      setDepartment(selectedDepartment);
      setStep(2);
    }
  }, [location, navigate]);

  /* RESET WHEN DEPARTMENT CHANGES */
  useEffect(() => {
    setCourse("");
    setBatch("");
  }, [department]);

  /* FETCH SHEET DATA */
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n");

        const headers = rows[0].split(",").map((h) => h.trim());

        const data = rows.slice(1).map((row) => {
          const values = row.split(",");
          let obj = {};
          headers.forEach((h, i) => (obj[h] = values[i]?.trim()));
          return obj;
        });

        setStudents(data);
      });
  }, []);

  /* FILTER AVAILABLE BATCHES */
  useEffect(() => {
    if (!department || !course) return;

    const batches = students
      .filter(
        (s) =>
          s.Department === department &&
          s.Course === course
      )
      .map((s) => s.Batch);

    setAvailableBatches([...new Set(batches)]);
  }, [department, course, students]);

  /* FILTER STUDENTS */
  const filteredStudents = students.filter(
    (s) =>
      s.Department === department &&
      s.Course === course &&
      s.Batch === batch &&
      (
        s.Name?.toLowerCase().includes(search.toLowerCase()) ||
        s["Enrollment No"]?.toLowerCase().includes(search.toLowerCase())
      )
  );

  /* BACK BUTTON */
  const handleBack = () => {
    if (step === 2) {
      navigate("/");
    } else {
      setStep(step - 1);
    }
  };

  /* GOOGLE FORM PREFILL */
  const openForm = (s) => {
    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSfRBkbeqT0XhyeLfHRKn8i7eA1Neip8Y3U63QM7g8aWv6_Lmg/viewform?usp=pp_url";

    const url =
      `${base}` +
      `&entry.2061477684=${encodeURIComponent(s.Name)}` +
      `&entry.1519676616=${encodeURIComponent(s["Enrollment No"])}` +
      `&entry.1161002506=${encodeURIComponent(course)}` +
      `&entry.1972342123=${encodeURIComponent(batch)}` +
      `&entry.1234567890=${encodeURIComponent(department)}`; 
      // Replace last entry ID with your actual Department field ID

    window.open(url, "_blank");
  };

  return (
    <div className="course-page">
      <div className="course-card">

        {/* TOP HEADER */}
        <div className="course-top">
          <img src="/ssmlogo.png" alt="logo" className="course-logo" />
          <div>
            <h1 className="college-name">SSM College of Engineering</h1>
            <p className="portal-name">Alumni Portal</p>
          </div>
        </div>

        {/* BACK BUTTON */}
        {step > 1 && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}

        {/* STEP 2 COURSE */}
        {step === 2 && (
          <>
            <h3>{department}</h3>

            <div className="course-pills">
              {departmentCourseMap[department].map((c) => (
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
          </>
        )}

        {/* STEP 3 BATCH */}
        {step === 3 && (
          <>
            <h3>{department} / {course}</h3>

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

        {/* STEP 4 STUDENTS */}
        {step === 4 && (
          <>
            <h3>{department} / {course} / {batch}</h3>

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
                  <span>{s["Enrollment No"]}</span>

                  <button
                    className="btn"
                    onClick={() => openForm(s)}
                  >
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