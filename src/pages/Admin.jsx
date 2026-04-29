import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [page, setPage] = useState("home");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [deptInput, setDeptInput] = useState("");

  const [account, setAccount] = useState({
    type: "",
    name: "",
    dept: "",
    email: "",
    pass: "",
  });

  const [settings, setSettings] = useState({
    email: "",
    oldPass: "",
    newPass: "",
  });

  // ✅ FILTER STATE
  const [filter, setFilter] = useState({
    role: "",
    dept: "",
  });

  // ================= AUTH =================
  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
      alert("Access denied. Please login as admin.");
      navigate("/");
    }

    loadData();
  }, []);

  const loadData = () => {
    setDepartments(JSON.parse(localStorage.getItem("departments")) || []);
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // ================= FUNCTIONS =================

  const addDepartment = () => {
    if (!deptInput.trim()) return alert("Enter department");

    let data = [...departments, deptInput];
    localStorage.setItem("departments", JSON.stringify(data));

    setDeptInput("");
    loadData();
    alert("Department Added");
  };

  const createAccount = () => {
    const { type, name, dept, email, pass } = account;

    if (!type || !name || !dept || !email || !pass)
      return alert("Fill all fields");

    let newUser = {
      name,
      email,
      password: pass,
      role:
        type === "students"
          ? "student"
          : type === "staff"
          ? "faculty"
          : "hod",
      department: dept,
    };

    let data = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(data));

    alert("Account Created");
    loadData();
  };

  // ✅ FIXED DELETE FUNCTION
  const deleteUser = (email) => {
    if (!window.confirm("Delete this account?")) return;

    let updated = users.filter((u) => u.email !== email);

    localStorage.setItem("users", JSON.stringify(updated));
    loadData();
  };

  const changePassword = () => {
    let data = [...users];
    let user = data.find((u) => u.email === settings.email);

    if (!user) return alert("User not found");

    if (settings.oldPass && user.password !== settings.oldPass)
      return alert("Old password incorrect");

    user.password = settings.newPass;
    localStorage.setItem("users", JSON.stringify(data));

    alert("Password Updated");
  };

  // ================= FILTER =================
  const filteredUsers = users.filter((u) => {
    return (
      (filter.role === "" || u.role === filter.role) &&
      (filter.dept === "" || u.department === filter.dept)
    );
  });

  // ================= COUNTS =================
  const deptCount = departments.length;
  const studentCount = users.filter((u) => u.role === "student").length;
  const staffCount = users.filter((u) => u.role === "faculty").length;
  const hodCount = users.filter((u) => u.role === "hod").length;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setPage("home")}>Dashboard</li>
          <li onClick={() => setPage("department")}>Add Department</li>
          <li onClick={() => setPage("account")}>Create Account</li>
          <li onClick={() => setPage("view")}>View Accounts</li>
          <li onClick={() => setPage("settings")}>Settings</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* DASHBOARD */}
        {page === "home" && (
          <div className="module dashboard-bg">
            <h2>Dashboard</h2>

            <div className="cards">
              <div className="card">Departments ({deptCount})</div>
              <div className="card">Students ({studentCount})</div>
              <div className="card">Staff ({staffCount})</div>
              <div className="card">HODs ({hodCount})</div>
            </div>
          </div>
        )}

        {/* ADD DEPARTMENT */}
        {page === "department" && (
          <div className="module department-bg">
            <h2>Add Department</h2>

            <input
              value={deptInput}
              onChange={(e) => setDeptInput(e.target.value)}
              placeholder="Department Name"
            />

            <button onClick={addDepartment}>Add</button>
          </div>
        )}

        {/* CREATE ACCOUNT */}
        {page === "account" && (
          <div className="module account-bg">
            <h2>Create Account</h2>

            <select
              onChange={(e) =>
                setAccount({ ...account, type: e.target.value })
              }
            >
              <option value="">Select Type</option>
              <option value="students">Student</option>
              <option value="staff">Staff</option>
              <option value="hods">HOD</option>
            </select>

            <input
              placeholder="Name"
              onChange={(e) =>
                setAccount({ ...account, name: e.target.value })
              }
            />

            <select
              onChange={(e) =>
                setAccount({ ...account, dept: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              placeholder="Email"
              onChange={(e) =>
                setAccount({ ...account, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setAccount({ ...account, pass: e.target.value })
              }
            />

            <button onClick={createAccount}>Create Account</button>
          </div>
        )}

        {/* VIEW ACCOUNTS */}
        {page === "view" && (
          <div className="module account-bg">
            <h2>View Accounts</h2>

            {/* FILTERS */}
            <div style={{ marginBottom: "20px" }}>
              <select
                onChange={(e) =>
                  setFilter({ ...filter, role: e.target.value })
                }
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="hod">HOD</option>
              </select>

              <select
                onChange={(e) =>
                  setFilter({ ...filter, dept: e.target.value })
                }
              >
                <option value="">All Departments</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.department}</td>
                      <td>
                        <button onClick={() => deleteUser(u.email)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS */}
        {page === "settings" && (
          <div className="module settings-bg">
            <h2>Change Password</h2>

            <input
              placeholder="Email"
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) =>
                setSettings({ ...settings, oldPass: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setSettings({ ...settings, newPass: e.target.value })
              }
            />

            <button onClick={changePassword}>
              Update Password
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;