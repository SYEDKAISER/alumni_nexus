import { useEffect, useState } from "react";

const Students = ({ courseId, semester }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTZLiZpY6m1CoQTciWYPq828duPS78e5xnjx-6pZzKoBCpaGKkiFWONxnK4iwoRFgtLW5T6n2hawabU/pub?output=csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.split("\n").map((row) => row.split(","));

        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
          let obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = row[i]?.trim();
          });
          return obj;
        });

        // FILTER by course + semester
        const filtered = data.filter(
          (s) =>
            s.Course === courseId &&
            s.Semester === semester.toString()
        );

        setStudents(filtered);
      });
  }, [courseId, semester]);

  if (!semester) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Students</h3>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.Name}</td>
                <td>{s.Roll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;