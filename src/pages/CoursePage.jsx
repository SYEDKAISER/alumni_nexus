import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/course.css";


/* COURSE LEVEL MAP */

const departmentCourseMap = {

  CSE: ["BTECH", "DIPLOMA"],
  IT: ["DIPLOMA"],
  CIVIL: ["BTECH", "DIPLOMA"],
  DRAFTSMANSHIP: ["DIPLOMA"],
  "ARCHITECTURAL ASSISTANTSHIP": ["DIPLOMA"],
  ECE: ["BTECH", "MTECH", "DIPLOMA"],
  ELECTRICAL: ["BTECH", "DIPLOMA"],
  MECHANICAL: ["BTECH", "MTECH", "DIPLOMA"],
  "SECRETARIAL PRACTICE & OFFICE MANAGEMENT": ["DIPLOMA"],
  "Computer Applications": ["BCA", "MCA"],
  "Business School": ["BBA", "MBA"]

};


/* NORMALIZER */

const normalize = (v) =>
  (v || "").toString().trim().toUpperCase();


/* UNIQUE KEY */

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

  const [search, setSearch] = useState("");


  /* INDEX STRUCTURE */

  const [index, setIndex] = useState({});


  /* SAFE NAVIGATION */

  useEffect(() => {

    const selectedDepartment =
      location.state?.branch;

    if (!selectedDepartment)
      navigate("/");
    else {
      setDepartment(selectedDepartment);
      setStep(2);
    }

  }, [location, navigate]);


  /* FETCH MASTER DATA + BUILD INDEX */

  useEffect(() => {

    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv"
    )
      .then(res => res.text())
      .then(text => {

        const rows =
          text.split("\n").filter(Boolean);

        const headers =
          rows[0].split(",");

        const parsedIndex = {};

        rows.slice(1).forEach(row => {

          const values = row.split(",");

          let obj = {};

          headers.forEach((h, i) => {
            obj[h.trim()] = values[i]?.trim();
          });

          const dept =
            normalize(obj.Department);

          const courseVal =
            normalize(obj.Course);

          const batchVal =
            normalize(obj.Batch);


          if (!parsedIndex[dept])
            parsedIndex[dept] = {};

          if (!parsedIndex[dept][courseVal])
            parsedIndex[dept][courseVal] = {};

          if (!parsedIndex[dept][courseVal][batchVal])
            parsedIndex[dept][courseVal][batchVal] = [];

          parsedIndex[dept][courseVal][batchVal].push(obj);

        });

        setIndex(parsedIndex);

      });

  }, []);


  /* FETCH SUBMISSIONS */

  useEffect(() => {

    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTEt99IaId_yFfbJdn3bXT9FTnFPEx7HMist6gj7RHhkc6zmpsNt_SvpkrKEBE47_wYH4VGANiMSl3J/pub?output=csv"
    )
      .then(res => res.text())
      .then(text => {

        const rows =
          text.split("\n").filter(Boolean);

        const headers =
          rows[0]
            .split(",")
            .map(h => h.trim().toLowerCase());

        const getIndex = (name) =>
          headers.indexOf(name);

        const lookup = new Set();

        rows.slice(1).forEach(row => {

          const cols = row.split(",");

          lookup.add(makeKey({
            "Enrollment No":
              cols[getIndex("enrollment no")],
            Department:
              cols[getIndex("department")],
            Course:
              cols[getIndex("course")],
            Batch:
              cols[getIndex("batch")]
          }));

        });

        setSubmittedSet(lookup);

      });

  }, []);


  /* FAST BATCH LOOKUP */

  const availableBatches = useMemo(() => {

    if (!department || !course)
      return [];

    const deptData =
      index[normalize(department)];

    if (!deptData)
      return [];

    const batches = Object.keys(deptData)
      .filter(c =>
        c.includes(normalize(course))
      )
      .flatMap(c =>
        Object.keys(deptData[c])
      );

    return [...new Set(batches)];

  }, [department, course, index]);


  /* FAST STUDENT LOOKUP */

  const filteredStudents = useMemo(() => {

    if (!department || !course || !batch)
      return [];

    const deptData =
      index[normalize(department)];

    if (!deptData)
      return [];

    let list = [];

    Object.keys(deptData).forEach(c => {

      if (c.includes(normalize(course))) {

        const batchStudents =
          deptData[c][normalize(batch)];

        if (batchStudents)
          list.push(...batchStudents);

      }

    });

    if (!search)
      return list;

    return list.filter(s =>

      normalize(s.Name).includes(
        normalize(search)
      ) ||

      normalize(s["Enrollment No"]).includes(
        normalize(search)
      )

    );

  }, [department, course, batch, search, index]);


  /* SUBMISSION CHECK */

  const isSubmitted = (student) =>
    submittedSet.has(makeKey(student));


  /* BACK BUTTON */

  const handleBack = () => {

    if (step === 2)
      navigate("/");
    else
      setStep(step - 1);

  };


  /* PREFILL FORM */

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

              {departmentCourseMap[
                department
              ].map(c => (

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
            <h3>
              {department} / {course}
            </h3>

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

                <option key={i}>
                  {b}
                </option>

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

            {filteredStudents.map((s, i) => {

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

            })}

          </>

        )}

      </div>

    </div>

  );

};

export default CoursePage;