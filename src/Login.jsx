import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "admin"
  });

  const login = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === form.email);

    if (user) {
      if (user.password !== form.password || user.role !== form.role) {
        alert("Wrong password or role");
        return;
      }
    } else {
      // auto create user
      user = { ...form };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    // 🔥 send role to App
    onLogin(user.role);
  };

  return (
    <div className="login-page">
      <div className="box">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
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