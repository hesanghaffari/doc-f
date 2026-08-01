import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doctorsApi } from "../api/endpoints";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDoctors(filter) {
    setLoading(true);
    setError("");
    try {
      const data = await doctorsApi.list(filter || undefined);
      setDoctors(data);
    } catch {
      setError("دریافت لیست پزشکان با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  function handleFilterSubmit(e) {
    e.preventDefault();
    loadDoctors(specialty);
  }

  return (
    <div className="page">
      <h1>لیست پزشکان</h1>
      <p>یک پزشک را انتخاب کنید تا نوبت‌های خالی او را ببینید.</p>

      <form onSubmit={handleFilterSubmit} className="row" style={{ marginBottom: 24 }}>
        <input
          placeholder="جستجو بر اساس تخصص، مثلا قلب"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
        <button type="submit" className="btn btn-outline">
          جستجو
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : doctors.length === 0 ? (
        <div className="empty-state card">پزشکی با این مشخصات پیدا نشد.</div>
      ) : (
        <div className="stack">
          {doctors.map((doctor) => (
            <Link key={doctor.id} to={`/doctors/${doctor.id}`} className="card row-between">
              <div>
                <h2 style={{ marginBottom: 4 }}>دکتر {doctor.user.full_name}</h2>
                <p style={{ margin: 0 }}>{doctor.specialty}</p>
              </div>
              <span className="btn btn-primary">مشاهده نوبت‌ها</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
