import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/course.css";


/* ================= NORMALIZER ================= */

const normalize = (v) =>
  (v || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();


/* ================= BRANCH → DEPARTMENT ================= */

const branchToDepartment = (branch) => {

  const b = normalize(branch);

  if (
    b.includes("ARCHITECTURAL ASSISTANTSHIP") ||
    b.includes("DRAFTSMAN") ||
    b === "CIVIL"
  )
    return "CIVIL";

  if (b === "IT")
    return "CSE";

  if (b.includes("SECRETARIAL"))
    return "SECRETARIAL PRACTICE & OFFICE MANAGEMENT";

  if (b === "CSE")
    return "CSE";

  if (b === "ECE")
    return "ECE";

  if (b === "ELECTRICAL")
    return "ELECTRICAL";

  if (b === "MECHANICAL")
    return "MECHANICAL";

  return b;
};


/* ================= BRANCH → COURSE ================= */

const branchToCourse = (branch) => {

  const b = normalize(branch);

  if (b.includes("ARCHITECTURAL ASSISTANTSHIP"))
    return "ARCHITECTURAL ASSISTANTSHIP";

  if (b.includes("DRAFTSMAN"))
    return "DRAFTSMAN CIVIL";

  if (b.includes("SECRETARIAL"))
    return "SECRETARIAL PRACTICE & OFFICE MANAGEMENT";

  return "DIPLOMA";
};


/* ================= DEPARTMENT → COURSE MAP ================= */

const departmentCourseMap = {

  CSE: [
    "DIPLOMA"
  ],

  CIVIL: [
    "DIPLOMA",
    "ARCHITECTURAL ASSISTANTSHIP",
    "DRAFTSMAN CIVIL"
  ],

  ECE: [
    "DIPLOMA"
  ],

  ELECTRICAL: [
    "DIPLOMA"
  ],

  MECHANICAL: [
    "DIPLOMA"
  ],

  "SECRETARIAL PRACTICE & OFFICE MANAGEMENT": [
    "SECRETARIAL PRACTICE & OFFICE MANAGEMENT"
  ]

};


/* ================= UNIQUE KEY ================= */

const makeKey = (r) =>
[
  normalize(r["Enrollment No"]),
  normalize(branchToDepartment(r.Branch)),
  normalize(branchToCourse(r.Branch)),
  normalize(r.Batch)
].join("|");


/* ================= COMPONENT ================= */

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


  /* ================= LOAD DEPARTMENT ================= */

  useEffect(() => {

    const selectedDepartment =
      normalize(location.state?.branch);

    if (!selectedDepartment)
      navigate("/");
    else {
      setDepartment(selectedDepartment);
      setStep(2);
    }

  }, [location, navigate]);


  /* ================= FETCH MASTER DATA ================= */

  useEffect(() => {

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv")
      .then(res => res.text())
      .then(text => {

        const rows =
          text.split("\n").filter(Boolean);

        const headers =
          rows[0].split(",").map(h => h.trim());

        const parsed =
          rows.slice(1).map(row => {

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


  /* ================= FETCH FORM RESPONSES ================= */

  useEffect(() => {

    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTEt99IaId_yFfbJdn3bXT9FTnFPEx7HMist6gj7RHhkc6zmpsNt_SvpkrKEBE47_wYH4VGANiMSl3J/pub?output=csv")
      .then(res => res.text())
      .then(text => {

        const rows =
          text.split("\n").filter(Boolean);

        if (rows.length < 2) return;

        const headers =
          rows[0].split(",").map(h =>
            normalize(h)
          );

        const getIndex = (name) =>
          headers.indexOf(normalize(name));

        const enrollmentIndex =
          getIndex("Enrollment No");

        const departmentIndex =
          getIndex("Department");

        const courseIndex =
          getIndex("Course");

        const batchIndex =
          getIndex("Batch");

        const lookup = new Set();

        rows.slice(1).forEach(row => {

          const cols = row.split(",");

          lookup.add(

            [
              normalize(cols[enrollmentIndex]),
              normalize(cols[departmentIndex]),
              normalize(cols[courseIndex]),
              normalize(cols[batchIndex])

            ].join("|")

          );

        });

        setSubmittedSet(lookup);

      });

  }, []);


  /* ================= FILTER BATCHES ================= */

  useEffect(() => {

    if (!department || !course) return;

    const batches = students
      .filter(s =>

        branchToDepartment(s.Branch) === department &&
        branchToCourse(s.Branch) === normalize(course)

      )
      .map(s => s.Batch);

    setAvailableBatches([...new Set(batches)]);

  }, [department, course, students]);


  /* ================= CHECK SUBMISSION ================= */

  const isSubmitted = (student) =>
    submittedSet.has(makeKey(student));


  /* ================= FILTER STUDENTS ================= */

  const filteredStudents =
    students.filter(s =>

      branchToDepartment(s.Branch) === department &&
      branchToCourse(s.Branch) === normalize(course) &&
      normalize(s.Batch) === normalize(batch) &&

      (
        normalize(s.Name)
          .includes(normalize(search)) ||

        normalize(s["Enrollment No"])
          .includes(normalize(search))
      )

    );


  /* ================= BACK BUTTON ================= */

  const handleBack = () => {

    if (step === 2)
      navigate("/");
    else
      setStep(step - 1);

  };


  /* ================= GOOGLE FORM PREFILL ================= */

  const openForm = (s) => {

    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSfRBkbeqT0XhyeLfHRKn8i7eA1Neip8Y3U63QM7g8aWv6_Lmg/viewform?usp=pp_url";

    const url =
      `${base}` +
      `&entry.2061477684=${encodeURIComponent(s.Name)}` +
      `&entry.1519676616=${encodeURIComponent(s["Enrollment No"])}` +
      `&entry.631301714=${encodeURIComponent(branchToDepartment(s.Branch))}` +
      `&entry.1161002506=${encodeURIComponent(branchToCourse(s.Branch))}` +
      `&entry.1808170822=${encodeURIComponent(s.Batch)}`;

    window.open(url, "_blank");

  };


  /* ================= UI ================= */

  return (

    <div className="course-page">

      <div className="course-card">

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

              {departmentCourseMap[department]?.map(c => (

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
            <h3>
              {department} / {course} / {batch}
            </h3>

            <input
              className="search"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {filteredStudents.length === 0
              ? <p>No students found</p>
              : filteredStudents.map((s, i) => {

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
                        onClick={() =>
                          openForm(s)
                        }
                      >
                        {submitted
                          ? "Form Submitted"
                          : "Fill Form"}
                      </button>

                    </div>

                  );

                })}

          </>

        )}

      </div>

    </div>

  );

};


export default CoursePage;