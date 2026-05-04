# Team Task Manager

A full stack productivity application for teams to manage projects, tasks, comments, and activity logs.

## Features

- JWT authentication with Admin/Member roles
- Project management with team assignment
- Task management with status, due date, edit/delete actions
- Task comments and activity timeline
- Dashboard summaries for total, completed, pending, and overdue tasks
- Role-based access control and protected routes
- Responsive UI with Tailwind CSS

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- Deployment: Render (backend), Vercel (frontend)

## Folder Structure

- `backend/`
  - `models/`
  - `controllers/`
  - `routes/`
  - `middleware/`
  - `config/`
- `frontend/`
  - `src/components/`
  - `src/pages/`
  - `src/services/`
  - `src/context/`

## Setup Instructions

### Backend

1. Navigate to `backend/`
2. Copy `.env.example` to `.env`
3. Install dependencies: `npm install`
4. Start server: `npm run dev`

### Frontend

1. Navigate to `frontend/`
2. Copy `.env.example` to `.env`
3. Install dependencies: `npm install`
4. Start app: `npm run dev`

## Environment Variables

### Backend `.env`

```
MONGO_URI=<your mongodb uri>
JWT_SECRET=<your jwt secret>
PORT=5000
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- Backend: Render
- Frontend: Vercel

Add your deployment URLs to the frontend `.env` file and backend Render environment variables.
