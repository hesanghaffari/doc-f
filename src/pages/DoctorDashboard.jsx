import { useEffect, useState } from "react";
import { doctorsApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const statusLabels = {
  available: "خالی",
  booked: "رزرو شده",
  cancelled: "لغو شده",
};

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatSlot(isoString) {
  return new Date(isoString).toLocaleString("fa-IR", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DoctorDashboard() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  const defaultStart = toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000));
  const [form, setForm] = useState({ start_time: defaultStart, duration: 30 });

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const doctors = await doctorsApi.list();
      const mine = doctors.find((d) => d.user.id === user.id);
      if (!mine) {
        setError("پروفایل پزشکی برای این حساب پیدا نشد. با ادمین تماس بگیرید.");
        setLoading(false);
        return;
      }
      setDoctorProfile(mine);
      const slotsData = await doctorsApi.listSlots(mine.id, false);
      setSlots(slotsData);
    } catch {
      setError("دریافت اطلاعات با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateSlot(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);
    try {
      const start = new Date(form.start_time);
      const end = new Date(start.getTime() + Number(form.duration) * 60 * 1000);
      await doctorsApi.createSlot(doctorProfile.id, {
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
      setSuccess("نوبت جدید ثبت شد.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "ثبت نوبت با خطا مواجه شد.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <div className="page">در حال بارگذاری...</div>;
  }

  return (
    <div className="page">
      <h1>پنل پزشک</h1>
      <p>نوبت‌های خالی جدید برای بیماران ثبت کنید و وضعیت نوبت‌های قبلی را ببینید.</p>

      {error && <div className="alert-error">{error}</div>}
      {success && (
        <div
          className="card"
          style={{ background: "rgba(47,122,82,0.08)", borderColor: "rgba(47,122,82,0.3)", marginBottom: 16 }}
        >
          {success}
        </div>
      )}

      {doctorProfile && (
        <>
          <form onSubmit={handleCreateSlot} className="card" style={{ marginBottom: 24 }}>
            <h2>افزودن نوبت جدید</h2>
            <div className="field">
              <label>تاریخ و ساعت شروع</label>
              <input
                type="datetime-local"
                required
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div className="field">
              <label>مدت زمان (دقیقه)</label>
              <input
                type="number"
                min={10}
                step={5}
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? "در حال ثبت..." : "ثبت نوبت"}
            </button>
          </form>

          <h2>نوبت‌های ثبت‌شده</h2>
          {slots.length === 0 ? (
            <div className="empty-state card">هنوز نوبتی ثبت نکرده‌اید.</div>
          ) : (
            <div className="stack">
              {slots.map((slot) => (
                <div key={slot.id} className="card row-between">
                  <span>{formatSlot(slot.start_time)}</span>
                  <span className={`badge ${slot.status === "available" ? "badge-available" : "badge-booked"}`}>
                    {statusLabels[slot.status] || slot.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
