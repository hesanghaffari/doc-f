import { useEffect, useState } from "react";
import { reservationsApi } from "../api/endpoints";

const statusLabels = {
  confirmed: "تایید شده",
  cancelled: "لغو شده",
  completed: "انجام شده",
};

function formatSlot(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await reservationsApi.myReservations();
      setReservations(data);
    } catch {
      setError("دریافت نوبت‌ها با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id) {
    setCancellingId(id);
    try {
      await reservationsApi.cancel(id);
      await load();
    } catch {
      setError("لغو نوبت با خطا مواجه شد.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="page">
      <h1>نوبت‌های من</h1>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : reservations.length === 0 ? (
        <div className="empty-state card">هنوز نوبتی رزرو نکرده‌اید.</div>
      ) : (
        <div className="stack">
          {reservations.map((r) => (
            <div key={r.id} className="card row-between">
              <div>
                <div className="row" style={{ marginBottom: 6 }}>
                  <span
                    className={`badge ${r.status === "confirmed" ? "badge-available" : "badge-booked"}`}
                  >
                    {statusLabels[r.status] || r.status}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{formatSlot(r.slot.start_time)}</p>
                {r.reason && <p style={{ margin: 0, fontSize: 13 }}>دلیل مراجعه: {r.reason}</p>}
              </div>
              {r.status === "confirmed" && (
                <button
                  className="btn btn-danger"
                  disabled={cancellingId === r.id}
                  onClick={() => handleCancel(r.id)}
                >
                  {cancellingId === r.id ? "در حال لغو..." : "لغو نوبت"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
