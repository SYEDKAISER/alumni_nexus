import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/course.css";


/* DEPARTMENT → COURSE MAP */

const departmentCourseMap = {

  CSE: [
    "BTECH",
    "DIPLOMA"
  ],

  CIVIL: [
    "BTECH",
    "DIPLOMA",
    "ARCHITECTURAL ASSISTANTSHIP",
    "DRAFTSMAN CIVIL"
  ],

  ECE: [
    "BTECH",
    "MTECH",
    "DIPLOMA"
  ],

  ELECTRICAL: [
    "BTECH",
    "DIPLOMA"
  ],

  MECHANICAL: [
    "BTECH",
    "MTECH",
    "DIPLOMA"
  ],

  "Computer Applications": [
    "BCA",
    "MCA"
  ],

  "Business School": [
    "BBA",
    "MBA"
  ],

  "Secretarial Practice & Office Management": [
    "SECRETARIAL PRACTICE & OFFICE MANAGEMENT"
  ]

};


/* NORMALIZER */

const normalize = (v) =>
  (v || "").toString().trim().toUpperCase();


/* UNIQUE MATCH KEY */

const makeKey = (r) =>
[
  normalize(r["Enrollment No"]),
  normalize(r["Course"]),
  normalize(r["Department"]),
  normalize(r["Batch"])
].join("|");


const CoursePage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");

  const [students, setStudents] = useState([]);
  const [submittedSet, setSubmittedSet] = useState(new Set());

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


  /* FETCH MASTER STUDENT DATA */

  useEffect(() => {

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv")
      .then(res => res.text())
      .then(text => {

        const rows = text.split("\n").filter(Boolean);

        const headers =
          rows[0].split(",").map(h => h.trim());

        const parsed = rows.slice(1).map(row => {

          const values = row.split(",");

          let obj = {};

          headers.forEach((h, i) => {
            obj[h] = values[i]?.trim();
          });

          return obj;

        });

        setStudents(parsed);

      });

  }, []);



  /* FETCH FORM RESPONSES */

  useEffect(() => {

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTEt99IaId_yFfbJdn3bXT9FTnFPEx7HMist6gj7RHhkc6zmpsNt_SvpkrKEBE47_wYH4VGANiMSl3J/pub?output=csv")
      .then(res => res.text())
      .then(text => {

        const rows = text.split("\n").filter(Boolean);

        if (rows.length < 2) return;

        const headers =
          rows[0].split(",").map(h =>
            h.trim().toLowerCase()
          );

        const getIndex = (name) =>
          headers.indexOf(name);

        const enrollmentIndex =
          getIndex("enrollment no");

        const departmentIndex =
          getIndex("department");

        const courseIndex =
          getIndex("course");

        const batchIndex =
          getIndex("batch");

        const lookup = new Set();

        rows.slice(1).forEach(row => {

          const cols = row.split(",");

          const record = {
            "Enrollment No":
              cols[enrollmentIndex],
            Department:
              cols[departmentIndex],
            Course:
              cols[courseIndex],
            Batch:
              cols[batchIndex]
          };

          lookup.add(makeKey(record));

        });

        setSubmittedSet(lookup);

      });

  }, []);



  /* FILTER AVAILABLE BATCHES */

  useEffect(() => {

    if (!department || !course) return;

    const batches = students
      .filter(s =>
        normalize(s.Department) === normalize(department) &&
        normalize(s.Course) === normalize(course)
      )
      .map(s => s.Batch);

    setAvailableBatches([...new Set(batches)]);

  }, [department, course, students]);



  /* CHECK SUBMISSION STATUS */

  const isSubmitted = (student) =>
    submittedSet.has(makeKey(student));



  /* FILTER STUDENTS */

  const filteredStudents = students.filter(s =>

    normalize(s.Department) === normalize(department) &&
    normalize(s.Course) === normalize(course) &&
    normalize(s.Batch) === normalize(batch) &&

    (
      normalize(s.Name).includes(normalize(search)) ||
      normalize(s["Enrollment No"]).includes(normalize(search))
    )

  );



  /* BACK BUTTON */

  const handleBack = () => {

    if (step === 2)
      navigate("/");
    else
      setStep(step - 1);

  };



  /* GOOGLE FORM PREFILL */

  const openForm = (s) => {

    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSfRBkbeqT0XhyeLfHRKn8i7eA1Neip8Y3U63QM7g8aWv6_Lmg/viewform?usp=pp_url";

    const url =
      `${base}` +
      `&entry.2061477684=${encodeURIComponent(s.Name)}` +
      `&entry.1519676616=${encodeURIComponent(s["Enrollment No"])}` +
      `&entry.631301714=${encodeURIComponent(s.Department)}` +
      `&entry.1161002506=${encodeURIComponent(s.Course)}` +
      `&entry.1808170822=${encodeURIComponent(s.Batch)}`;

    window.open(url, "_blank");

  };



  return (

    <div className="course-page">

      <div className="course-card">

        <div className="course-top">

          <img
            src="/ssmlogo.png"
            alt="logo"
            className="course-logo"
          />

          <div>

            <h1 className="college-name">
              SSM College of Engineering
            </h1>

            <p className="portal-name">
              Alumni Portal
            </p>

          </div>

        </div>



        {step > 1 && (

          <button
            className="back-btn"
            onClick={handleBack}
          >
            ← Back
          </button>

        )}



        {step === 2 && (

          <>
            <h3>{department}</h3>

            <div className="course-pills">

              {departmentCourseMap[department].map(c => (

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

              <option value="">
                Select Batch
              </option>

              {availableBatches.map((b, i) => (

                <option key={i}>{b}</option>

              ))}

            </select>

          </>

        )}



        {step === 4 && (

          <>
            <h3>{department} / {course} / {batch}</h3>

            <input
              className="search"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {filteredStudents.length === 0 ? (

              <p className="empty">
                No students found
              </p>

            ) : (

              filteredStudents.map((s, i) => {

                const submitted =
                  isSubmitted(s);

                return (

                  <div
                    key={i}
                    className="student-row"
                  >

                    <span>{s.Name}</span>

                    <span>
                      {s["Enrollment No"]}
                    </span>

                    <button
                      className={
                        submitted
                          ? "btn submitted"
                          : "btn"
                      }
                      disabled={submitted}
                      onClick={() => openForm(s)}
                    >
                      {submitted
                        ? "Form Submitted"
                        : "Fill Form"}
                    </button>

                  </div>

                );

              })

            )}

          </>

        )}

      </div>

    </div>

  );

};


export default CoursePage;