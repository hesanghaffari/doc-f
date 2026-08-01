import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="page"
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Link to="/" style={{ fontWeight: 800, fontSize: 18, color: "var(--color-primary-dark)" }}>
          درمانگاه آنلاین
        </Link>
        <nav className="row">
          <Link to="/">پزشکان</Link>
          {user?.role === "patient" && <Link to="/reservations">نوبت‌های من</Link>}
          {user?.role === "doctor" && <Link to="/doctor-dashboard">پنل پزشک</Link>}
          {user ? (
            <>
              <span style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{user.full_name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                ورود
              </Link>
              <Link to="/register" className="btn btn-primary">
                ثبت‌نام
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
