import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorsApi, reservationsApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

function formatSlot(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("fa-IR", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DoctorSlots() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [doctorData, slotsData] = await Promise.all([
        doctorsApi.get(doctorId),
        doctorsApi.listSlots(doctorId, true),
      ]);
      setDoctor(doctorData);
      setSlots(slotsData);
    } catch {
      setError("دریافت اطلاعات پزشک با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  async function handleBook(slotId) {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingSlotId(slotId);
    setError("");
    setSuccess("");
    try {
      await reservationsApi.bookSlot({ slot_id: slotId });
      setSuccess("نوبت با موفقیت رزرو شد.");
      await loadData();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("این نوبت همین الان توسط شخص دیگری رزرو شد. لطفا نوبت دیگری انتخاب کنید.");
        await loadData();
      } else {
        setError("رزرو نوبت با خطا مواجه شد.");
      }
    } finally {
      setBookingSlotId(null);
    }
  }

  if (loading) {
    return <div className="page">در حال بارگذاری...</div>;
  }

  if (!doctor) {
    return <div className="page">پزشک پیدا نشد.</div>;
  }

  return (
    <div className="page">
      <h1>دکتر {doctor.user.full_name}</h1>
      <p>{doctor.specialty}</p>
      {doctor.bio && <p>{doctor.bio}</p>}
      {doctor.clinic_address && (
        <p style={{ fontSize: 14 }}>آدرس مطب: {doctor.clinic_address}</p>
      )}

      <h2 style={{ marginTop: 24 }}>نوبت‌های خالی</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && (
        <div
          className="card"
          style={{ background: "rgba(47,122,82,0.08)", borderColor: "rgba(47,122,82,0.3)", marginBottom: 16 }}
        >
          {success}
        </div>
      )}

      {slots.length === 0 ? (
        <div className="empty-state card">در حال حاضر نوبت خالی برای این پزشک ثبت نشده است.</div>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => (
            <button
              key={slot.id}
              className="slot-pill"
              disabled={bookingSlotId === slot.id}
              onClick={() => handleBook(slot.id)}
            >
              {bookingSlotId === slot.id ? "در حال رزرو..." : formatSlot(slot.start_time)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
