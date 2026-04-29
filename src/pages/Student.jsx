import { useRef, useState, useEffect } from "react";
import "../styles/Student.css";

function Student() {
  const [section, setSection] = useState("view");

  const [attendance] = useState(
    JSON.parse(localStorage.getItem("attendance")) || []
  );

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [departments, setDepartments] = useState([]);

  const canvasRef = useRef(null);

  const [filteredData, setFilteredData] = useState([]);
  const [percent, setPercent] = useState("");

  const [filter, setFilter] = useState({
    name: "",
    department: "",
    section: "",
    from: "",
    to: "",
  });

  // ✅ LOAD DEPARTMENTS FROM ADMIN
  useEffect(() => {
    let depts = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(depts);
  }, []);

  // ================= VIEW =================
  const viewAttendance = () => {
    let data = attendance.filter((a) => {
      return (
        (filter.name === "" || a.name === filter.name) &&
        (filter.department === "" || a.department === filter.department) &&
        (filter.section === "" || a.section === filter.section) &&
        (!filter.from || a.date >= filter.from) &&
        (!filter.to || a.date <= filter.to)
      );
    });

    let present = data.filter((a) => a.status === "Present").length;

    let percentage = data.length
      ? (present / data.length) * 100
      : 0;

    setFilteredData(data);
    setPercent("Attendance %: " + percentage.toFixed(2) + "%");

    drawGraph(present, data.length - present);
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

    ctx.fillStyle = "black";
    ctx.fillText("Present", 80, 195);
    ctx.fillText("Absent", 200, 195);
  };

  // ================= DOWNLOAD =================
  const downloadReport = () => {
    if (filteredData.length === 0) {
      alert("No data to download");
      return;
    }

    let csv = "Name,Department,Section,Date,Status\n";

    filteredData.forEach((a) => {
      csv += `${a.name},${a.department},${a.section},${a.date},${a.status}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
  };

  // ================= RESET =================
  const [reset, setReset] = useState({
    email: "",
    newPass: "",
  });

  const resetPassword = () => {
    let data = [...users];
    let user = data.find((u) => u.email === reset.email);

    if (user) {
      user.password = reset.newPass;
      localStorage.setItem("users", JSON.stringify(data));
      setUsers(data);
      alert("Password Reset Successful");
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Student Panel</h2>

        <button onClick={() => setSection("view")}>
          View Attendance
        </button>

        <button onClick={() => setSection("download")}>
          Download Report
        </button>

        <button onClick={() => setSection("reset")}>
          Reset Password
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* VIEW */}
        {section === "view" && (
          <div className="section active">
            <h3>View Attendance</h3>

            <input
              placeholder="Your Name"
              onChange={(e) =>
                setFilter({ ...filter, name: e.target.value })
              }
            />

            {/* ✅ DEPARTMENT SELECT (FROM ADMIN) */}
            <select
              onChange={(e) =>
                setFilter({ ...filter, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
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

            <input
              type="date"
              onChange={(e) =>
                setFilter({ ...filter, from: e.target.value })
              }
            />

            <input
              type="date"
              onChange={(e) =>
                setFilter({ ...filter, to: e.target.value })
              }
            />

            <button className="action" onClick={viewAttendance}>
              Load Data
            </button>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((a, i) => (
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

        {/* DOWNLOAD */}
        {section === "download" && (
          <div className="section active">
            <h3>Download Attendance Report</h3>

            <button className="action" onClick={downloadReport}>
              Download CSV
            </button>
          </div>
        )}

        {/* RESET */}
        {section === "reset" && (
          <div className="section active">
            <h3>Reset Password</h3>

            <input
              placeholder="Email"
              onChange={(e) =>
                setReset({ ...reset, email: e.target.value })
              }
            />

            <input
              placeholder="New Password"
              onChange={(e) =>
                setReset({ ...reset, newPass: e.target.value })
              }
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

export default Student;