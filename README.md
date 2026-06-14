# Campus Resell Portal

Campus Resell Portal is a MERN stack project built for students to buy and sell second-hand items inside a university campus. Students can list things like books, cycles, electronics, furniture, stationery, and hostel items so other students can find them easily.

The project includes authentication, product listing, wishlist, chat, notifications, ratings, analytics, and admin features.

## Live Links

Frontend:

```text
https://individual-project-nine-gules.vercel.app/
```

Backend:

```text
https://individualproject-2b0a.onrender.com
```

## Tech Stack

- React, Vite, Tailwind CSS
- Node.js, Express.js
- MongoDB, Mongoose
- JWT authentication
- Socket.io for real-time chat and notifications
- Recharts for analytics
- Vercel and Render for deployment

## Features

- Student signup and login
- Product upload with image, price, category, condition, and pickup location
- Search and filter products
- Wishlist
- Real-time chat between buyer and seller
- Real-time notifications
- Ratings and product reports
- Admin dashboard
- AI price and description suggestions

## Project Structure

```text
UniCycle/
  frontend/   React frontend
  backend/    Express and MongoDB backend
```

## Setup

Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Environment Variables

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus-resell
JWT_SECRET=replace_with_a_long_random_secret
UNI_EMAIL_DOMAIN=@anurag.edu
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
OPENAI_API_KEY=
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

For deployed frontend, Vercel uses:

```env
VITE_API_URL=https://individualproject-2b0a.onrender.com
VITE_SOCKET_URL=https://individualproject-2b0a.onrender.com
```

For deployed backend, Render uses:

```env
CLIENT_URL=https://individual-project-nine-gules.vercel.app
```

## Demo Data

To add demo data:

```bash
cd backend
npm run seed
```

Demo admin login:

```text
admin@anurag.edu / password123
```

## Deployment

The frontend is deployed on Vercel from the `frontend` folder. The backend is deployed on Render, and MongoDB can be local or hosted on MongoDB Atlas.

## What I Learned

Through this project, I learned how to connect a React frontend with an Express backend, use MongoDB with Mongoose, handle authentication, upload files, work with real-time features using Socket.io, and deploy a full-stack project.
