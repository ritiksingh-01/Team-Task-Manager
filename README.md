# Team Task Manager

![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb&logoColor=white)

Team Task Manager is a full-stack project and task management app. It uses JWT authentication and role-based access control (RBAC) enforced on the backend to manage what users can see and do.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Live Demo](#live-demo)

## Features

- User signup and login with hashed passwords (bcrypt)
- Two user roles: `Admin` and `Member`
- Admin dashboard to create projects, add team members, and assign tasks
- Member view restricted to assigned projects and tasks
- Task status updates (To Do, In Progress, Done) with backend authorization
- Dashboard showing total, completed, and overdue tasks

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt

## Project Structure

```text
client/                 # React frontend
  src/
    components/         # Reusable UI components
    context/            # React context
    pages/              # Main views
    services/           # API calls
    utils/              # Helpers
server/                 # Node.js backend
  config/               # DB and app config
  controllers/          # Route logic
  middleware/           # Auth and error handling
  models/               # Mongoose schemas
  routes/               # API endpoints
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

### Local Setup

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Set up backend environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
   JWT_SECRET=your_jwt_secret_here
   CLIENT_URL=http://localhost:5173
   ```

3. Set up frontend environment variables in `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run the development servers:
   ```bash
   npm run dev
   ```
   *The frontend starts on `http://localhost:5173` and the backend on `http://localhost:5000`.*

## Deployment

### Backend (Railway)

1. Create a project on Railway and add a MongoDB service.
2. Deploy the `server` directory.
3. Add your environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
4. Set the start command to `npm start`.

### Frontend (Vercel / Railway)

1. Deploy the `client` directory.
2. Add `VITE_API_URL` to your build settings (pointing to your deployed backend API).
3. Make sure the backend `CLIENT_URL` matches your deployed frontend URL to prevent CORS errors.

## Live Demo

- **Live URL:** [Team Task Manager Live Demo](https://team-task-manager-green-sigma.vercel.app/auth)

## License

MIT