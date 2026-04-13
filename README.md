# Smart Women Safety System

Full-stack safety web application for emergency response with real-time location sharing.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT

## Project Structure

```text
HerGUARDIAN/
  backend/
    server.js
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      api/
      components/
      context/
      pages/
```

## Features Implemented

- User signup/login with encrypted passwords and JWT
- Protected dashboard with user safety status
- Large SOS button to trigger emergency alerts
- GPS capture from browser and map view using Leaflet
- Emergency contacts CRUD
- Incident history tracking
- Basic risk indicator (Low/Medium/High)

## Backend API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/contacts`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `POST /api/sos/trigger`
- `GET /api/sos/incidents`

## Run Locally

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5000`.
