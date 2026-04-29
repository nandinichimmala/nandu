import { useEffect, useState } from "react";
import "./HodDashboard.css";

export default function HodDashboard() {
  const [active, setActive] = useState("create");

  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
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

  const [filter, setFilter] = useState({
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

  /* CREATE USER */
  const createUser = () => {
    const updated = [...users, newUser];
    saveUsers(updated);
    alert("User Created");
  };

  /* DELETE USER */
  const deleteUser = (index) => {
    const updated = users.filter((_, i) => i !== index);
    saveUsers(updated);
  };

  /* MARK ATTENDANCE */
  const markAttendance = () => {
    const dateValue =
      mark.date || new Date().toISOString().split("T")[0];

    const updated = [...attendance, { ...mark, date: dateValue }];
    saveAttendance(updated);
    alert("Attendance Marked");
  };

  /* VIEW */
  const viewAttendance = () => {
    const data = attendance.filter(
      (a) =>
        (filter.class === "" || a.class === filter.class) &&
        (filter.section === "" || a.section === filter.section)
    );

    setFiltered(data);

    const present = data.filter(a => a.status === "Present").length;
    const percent = data.length ? (present / data.length) * 100 : 0;

    setPercentage(percent.toFixed(2));
  };

  /* RESET */
  const resetPassword = () => {
    const updated = users.map(u => {
      if (u.email === resetData.email) {
        return { ...u, password: resetData.newPass };
      }
      return u;
    });

    saveUsers(updated);
    alert("Password Reset Successful");
  };

  return (
    <div className="hod-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>HOD Panel</h2>

        <button onClick={() => setActive("create")}>Create Accounts</button>
        <button onClick={() => setActive("mark")}>Mark Attendance</button>
        <button onClick={() => setActive("view")}>View Attendance</button>
        <button onClick={() => setActive("reset")}>Reset Password</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* CREATE */}
        {active === "create" && (
          <div className="section active">
            <h3>Create Accounts</h3>

            <input placeholder="Name"
              onChange={e => setNewUser({...newUser, name: e.target.value})} />

            <input placeholder="Email"
              onChange={e => setNewUser({...newUser, email: e.target.value})} />

            <input placeholder="Password"
              onChange={e => setNewUser({...newUser, password: e.target.value})} />

            <select onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <input placeholder="Class"
              onChange={e => setNewUser({...newUser, class: e.target.value})} />

            <input placeholder="Section"
              onChange={e => setNewUser({...newUser, section: e.target.value})} />

            <button className="action" onClick={createUser}>Create</button>

            <h3>Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.name}</td>
                    <td>{u.role}</td>
                    <td>{u.class}</td>
                    <td>{u.section}</td>
                    <td>
                      <button className="delete" onClick={() => deleteUser(i)}>
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
              onChange={e => setFilter({...filter, class: e.target.value})} />

            <input placeholder="Section"
              onChange={e => setFilter({...filter, section: e.target.value})} />

            <button className="action" onClick={viewAttendance}>Filter</button>

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