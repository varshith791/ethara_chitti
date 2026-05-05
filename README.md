# Team Task Manager

A full-stack productivity application for teams to manage projects, tasks, comments, and activity logs with role-based access control.

## Features

- JWT authentication with Admin and Member roles
- Project management with team member assignment
- Task management with status tracking, due dates, and assignment
- Task comments and activity timeline
- Dashboard with statistics for tasks and projects
- Role-based access control and protected routes
- Responsive user interface with Tailwind CSS
- PostgreSQL database with Sequelize ORM

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Axios
- **Backend**: Node.js + Express + Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render (backend), Vercel (frontend)

## Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Folder Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Comment.js
│   │   ├── Activity.js
│   │   └── index.js          # Model associations
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Application entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── services/          # API service functions
    │   ├── context/           # React context providers
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example           # Environment variables template
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     JWT_SECRET=your_jwt_secret_key_here
     PORT=5000
     NODE_ENV=development
     ```

4. Ensure PostgreSQL is running and the database exists

5. Start the development server:
   ```
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL in `.env`:
     ```
     VITE_API_URL=http://localhost:5000
     ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend application will be available at `http://localhost:5173`

## Database Setup

The application uses Sequelize ORM with PostgreSQL. The database tables are automatically created when the server starts.

### Database Tables

- **users**: User accounts with authentication
- **projects**: Project information and metadata
- **project_members**: Many-to-many relationship between projects and users
- **tasks**: Task details and assignments
- **comments**: Task comments
- **activities**: Task activity logs

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (Admin only)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (Admin only)
- `POST /api/projects/:projectId/add-member` - Add member to project (Admin only)
- `DELETE /api/projects/:projectId/members` - Remove member from project (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/:id/activity` - Get task activity

### Comments
- `GET /api/comments/task/:taskId` - Get task comments
- `POST /api/comments` - Add comment to task

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## User Roles

### Admin
- Full access to all features
- Can create projects and tasks
- Can manage project members
- Can view all users

### Member
- Can view assigned projects and tasks
- Can update task status
- Can add comments to tasks
- Limited to projects they are members of

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Set the root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL

## Usage

1. Register an admin account
2. Create projects
3. Add team members to projects
4. Create tasks and assign them to project members
5. Members can update task status and add comments
6. View dashboard for project and task statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
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
