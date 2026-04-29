import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import Hod from "./pages/Hod";
import Student from "./pages/Student";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <Faculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod"
          element={
            <ProtectedRoute role="hod">
              <Hod />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <Student />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;