import { useEffect, useState } from "react";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [active, setActive] = useState("view");

  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    from: "",
    to: ""
  });

  const [filteredData, setFilteredData] = useState([]);
  const [percentage, setPercentage] = useState(0);

  const [resetData, setResetData] = useState({
    email: "",
    newPass: ""
  });

  /* LOAD */
  useEffect(() => {
    setAttendance(JSON.parse(localStorage.getItem("attendance")) || []);
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
  }, []);

  /* VIEW ATTENDANCE */
  const viewAttendance = () => {
    const data = attendance.filter(a =>
      a.name === filters.name &&
      (!filters.from || a.date >= filters.from) &&
      (!filters.to || a.date <= filters.to)
    );

    setFilteredData(data);

    const present = data.filter(a => a.status === "Present").length;
    const percent = data.length ? (present / data.length) * 100 : 0;

    setPercentage(percent.toFixed(2));
  };

  /* DOWNLOAD CSV */
  const downloadReport = () => {
    if (filteredData.length === 0) {
      alert("No data to download");
      return;
    }

    let csv = "Name,Date,Status\n";

    filteredData.forEach(a => {
      csv += `${a.name},${a.date},${a.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  /* RESET PASSWORD */
  const resetPassword = () => {
    const updated = users.map(u => {
      if (u.email === resetData.email) {
        return { ...u, password: resetData.newPass };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
    alert("Password Reset Successful");
  };

  return (
    <div className="student-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Student Panel</h2>

        <button onClick={() => setActive("view")}>View Attendance</button>
        <button onClick={() => setActive("download")}>Download Report</button>
        <button onClick={() => setActive("reset")}>Reset Password</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* VIEW */}
        {active === "view" && (
          <div className="section active">
            <h3>View Attendance</h3>

            <input
              placeholder="Enter Your Name"
              onChange={e => setFilters({ ...filters, name: e.target.value })}
            />

            <input
              type="date"
              onChange={e => setFilters({ ...filters, from: e.target.value })}
            />

            <input
              type="date"
              onChange={e => setFilters({ ...filters, to: e.target.value })}
            />

            <button className="action" onClick={viewAttendance}>
              Load Data
            </button>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((a, i) => (
                  <tr key={i}>
                    <td>{a.name}</td>
                    <td>{a.date}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Attendance %: {percentage}%</h4>
          </div>
        )}

        {/* DOWNLOAD */}
        {active === "download" && (
          <div className="section active">
            <h3>Download Attendance Report</h3>

            <button className="action" onClick={downloadReport}>
              Download CSV
            </button>
          </div>
        )}

        {/* RESET */}
        {active === "reset" && (
          <div className="section active">
            <h3>Reset Password</h3>

            <input
              placeholder="Email"
              onChange={e => setResetData({ ...resetData, email: e.target.value })}
            />

            <input
              placeholder="New Password"
              onChange={e => setResetData({ ...resetData, newPass: e.target.value })}
            />

            <button className="action" onClick={resetPassword}>
              Reset
            </button>
          </div>
        )}

      </div>
    </div>
  );
}