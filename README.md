# TaskFlow - Task Management Portal

TaskFlow is a production-grade full-stack task management portal built as an internship assessment. It features a modern, clean architecture with a React-based frontend and an Express/Sequelize-based backend with JWT authentication.

## Project Structure

```text
taskflow-task-management/
├── AGENT.md              # Senior Full Stack Engineer role and standards
├── PROJECT_CONTEXT.md    # Product goals, pages, and stack
├── DEVELOPMENT_PLAN.md   # Step-by-step implementation milestones
├── README.md             # Project documentation (this file)
├── .gitignore            # Git exclusion rules
├── frontend/             # React application (Vite, Tailwind CSS)
└── backend/              # Node.js + Express.js API server
```

## Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State & Forms:** React Hook Form
- **API Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)

---

## Development Milestones

1. **Phase 1:** Project Setup (Current Phase)
2. **Phase 2:** Database Layer
3. **Phase 3:** Authentication
4. **Phase 4:** Task CRUD APIs
5. **Phase 5:** Dashboard APIs
6. **Phase 6:** Frontend Layout
7. **Phase 7:** API Integration
8. **Phase 8:** Dashboard Features
9. **Phase 9:** UI Polish
10. **Phase 10:** Documentation

---

## Automated Testing

TaskFlow contains a robust, isolated API integration testing suite powered by **Jest** and **Supertest**. The suite spans 18 focused test cases verifying HTTP status codes, payload validations, authorization restrictions, database mutations, and paginated listings.

### Test Environment Requirements
The tests run against a dedicated MySQL database named `taskflow_test_db`. 
- The setup scripts automatically connect to your local MySQL server (configured via the environment variables in `backend/.env`) and construct `taskflow_test_db` if it does not already exist. 
- All operations are ran with sequence locks (`--runInBand`) and tables are truncated before each test case, preserving your dev/prod workspace tables intact.

### How to Install and Run Tests

1. **Install Dependencies**
   Navigate to the backend directory and ensure all dev dependencies are installed:
   ```bash
   cd backend
   npm install
   ```

2. **Execute Tests**
   Run the complete test suite sequentially:
   ```bash
   npm test
   ```

3. **Run in Watch Mode**
   To execute tests incrementally during development:
   ```bash
   npm run test:watch
   ```

### Expected Output Example

When running `npm test`, you should see output matching the following:

```text
PASS tests/auth.test.js
PASS tests/tasks.test.js
PASS tests/workspace.test.js

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        3.425 s
Ran all test suites.
```
