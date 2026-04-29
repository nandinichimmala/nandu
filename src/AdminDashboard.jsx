import { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("home");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [deptInput, setDeptInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");

  const [account, setAccount] = useState({
    type: "",
    name: "",
    dept: "",
    email: "",
    pass: ""
  });

  const [assignData, setAssignData] = useState({
    staff: "",
    subject: ""
  });

  const [passwordData, setPasswordData] = useState({
    email: "",
    oldPass: "",
    newPass: ""
  });

  /* LOAD DATA */
  useEffect(() => {
    setDepartments(JSON.parse(localStorage.getItem("departments")) || []);
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setSubjects(JSON.parse(localStorage.getItem("subjects")) || []);
    setAssignments(JSON.parse(localStorage.getItem("assignments")) || []);
  }, []);

  /* SAVE HELPERS */
  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  /* DEPARTMENT */
  const addDepartment = () => {
    if (!deptInput) return alert("Enter department");
    const updated = [...departments, deptInput];
    setDepartments(updated);
    save("departments", updated);
    setDeptInput("");
  };

  /* ACCOUNT */
  const createAccount = () => {
    const { type, name, dept, email, pass } = account;
    if (!type || !name || !dept || !email || !pass) {
      return alert("Fill all fields");
    }

    const role =
      type === "students" ? "student" :
      type === "staff" ? "faculty" : "hod";

    const updated = [...users, { name, email, password: pass, role, department: dept }];
    setUsers(updated);
    save("users", updated);

    alert("Account Created");
  };

  /* SUBJECT */
  const addSubject = () => {
    if (!subjectInput) return alert("Enter subject");
    const updated = [...subjects, subjectInput];
    setSubjects(updated);
    save("subjects", updated);
    setSubjectInput("");
  };

  /* ASSIGN */
  const assignSubject = () => {
    const updated = [...assignments, assignData];
    setAssignments(updated);
    save("assignments", updated);
  };

  const deleteAssignment = (index) => {
    const updated = assignments.filter((_, i) => i !== index);
    setAssignments(updated);
    save("assignments", updated);
  };

  /* PASSWORD */
  const changePassword = () => {
    const updated = users.map((u) => {
      if (u.email === passwordData.email) {
        if (u.password !== passwordData.oldPass) {
          alert("Wrong password");
          return u;
        }
        return { ...u, password: passwordData.newPass };
      }
      return u;
    });

    setUsers(updated);
    save("users", updated);
    alert("Updated");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActivePage("home")}>Dashboard</li>
          <li onClick={() => setActivePage("department")}>Add Department</li>
          <li onClick={() => setActivePage("account")}>Create Account</li>
          <li onClick={() => setActivePage("subject")}>Create Subject</li>
          <li onClick={() => setActivePage("assign")}>Assign Subject</li>
          <li onClick={() => setActivePage("settings")}>Settings</li>
        </ul>
      </div>

      <div className="content">

        {/* DASHBOARD */}
        {activePage === "home" && (
          <div className="module dashboard-bg">
            <h2>Dashboard</h2>
            <div className="cards">
              <div className="card">Departments ({departments.length})</div>
              <div className="card">
                Students ({users.filter(u => u.role === "student").length})
              </div>
              <div className="card">
                Staff ({users.filter(u => u.role === "faculty").length})
              </div>
              <div className="card">
                HODs ({users.filter(u => u.role === "hod").length})
              </div>
              <div className="card">Subjects ({subjects.length})</div>
            </div>
          </div>
        )}

        {/* DEPARTMENT */}
        {activePage === "department" && (
          <div className="module department-bg">
            <h2>Add Department</h2>
            <input value={deptInput} onChange={e => setDeptInput(e.target.value)} />
            <button onClick={addDepartment}>Add</button>
          </div>
        )}

        {/* ACCOUNT */}
        {activePage === "account" && (
          <div className="module account-bg">
            <h2>Create Account</h2>

            <select onChange={e => setAccount({...account, type: e.target.value})}>
              <option value="">Select Type</option>
              <option value="students">Student</option>
              <option value="staff">Staff</option>
              <option value="hods">HOD</option>
            </select>

            <input placeholder="Name"
              onChange={e => setAccount({...account, name: e.target.value})} />

            <select onChange={e => setAccount({...account, dept: e.target.value})}>
              <option>Select Department</option>
              {departments.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <input placeholder="Email"
              onChange={e => setAccount({...account, email: e.target.value})} />

            <input type="password" placeholder="Password"
              onChange={e => setAccount({...account, pass: e.target.value})} />

            <button onClick={createAccount}>Create</button>
          </div>
        )}

        {/* SUBJECT */}
        {activePage === "subject" && (
          <div className="module subject-bg">
            <h2>Create Subject</h2>
            <input value={subjectInput} onChange={e => setSubjectInput(e.target.value)} />
            <button onClick={addSubject}>Add</button>
          </div>
        )}

        {/* ASSIGN */}
        {activePage === "assign" && (
          <div className="module assign-bg">
            <h2>Assign Subject</h2>

            <select onChange={e => setAssignData({...assignData, staff: e.target.value})}>
              {users.filter(u => u.role === "faculty").map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>

            <select onChange={e => setAssignData({...assignData, subject: e.target.value})}>
              {subjects.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>

            <button onClick={assignSubject}>Assign</button>

            {assignments.map((a, i) => (
              <p key={i}>
                {a.staff} → {a.subject}
                <button onClick={() => deleteAssignment(i)}>Delete</button>
              </p>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activePage === "settings" && (
          <div className="module settings-bg">
            <h2>Change Password</h2>

            <input placeholder="Email"
              onChange={e => setPasswordData({...passwordData, email: e.target.value})} />

            <input type="password" placeholder="Old Password"
              onChange={e => setPasswordData({...passwordData, oldPass: e.target.value})} />

            <input type="password" placeholder="New Password"
              onChange={e => setPasswordData({...passwordData, newPass: e.target.value})} />

            <button onClick={changePassword}>Update</button>
          </div>
        )}

      </div>
    </div>
  );
}