import { useRef, useState, useEffect } from "react";
import "../styles/HOD.css";

function HOD() {
  const [section, setSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [departments, setDepartments] = useState([]);

  const canvasRef = useRef(null);

  // ================= LOAD =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setAttendance(JSON.parse(localStorage.getItem("attendance")) || []);
    setDepartments(JSON.parse(localStorage.getItem("departments")) || []);
  };

  // ================= ADD DEPARTMENT =================
  const [deptInput, setDeptInput] = useState("");

  const addDepartment = () => {
    if (!deptInput.trim()) return alert("Enter department");

    let data = [...departments, deptInput];
    localStorage.setItem("departments", JSON.stringify(data));

    setDeptInput("");
    loadData();
  };

  // ================= CREATE ACCOUNT =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "",
    section: ""
  });

  const createUser = () => {
    if (!form.name || !form.email || !form.password || !form.department)
      return alert("Fill all fields");

    let data = [...users, form];
    localStorage.setItem("users", JSON.stringify(data));

    setForm({
      name: "",
      email: "",
      password: "",
      role: "faculty",
      department: "",
      section: ""
    });

    loadData();
  };

  const deleteUser = (index) => {
    if (!window.confirm("Delete this account?")) return;

    let data = [...users];
    data.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(data));
    loadData();
  };

  // ================= MARK ATTENDANCE =================
  const [mark, setMark] = useState({
    name: "",
    department: "",
    section: "",
    status: "Present"
  });

  const markAttendance = () => {
    if (!mark.name || !mark.department || !mark.section)
      return alert("Fill all fields");

    let newEntry = {
      ...mark,
      date: new Date().toISOString().split("T")[0]
    };

    let data = [...attendance, newEntry];
    localStorage.setItem("attendance", JSON.stringify(data));

    setMark({
      name: "",
      department: "",
      section: "",
      status: "Present"
    });

    loadData();
  };

  // ================= VIEW ATTENDANCE =================
  const [filter, setFilter] = useState({
    department: "",
    section: ""
  });

  const [viewData, setViewData] = useState([]);
  const [percent, setPercent] = useState("");

  const viewAttendance = () => {
    let filtered = attendance.filter(
      (a) =>
        (filter.department === "" || a.department === filter.department) &&
        (filter.section === "" || a.section === filter.section)
    );

    let present = filtered.filter(a => a.status === "Present").length;
    let percentage = filtered.length ? (present / filtered.length) * 100 : 0;

    setViewData(filtered);
    setPercent("Attendance %: " + percentage.toFixed(2) + "%");

    drawGraph(present, filtered.length - present);
  };

  // ================= GRAPH =================
  const drawGraph = (present, absent) => {
    let ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 400, 200);

    let total = present + absent;
    if (total === 0) return;

    let ph = (present / total) * 150;
    let ah = (absent / total) * 150;

    ctx.fillStyle = "green";
    ctx.fillRect(80, 180 - ph, 60, ph);

    ctx.fillStyle = "red";
    ctx.fillRect(200, 180 - ah, 60, ah);
  };

  // ================= ACCOUNT FILTER =================
  const [accountFilter, setAccountFilter] = useState({
    role: "",
    department: ""
  });

  const filteredUsers = users.filter(
    (u) =>
      (accountFilter.role === "" || u.role === accountFilter.role) &&
      (accountFilter.department === "" || u.department === accountFilter.department)
  );

  return (
    <div className="container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>HOD Panel</h2>

        <button onClick={() => setSection("dashboard")}>Dashboard</button>
        <button onClick={() => setSection("dept")}>Add Department</button>
        <button onClick={() => setSection("create")}>Create Accounts</button>
        <button onClick={() => setSection("accounts")}>View Accounts</button>
        <button onClick={() => setSection("mark")}>Mark Attendance</button>
        <button onClick={() => setSection("view")}>View Attendance</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* DASHBOARD */}
        {section === "dashboard" && (
          <div className="section active">
            <h3>Dashboard</h3>

            <div className="cards">
              <div className="card">Departments ({departments.length})</div>
              <div className="card">
                Students ({users.filter(u => u.role === "student").length})
              </div>
              <div className="card">
                Faculty ({users.filter(u => u.role === "faculty").length})
              </div>
              <div className="card">Total Users ({users.length})</div>
            </div>
          </div>
        )}

        {/* ADD DEPARTMENT */}
        {section === "dept" && (
          <div className="section active">
            <h3>Add Department</h3>

            <input
              value={deptInput}
              placeholder="Department Name"
              onChange={(e) => setDeptInput(e.target.value)}
            />

            <button className="action" onClick={addDepartment}>
              Add
            </button>
          </div>
        )}

        {/* CREATE ACCOUNT */}
        {section === "create" && (
          <div className="section active">
            <h3>Create Account</h3>

            <input placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}/>

            <input placeholder="Email"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}/>

            <input placeholder="Password"
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}/>

            <select value={form.role}
              onChange={(e)=>setForm({...form,role:e.target.value})}>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <select value={form.department}
              onChange={(e)=>setForm({...form,department:e.target.value})}>
              <option value="">Select Department</option>
              {departments.map((d,i)=>(
                <option key={i}>{d}</option>
              ))}
            </select>

            <input placeholder="Section"
              value={form.section}
              onChange={(e)=>setForm({...form,section:e.target.value})}/>

            <button className="action" onClick={createUser}>Create</button>
          </div>
        )}

        {/* VIEW ACCOUNTS */}
        {section === "accounts" && (
          <div className="section active">
            <h3>View Accounts</h3>

            <select onChange={(e)=>setAccountFilter({...accountFilter,role:e.target.value})}>
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <select onChange={(e)=>setAccountFilter({...accountFilter,department:e.target.value})}>
              <option value="">All Departments</option>
              {departments.map((d,i)=>(
                <option key={i}>{d}</option>
              ))}
            </select>

            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>Dept</th><th>Section</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u,i)=>(
                  <tr key={i}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.department}</td>
                    <td>{u.section}</td>
                    <td>
                      <button className="delete" onClick={()=>deleteUser(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MARK ATTENDANCE */}
        {section === "mark" && (
          <div className="section active">
            <h3>Mark Attendance</h3>

            <input placeholder="Student Name"
              value={mark.name}
              onChange={(e)=>setMark({...mark,name:e.target.value})}/>

            <select value={mark.department}
              onChange={(e)=>setMark({...mark,department:e.target.value})}>
              <option value="">Select Department</option>
              {departments.map((d,i)=>(
                <option key={i}>{d}</option>
              ))}
            </select>

            <input placeholder="Section"
              value={mark.section}
              onChange={(e)=>setMark({...mark,section:e.target.value})}/>

            <select value={mark.status}
              onChange={(e)=>setMark({...mark,status:e.target.value})}>
              <option>Present</option>
              <option>Absent</option>
            </select>

            <button className="action" onClick={markAttendance}>
              Mark
            </button>
          </div>
        )}

        {/* VIEW ATTENDANCE */}
        {section === "view" && (
          <div className="section active">
            <h3>View Attendance</h3>

            <select onChange={(e)=>setFilter({...filter,department:e.target.value})}>
              <option value="">All Departments</option>
              {departments.map((d,i)=>(
                <option key={i}>{d}</option>
              ))}
            </select>

            <input placeholder="Section"
              onChange={(e)=>setFilter({...filter,section:e.target.value})}/>

            <button className="action" onClick={viewAttendance}>
              Filter
            </button>

            <table>
              <tbody>
                {viewData.map((a,i)=>(
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

      </div>
    </div>
  );
}

export default HOD;