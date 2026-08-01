import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "ثبت‌نام ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h1>ساخت حساب کاربری</h1>
      <p>به‌عنوان بیمار ثبت‌نام کنید تا بتوانید نوبت رزرو کنید.</p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>نام و نام خانوادگی</label>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
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
          <label>شماره موبایل (اختیاری)</label>
          <input
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          />
        </div>
        <div className="field">
          <label>رمز عبور</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        قبلا ثبت‌نام کرده‌اید؟ <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>وارد شوید</Link>
      </p>
    </div>
  );
}
