# --- build stage ---
FROM node:20-slim AS builder

WORKDIR /build
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# The backend's URL is baked in at build time. Override it at build time:
#   docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 .
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- runtime stage ---
FROM nginx:1.27-alpine

COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
