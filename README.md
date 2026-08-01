# Clinic Booking System — Frontend

React (Vite) frontend for a clinic appointment booking system.
The backend lives in a separate repository: clinic-booking-backend.
Run the backend first — this app calls it directly over HTTP.

## Local development (fast iteration)

```
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173. Make sure the backend is running at the URL set
in `.env` (defaults to http://localhost:8000/api/v1).

## Local development (via Docker, closer to production)

```
docker compose up --build
```
This builds the production bundle and serves it with Nginx on
http://localhost:5173, pointing at the backend URL baked in at
`docker-compose.yml`'s `VITE_API_URL` build arg.

## Project layout

```
src/
  api/          -> axios client (with auto token refresh) + endpoint wrappers
  context/      -> AuthContext (login/register/logout, current user)
  components/   -> Navbar, ProtectedRoute
  pages/        -> Login, Register, Doctors, DoctorSlots, MyReservations, DoctorDashboard
  styles/       -> global.css (design tokens: colors, radii, type)
Dockerfile    -> multi-stage build (Node build -> Nginx runtime)
nginx.conf    -> serves the SPA (client-side routing fallback)
```

## Configuring the backend URL

`VITE_API_URL` is baked into the build at build time (Vite convention).
- Local dev (`npm run dev`): read from `.env`
- Docker build: passed as a build arg, e.g.
  ```
  docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 .
  ```
Rebuild the image whenever the backend URL changes — it is not a runtime
environment variable.

## Roles

- `patient` — registers, books/cancels appointment slots
- `doctor` — logs in with an account created by an admin, manages their own slots
  from the doctor dashboard

## Next steps

- Kubernetes manifests
- Deployment to Arvan Cloud (Container Registry + Cloud Container)
