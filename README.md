# Campus Resell Portal

Campus Resell Portal is a MERN marketplace for university students to buy and sell second-hand campus essentials such as books, cycles, electronics, furniture, stationery, and hostel items.

This project is being built module by module so the code stays beginner-friendly and easy to explain during reviews, internships, placements, and final-year presentations.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, Socket.io Client, Recharts
- Backend: Node.js, Express.js, Socket.io, JWT, bcrypt, Multer
- Database: MongoDB with Mongoose

## Folder Structure

```text
UniCycle/
frontend/
  src/
    components/
    context/
    pages/
    services/
  .env

backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  sockets/
  uploads/
  utils/
  .env
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus-resell
JWT_SECRET=replace_with_a_long_random_secret
UNI_EMAIL_DOMAIN=@anurag.edu
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
OPENAI_API_KEY=
```

Create `frontend/.env`:

```env
VITE_API_URL=https://individualproject-2b0a.onrender.com
VITE_SOCKET_URL=https://individualproject-2b0a.onrender.com
VITE_APP_NAME=Campus Resell Portal
```

## Setup Instructions

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

Seed demo data:

```bash
cd backend
npm run seed
```

Demo login after seeding:

```text
admin@anurag.edu / password123
```

## MongoDB Setup

For local MongoDB, keep:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus-resell
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Module Plan

1. Project setup, dependencies, folder structure, README, environment setup
2. Authentication and protected routes
3. Product listing, image upload, search, filters, pagination
4. Wishlist, reservation status, ratings
5. Real-time chat and notifications
6. AI price suggestion, description generator, and scam-risk detection
7. Analytics dashboard with Recharts
8. Admin dashboard and moderation controls
9. Seed data and final polish
