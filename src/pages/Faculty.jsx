import { useRef, useState } from "react";
import "../styles/Faculty.css";

function Faculty() {
  const [section, setSection] = useState("dashboard");

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [attendance, setAttendance] = useState(
    JSON.parse(localStorage.getItem("attendance")) || []
  );

  const [departments] = useState(
    JSON.parse(localStorage.getItem("departments")) || []
  );

  const canvasRef = useRef(null);

  // ================= DASHBOARD =================
  const studentCount = users.filter((u) => u.role === "student").length;
  const facultyCount = users.filter((u) => u.role === "faculty").length;

  // ================= CREATE STUDENT =================
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    section: "",
  });

  const createStudent = () => {
    if (!student.name || !student.email || !student.password)
      return alert("Fill all fields");

    const newStudent = { ...student, role: "student" };

    const updated = [...users, newStudent];
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    setStudent({
      name: "",
      email: "",
      password: "",
      department: "",
      section: "",
    });

    alert("Student Created");
  };

  // ================= MARK ATTENDANCE =================
  const [mark, setMark] = useState({
    name: "",
    department: "",
    section: "",
    status: "Present",
    date: "",
  });

  const markAttendance = () => {
    if (!mark.name || !mark.department || !mark.section)
      return alert("Fill all fields");

    const newEntry = {
      ...mark,
      date: mark.date || new Date().toISOString().split("T")[0],
    };

    const updated = [...attendance, newEntry];
    setAttendance(updated);
    localStorage.setItem("attendance", JSON.stringify(updated));

    setMark({
      name: "",
      department: "",
      section: "",
      status: "Present",
      date: "",
    });

    alert("Attendance Marked");
  };

  // ================= VIEW ATTENDANCE =================
  const [filter, setFilter] = useState({
    department: "",
    section: "",
  });

  const [viewData, setViewData] = useState([]);
  const [percent, setPercent] = useState("");

  const viewAttendance = () => {
    let filtered = attendance.filter(
      (a) =>
        (filter.department === "" || a.department === filter.department) &&
        (filter.section === "" || a.section === filter.section)
    );

    let present = filtered.filter((a) => a.status === "Present").length;
    let percentage = filtered.length ? (present / filtered.length) * 100 : 0;

    setViewData(filtered);
    setPercent(`Attendance %: ${percentage.toFixed(2)}%`);

    drawGraph(present, filtered.length - present);
  };

  // ================= GRAPH =================
  const drawGraph = (present, absent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 400, 200);

    let total = present + absent;
    if (total === 0) return;

    let ph = (present / total) * 150;
    let ah = (absent / total) * 150;

    ctx.fillStyle = "green";
    ctx.fillRect(80, 180 - ph, 50, ph);

    ctx.fillStyle = "red";
    ctx.fillRect(200, 180 - ah, 50, ah);
  };

  // ================= RESET PASSWORD =================
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
  });

  const resetPassword = () => {
    if (!resetData.email || !resetData.newPassword)
      return alert("Fill all fields");

    const userExists = users.find((u) => u.email === resetData.email);

    if (!userExists) return alert("User not found");

    const updatedUsers = users.map((u) =>
      u.email === resetData.email
        ? { ...u, password: resetData.newPassword }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setResetData({ email: "", newPassword: "" });

    alert("Password Reset Successful");
  };

  // ================= FILTER ACCOUNTS =================
  const [accountFilter, setAccountFilter] = useState({
    role: "",
    department: "",
  });

  const filteredUsers = users.filter(
    (u) =>
      (accountFilter.role === "" || u.role === accountFilter.role) &&
      (accountFilter.department === "" ||
        u.department === accountFilter.department)
  );

  return (
    <div className="container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Faculty Panel</h2>

        <button onClick={() => setSection("dashboard")}>Dashboard</button>
        <button onClick={() => setSection("create")}>Create Students</button>
        <button onClick={() => setSection("mark")}>Mark Attendance</button>
        <button onClick={() => setSection("view")}>View Attendance</button>
        <button onClick={() => setSection("accounts")}>View Accounts</button>
        <button onClick={() => setSection("reset")}>Reset Password</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* DASHBOARD */}
        {section === "dashboard" && (
          <div className="section active">
            <h3>Dashboard</h3>
            <div className="cards">
              <div className="card">Students: {studentCount}</div>
              <div className="card">Faculty: {facultyCount}</div>
            </div>
          </div>
        )}

        {/* CREATE STUDENT */}
        {section === "create" && (
          <div className="section active">
            <h3>Create Student</h3>

            <input
              placeholder="Name"
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
            />

            <input
              placeholder="Email"
              value={student.email}
              onChange={(e) => setStudent({ ...student, email: e.target.value })}
            />

            <input
              placeholder="Password"
              value={student.password}
              onChange={(e) => setStudent({ ...student, password: e.target.value })}
            />

            <select
              value={student.department}
              onChange={(e) =>
                setStudent({ ...student, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <input
              placeholder="Section"
              value={student.section}
              onChange={(e) =>
                setStudent({ ...student, section: e.target.value })
              }
            />

            <button onClick={createStudent}>Create</button>
          </div>
        )}

        {/* MARK ATTENDANCE */}
        {section === "mark" && (
          <div className="section active">
            <h3>Mark Attendance</h3>

            <input
              placeholder="Student Name"
              value={mark.name}
              onChange={(e) => setMark({ ...mark, name: e.target.value })}
            />

            <select
              value={mark.department}
              onChange={(e) =>
                setMark({ ...mark, department: e.target.value })
              }
            >
              <option>Select Department</option>
              {departments.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <input
              placeholder="Section"
              value={mark.section}
              onChange={(e) => setMark({ ...mark, section: e.target.value })}
            />

            <select
              value={mark.status}
              onChange={(e) => setMark({ ...mark, status: e.target.value })}
            >
              <option>Present</option>
              <option>Absent</option>
            </select>

            <input
              type="date"
              value={mark.date}
              onChange={(e) => setMark({ ...mark, date: e.target.value })}
            />

            <button onClick={markAttendance}>Mark</button>
          </div>
        )}

        {/* VIEW ATTENDANCE */}
        {section === "view" && (
          <div className="section active">
            <h3>View Attendance</h3>

            <select
              onChange={(e) =>
                setFilter({ ...filter, department: e.target.value })
              }
            >
              <option>Select Department</option>
              {departments.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <input
              placeholder="Section"
              onChange={(e) =>
                setFilter({ ...filter, section: e.target.value })
              }
            />

            <button onClick={viewAttendance}>Load</button>

            <table>
              <tbody>
                {viewData.map((a, i) => (
                  <tr key={i}>
                    <td>{a.name}</td>
                    <td>{a.department}</td>
                    <td>{a.section}</td>
                    <td>{a.date}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>{percent}</h4>
            <canvas ref={canvasRef} width="400" height="200"></canvas>
          </div>
        )}

        {/* VIEW ACCOUNTS */}
        {section === "accounts" && (
          <div className="section active">
            <h3>View Accounts</h3>

            <select
              onChange={(e) =>
                setAccountFilter({ ...accountFilter, role: e.target.value })
              }
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <select
              onChange={(e) =>
                setAccountFilter({
                  ...accountFilter,
                  department: e.target.value,
                })
              }
            >
              <option value="">All Departments</option>
              {departments.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <table className="accounts-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Department</th>
      <th>Section</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredUsers.map((u, i) => (
      <tr key={i}>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>{u.role}</td>
        <td>{u.department}</td>
        <td>{u.section}</td>
        <td>
          <button>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        )}

        {/* RESET PASSWORD */}
        {section === "reset" && (
          <div className="section active">
            <h3>Reset Password</h3>

            <input
              placeholder="Email"
              value={resetData.email}
              onChange={(e) =>
                setResetData({ ...resetData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={resetData.newPassword}
              onChange={(e) =>
                setResetData({ ...resetData, newPassword: e.target.value })
              }
            />

            <button onClick={resetPassword}>Reset Password</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Faculty;