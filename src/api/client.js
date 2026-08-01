import axios from "axios";

// VITE_API_URL is baked in at build time (see .env.example / Dockerfile).
// Falls back to a relative path, which works when running `npm run dev`
// with the Vite proxy (see vite.config.js).
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
});

function getTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

function setTokens({ access_token, refresh_token }) {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

client.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      const { refresh } = getTokens();
      if (!refresh) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        // Avoid firing multiple parallel refresh calls
        refreshPromise =
          refreshPromise ||
          client.post("/auth/refresh", { refresh_token: refresh });
        const { data } = await refreshPromise;
        refreshPromise = null;
        setTokens(data);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { client, getTokens, setTokens };
