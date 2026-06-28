# TaskFlow - Full-Stack Task Management Workspace 

----------

# Overview

TaskFlow is a production-ready full-stack task management platform built with React, Node.js, Express.js, MySQL, and Sequelize ORM.

Users can securely register, manage tasks, track progress, search and organize work, view productivity statistics, and monitor recent activity through a modern SaaS-style dashboard.

The project showcases real-world full-stack engineering practices, including JWT authentication, RESTful APIs, request validation, automated testing, Swagger API documentation, and cloud deployment.

----------

# Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend | [https://taskflow-project-management-ten.vercel.app](https://taskflow-project-management-ten.vercel.app/) |
| ⚙️ Backend API | [https://taskflow-project-management.onrender.com](https://taskflow-project-management.onrender.com/) |
| 📖 Swagger Documentation | [https://taskflow-project-management.onrender.com/api-docs](https://taskflow-project-management.onrender.com/api-docs) |
| 💻 GitHub Repository | [https://github.com/Jai7525/taskflow-project-management](https://github.com/Jai7525/taskflow-project-management) |

----------

# Highlights

- Secure JWT Authentication
- Complete Task Lifecycle Management (CRUD)
- Responsive SaaS Workspace
- Productivity Dashboard
- Weekly Timeline Planner
- Search, Filter & Sorting
- Activity Logging
- Protected REST APIs
- Swagger API Documentation
- Automated Backend Testing
- Production Deployment (Vercel + Render + Aiven MySQL)

----------

# Screenshots

## Login

Secure JWT-based authentication with responsive SaaS interface.

<img width="1896" height="1035" alt="Image" src="https://github.com/user-attachments/assets/d953de0c-6cf7-443f-9505-331fe2f28f80" />

----------

## Dashboard

Modern productivity dashboard featuring workspace statistics, timeline planning, and task overview.

<img width="1906" height="846" alt="Image" src="https://github.com/user-attachments/assets/b973d699-0525-45f6-bf1a-9be328d6c715" />

----------

## Task Board & Activity Log

Kanban-style task management with Pending, In Progress, Completed workflows and recent activity tracking.

<img width="1900" height="1037" alt="Image" src="https://github.com/user-attachments/assets/61e7059e-a117-4f2d-acb0-72f5476620f3" />

----------

## Create Task

Create and organize tasks with priority, due date, and status management.

<img width="1918" height="1028" alt="Image" src="https://github.com/user-attachments/assets/e9463338-2378-4417-8669-74c6839b3922" />

----------

## Swagger API Documentation

Interactive OpenAPI documentation for testing and exploring backend REST APIs.

<img width="1896" height="1035" alt="Image" src="https://github.com/user-attachments/assets/f5a1d4a5-dfad-4718-a1c2-3b3892dff979" />

----------
# Tech Stack

## Frontend

<p>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/> <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white"/>
</p>

### Backend

<p>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/express--validator-444444?style=for-the-badge"/>
</p>

### Database & ORM

<p>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white"/>
</p>

### Authentication

<p>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens"/> <img src="https://img.shields.io/badge/bcrypt-orange?style=for-the-badge"/>
</p>

### API Documentation

<p>
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/> <img src="https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge"/>
</p>

### Testing

<p>
<img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/> <img src="https://img.shields.io/badge/Supertest-222222?style=for-the-badge"/> <img src="https://img.shields.io/badge/SQLite-In--Memory-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
</p>

### Deployment

<p>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel"/> <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge"/> <img src="https://img.shields.io/badge/Aiven-FF6B35?style=for-the-badge"/>
</p>


# Architecture

TaskFlow follows a **layered architecture** that separates the user interface, business logic, data access, and persistence layers. This design improves maintainability, scalability, testing, and code organization while following production-ready backend development practices.

----------

# System Architecture

<img width="3219" height="186" alt="Image" src="https://github.com/user-attachments/assets/dd5c6537-1425-4cdc-8366-bf8f2e0cb857" />

----------

# Backend Request Flow

<img width="2642" height="210" alt="Image" src="https://github.com/user-attachments/assets/209e928e-5926-4585-90eb-9a4e3bb44e82" />

----------

# Authentication Flow

<img width="1800" height="1638" alt="Image" src="https://github.com/user-attachments/assets/25bd4b2d-1a7d-489d-b5e1-b0bc07250593" />

----------

# Project Workflow

The following workflow illustrates how a user interacts with TaskFlow throughout the application.

<img width="1521" height="1596" alt="Image" src="https://github.com/user-attachments/assets/ba5aeedb-a1de-418b-95c7-f3782dd38cee" />

----------

# Database Design

TaskFlow uses a relational MySQL database consisting of three primary entities:

- **User**
- **Task**
- **ActivityLog**

The database is designed to maintain data integrity, preserve activity history, and support efficient task management.

----------

## User Table

```text
+--------------------------------------+
|              USER TABLE              |
+--------------------------------------+
| id (UUID)              PRIMARY KEY   |
| name (VARCHAR)                      |
| email (VARCHAR)        UNIQUE        |
| password (VARCHAR)                  |
| createdAt (TIMESTAMP)               |
| updatedAt (TIMESTAMP)               |
+--------------------------------------+
```

----------

## Task Table

```text
+--------------------------------------+
|              TASK TABLE              |
+--------------------------------------+
| id (UUID)              PRIMARY KEY   |
| title (VARCHAR)                     |
| description (TEXT)                  |
| status (ENUM)                       |
| priority (ENUM)                     |
| dueDate (DATE)                      |
| userId (UUID)         FOREIGN KEY    |
| createdAt (TIMESTAMP)               |
| updatedAt (TIMESTAMP)               |
+--------------------------------------+
```

----------

## Activity Log Table

```text
+--------------------------------------+
|         ACTIVITY_LOG TABLE           |
+--------------------------------------+
| id (UUID)              PRIMARY KEY   |
| taskId (UUID)         FOREIGN KEY    |
| userId (UUID)         FOREIGN KEY    |
| action (VARCHAR)                    |
| createdAt (TIMESTAMP)               |
+--------------------------------------+
```

----------

## Entity Relationship Diagram (ERD)

<img width="789" height="1402" alt="Image" src="https://github.com/user-attachments/assets/6c4aa92f-e07c-4fad-81fb-2958b28c952c" />

----------

## Database Relationships

```text
User (1)
   │
   ├──────────── owns ────────────┐
   │                              │
   ▼                              │
Task (Many)                       │
   │                              │
   └──────── generates ─────────► ActivityLog (Many)

User (1)
   └──────── performs ──────────► ActivityLog (Many)
```

----------

# Project Structure

```text
taskflow-project-management/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── feedback/
│   │   │   ├── layout/
│   │   │   ├── tasks/
│   │   │   ├── ui/
│   │   │   └── workspace/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── tasks.test.js
│   │   ├── workspace.test.js
│   │   └── helpers.js
│   │
│   ├── package.json
│   └── jest.config.js
│
├── docs/
│   └── diagrams/
│
├── screenshots/
│
├── README.md
└── .gitignore
```

# Installation

## Prerequisites

Before running the project locally, ensure the following are installed:

- Node.js (v18 or later)
- npm
- MySQL Server (v8 or later)
- Git

----------

## Clone the Repository

```bash
git clone https://github.com/Jai7525/taskflow-project-management.git

cd taskflow-project-management
```

----------

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the **backend/** folder using the environment variables shown below.

Start the backend server:

```bash
npm run dev
```

----------

# Frontend Setup

Open a new terminal window.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the **frontend/** folder.

Start the frontend server:

```bash
npm run dev
```

The application will be available locally at:

```text
Frontend
http://localhost:5173

Backend API
http://localhost:5000
```

----------

# Environment Variables

## Backend (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskflow
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

----------

## Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

----------

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and generate JWT |

----------

## Task Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Retrieve a task by ID |
| PUT | `/api/tasks/:id` | Update an existing task |
| PATCH | `/api/tasks/:id/complete` | Mark a task as completed |
| DELETE | `/api/tasks/:id` | Delete a task |

----------

## Workspace

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspace/statistics` | Retrieve dashboard statistics |
| GET | `/api/workspace/activity` | Retrieve recent activity logs |

----------

# API Documentation

TaskFlow includes interactive API documentation powered by **Swagger (OpenAPI 3.0)**.

### Local Development

```text
http://localhost:5000/api-docs
```

### Production

```text
https://taskflow-project-management.onrender.com/api-docs
```

Swagger provides:

- Interactive API Explorer
- JWT Authorization Support
- Request & Response Examples
- Endpoint Documentation
- Schema Definitions

----------

# Testing

TaskFlow includes automated backend integration tests built using **Jest** and **Supertest**.

The test suite runs against an isolated **SQLite in-memory database**, ensuring that development and production data remain unaffected.

## Run Tests

```bash
npm test
```

----------

## Watch Mode

```bash
npm run test:watch
```

----------

## Test Coverage

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Task Creation
- Task Retrieval
- Task Update
- Task Completion
- Task Deletion
- Dashboard Statistics
- Activity Logging
- Request Validation
- Error Handling

----------

# Deployment

TaskFlow is deployed using a modern cloud infrastructure.

| Service | Deployment |
|---|---|
| 🌐 Frontend | Vercel |
| ⚙️ Backend | Render |
| 🗄️ Database | Aiven MySQL |
| 📄 API Documentation | Swagger UI |

----------

## Production URLs

### Frontend

```text
https://taskflow-project-management-ten.vercel.app
```

----------

### Backend API

```text
https://taskflow-project-management.onrender.com
```

----------

### Swagger Documentation

```text
https://taskflow-project-management.onrender.com/api-docs
```

----------

## Deployment Architecture

```text
React + Vite
      │
      ▼
   Vercel
      │
      ▼
Express REST API
      │
      ▼
   Render
      │
      ▼
MySQL Database
      │
      ▼
 Aiven Cloud
```

# Security

TaskFlow follows modern backend security practices to ensure user data and API endpoints remain protected.

## Authentication & Authorization

- JWT (JSON Web Token) Authentication
- Protected API Routes
- Token Verification Middleware
- Secure User Session Management

----------

## Password Security

- Passwords are hashed using **bcrypt**
- Plain-text passwords are never stored
- Secure password comparison during authentication

----------

## Request Validation

- Request validation using **express-validator**
- Required field validation
- Email format validation
- Password validation
- Task payload validation

----------

## API Protection

- Centralized Error Handling
- Input Sanitization
- Consistent HTTP Status Codes
- Unauthorized Request Protection

----------

## Database Security

- Environment Variable Configuration
- Sequelize ORM to prevent SQL Injection
- UUID-based Primary Keys
- Foreign Key Relationships

----------

## Production Security

- Environment-based Configuration
- CORS Configuration
- Helmet Security Middleware
- Secure MySQL SSL Connection (Production)
- Sensitive Credentials stored in Environment Variables

----------

# Future Improvements

The current version demonstrates the core functionality of a production-ready task management platform. Future enhancements may include:

## Collaboration

- Team Workspaces
- Shared Projects
- Task Assignment
- User Roles & Permissions (RBAC)

----------

## Task Management

- Drag-and-Drop Kanban Board
- Subtasks
- Labels & Tags
- Recurring Tasks
- Task Templates

----------

## Productivity

- Calendar View
- Timeline View
- Productivity Analytics
- Custom Dashboards
- Goal Tracking

----------

## Communication

- Comments
- File Attachments
- Email Notifications
- Push Notifications
- Mention Users (@username)

----------

## Real-Time Features

- WebSocket Integration
- Live Activity Feed
- Real-Time Task Synchronization
- Multi-user Collaboration

----------

## AI Features

- AI Task Suggestions
- Smart Priority Recommendations
- Automatic Due Date Estimation
- Natural Language Task Creation

----------

## DevOps

- Docker Support
- CI/CD Pipeline
- GitHub Actions
- Monitoring & Logging
- Performance Metrics

----------

# Author

## Jayakumar M

**B.Tech Information Technology**  
Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College

Passionate about building scalable full-stack applications with modern web technologies, clean architecture, and production-ready backend systems.

----------

### Connect with Me

**GitHub**  
[https://github.com/Jai7525](https://github.com/Jai7525)

----------

**LinkedIn**  
[https://www.linkedin.com/in/jayakumar-m-110b653a3](https://www.linkedin.com/in/jayakumar-m-110b653a3)

----------

**Portfolio**  
[https://jayakumarm-portfolio.vercel.app](https://jayakumarm-portfolio.vercel.app/)
