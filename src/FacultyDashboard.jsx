import { useEffect, useState } from "react";
import "./FacultyDashboard.css";

export default function FacultyDashboard() {
  const [active, setActive] = useState("create");

  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    class: "",
    section: ""
  });

  const [mark, setMark] = useState({
    name: "",
    class: "",
    section: "",
    status: "Present",
    date: ""
  });

  const [view, setView] = useState({
    class: "",
    section: ""
  });

  const [filtered, setFiltered] = useState([]);
  const [percentage, setPercentage] = useState(0);

  const [resetData, setResetData] = useState({
    email: "",
    newPass: ""
  });

  /* LOAD DATA */
  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setAttendance(JSON.parse(localStorage.getItem("attendance")) || []);
  }, []);

  const saveUsers = (data) => {
    setUsers(data);
    localStorage.setItem("users", JSON.stringify(data));
  };

  const saveAttendance = (data) => {
    setAttendance(data);
    localStorage.setItem("attendance", JSON.stringify(data));
  };

  /* CREATE STUDENT */
  const createStudent = () => {
    const newUser = {
      ...student,
      role: "student"
    };

    const updated = [...users, newUser];
    saveUsers(updated);
  };

  /* DELETE STUDENT */
  const deleteStudent = (index) => {
    const updated = users.filter((_, i) => i !== index);
    saveUsers(updated);
  };

  /* MARK ATTENDANCE */
  const markAttendance = () => {
    const dateValue =
      mark.date || new Date().toISOString().split("T")[0];

    const updated = [
      ...attendance,
      { ...mark, date: dateValue }
    ];

    saveAttendance(updated);
  };

  /* VIEW ATTENDANCE */
  const viewAttendance = () => {
    const data = attendance.filter(
      (a) => a.class === view.class && a.section === view.section
    );

    setFiltered(data);

    const present = data.filter(a => a.status === "Present").length;
    const percent = data.length ? (present / data.length) * 100 : 0;

    setPercentage(percent.toFixed(2));
  };

  /* RESET PASSWORD */
  const resetPassword = () => {
    const updated = users.map(u => {
      if (u.email === resetData.email) {
        return { ...u, password: resetData.newPass };
      }
      return u;
    });

    saveUsers(updated);
    alert("Reset Done");
  };

  return (
    <div className="faculty-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Faculty Panel</h2>

        <button onClick={() => setActive("create")}>Create Students</button>
        <button onClick={() => setActive("mark")}>Mark Attendance</button>
        <button onClick={() => setActive("view")}>View Attendance</button>
        <button onClick={() => setActive("reset")}>Reset Password</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* CREATE */}
        {active === "create" && (
          <div className="section active">
            <h3>Create Student</h3>

            <input placeholder="Name"
              onChange={e => setStudent({...student, name: e.target.value})} />

            <input placeholder="Email"
              onChange={e => setStudent({...student, email: e.target.value})} />

            <input placeholder="Password"
              onChange={e => setStudent({...student, password: e.target.value})} />

            <input placeholder="Class"
              onChange={e => setStudent({...student, class: e.target.value})} />

            <input placeholder="Section"
              onChange={e => setStudent({...student, section: e.target.value})} />

            <button className="action" onClick={createStudent}>Create</button>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.role === "student")
                  .map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.class}</td>
                      <td>{u.section}</td>
                      <td>
                        <button className="delete" onClick={() => deleteStudent(i)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MARK */}
        {active === "mark" && (
          <div className="section active">
            <h3>Mark Attendance</h3>

            <input placeholder="Student Name"
              onChange={e => setMark({...mark, name: e.target.value})} />

            <input placeholder="Class"
              onChange={e => setMark({...mark, class: e.target.value})} />

            <input placeholder="Section"
              onChange={e => setMark({...mark, section: e.target.value})} />

            <select onChange={e => setMark({...mark, status: e.target.value})}>
              <option>Present</option>
              <option>Absent</option>
            </select>

            <input type="date"
              onChange={e => setMark({...mark, date: e.target.value})} />

            <button className="action" onClick={markAttendance}>Mark</button>
          </div>
        )}

        {/* VIEW */}
        {active === "view" && (
          <div className="section active">
            <h3>View Attendance</h3>

            <input placeholder="Class"
              onChange={e => setView({...view, class: e.target.value})} />

            <input placeholder="Section"
              onChange={e => setView({...view, section: e.target.value})} />

            <button className="action" onClick={viewAttendance}>Load Data</button>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i}>
                    <td>{a.name}</td>
                    <td>{a.class}</td>
                    <td>{a.section}</td>
                    <td>{a.date}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Attendance %: {percentage}%</h4>
          </div>
        )}

        {/* RESET */}
        {active === "reset" && (
          <div className="section active">
            <h3>Reset Password</h3>

            <input placeholder="Email"
              onChange={e => setResetData({...resetData, email: e.target.value})} />

            <input placeholder="New Password"
              onChange={e => setResetData({...resetData, newPass: e.target.value})} />

            <button className="action" onClick={resetPassword}>Reset</button>
          </div>
        )}

      </div>
    </div>
  );
}