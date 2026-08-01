import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "ورود ناموفق بود. ایمیل یا رمز عبور را بررسی کنید."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h1>ورود به حساب</h1>
      <p>برای رزرو نوبت وارد حساب کاربری خود شوید.</p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>ایمیل</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label>رمز عبور</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        حساب ندارید؟ <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>ثبت‌نام کنید</Link>
      </p>
    </div>
  );
}
