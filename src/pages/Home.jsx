import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const login = () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    // ✅ ADMIN LOGIN (STRICT)
    if (role === "admin") {
      if (email === "admin" && password === "admin123") {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ email, role: "admin" })
        );
        navigate("/admin");
      } else {
        alert("Invalid admin credentials");
      }
      return;
    }

    // ✅ OTHER ROLES (OPEN LOGIN)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ email, role })
    );

    if (role === "hod") navigate("/hod");
    else if (role === "faculty") navigate("/faculty");
    else navigate("/student");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login to SAM'S</h2>

        <input
          placeholder="Username / Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECT */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="hod">HOD</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Home;