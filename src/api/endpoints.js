import { client, setTokens, clearTokens } from "./client";

export const authApi = {
  async register({ full_name, email, phone_number, password }) {
    const { data } = await client.post("/auth/register", {
      full_name,
      email,
      phone_number: phone_number || null,
      password,
      role: "patient",
    });
    return data;
  },

  async login({ email, password }) {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const { data } = await client.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    setTokens(data);
    return data;
  },

  logout() {
    clearTokens();
  },

  async me() {
    const { data } = await client.get("/users/me");
    return data;
  },
};

export const doctorsApi = {
  async list(specialty) {
    const { data } = await client.get("/doctors", {
      params: specialty ? { specialty } : {},
    });
    return data;
  },

  async get(doctorId) {
    const { data } = await client.get(`/doctors/${doctorId}`);
    return data;
  },

  async listSlots(doctorId, onlyAvailable = true) {
    const { data } = await client.get(`/doctors/${doctorId}/slots`, {
      params: { only_available: onlyAvailable },
    });
    return data;
  },

  async createSlot(doctorId, { start_time, end_time }) {
    const { data } = await client.post(`/doctors/${doctorId}/slots`, {
      start_time,
      end_time,
    });
    return data;
  },
};

export const reservationsApi = {
  async bookSlot({ slot_id, reason }) {
    const { data } = await client.post("/reservations", { slot_id, reason });
    return data;
  },

  async myReservations() {
    const { data } = await client.get("/reservations/me");
    return data;
  },

  async cancel(reservationId) {
    await client.delete(`/reservations/${reservationId}`);
  },
};
