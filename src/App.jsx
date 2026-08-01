import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Doctors } from "./pages/Doctors";
import { DoctorSlots } from "./pages/DoctorSlots";
import { MyReservations } from "./pages/MyReservations";
import { DoctorDashboard } from "./pages/DoctorDashboard";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors/:doctorId" element={<DoctorSlots />} />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
