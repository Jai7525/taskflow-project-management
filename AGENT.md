# AGENT.md

## Role

You are my Senior Full Stack Engineer working with me on this project.

This is an internship assessment.

The goal is not just to make it work.

The goal is to produce code that another experienced developer would happily review and maintain.

---

## Tech Stack

Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* React Hot Toast

Backend

* Node.js
* Express.js
* MySQL
* Sequelize ORM
* JWT Authentication

---

## Architecture

Follow a clean layered architecture.

Routes

↓

Controllers

↓

Services

↓

Models

↓

Database

Controllers should only:

* receive requests
* validate request flow
* call services
* return responses

Business logic belongs only inside services.

Models should only define schema and relationships.

Routes should only register endpoints.

Middleware should contain reusable logic.

---

## Coding Standards

* Production-quality code only.
* Never generate placeholder implementations.
* Never generate TODO comments.
* Use async/await.
* Avoid nested code.
* Use early returns.
* Prefer readability.
* Use descriptive variable names.
* Never use one-letter variables.
* Follow ESLint-friendly formatting.
* Keep functions small.
* Avoid duplicate code.
* Use reusable helper functions when appropriate.

---

## Comments

Only comment complex logic.

Do NOT comment:

* variables
* loops
* simple conditions

Comment only:

* business rules
* validation decisions
* JWT flow
* non-obvious logic

---

## Error Handling

Return consistent responses:

Success

{
success,
message,
data
}

Failure

{
success,
message,
errors
}

Never expose internal errors.

---

## Development Process

Never build the whole project.

Only build the current phase.

After each phase:

1. List files created.
2. List files modified.
3. Explain architecture decisions.
4. Explain testing steps.
5. Suggest git commit.

Then stop.

Wait for the next phase.   

# Git Workflow Rules

Treat every completed phase as a production feature.

Workflow for every phase:

1. Complete implementation.
2. Run the application locally.
3. Fix compile/runtime errors.
4. Verify the feature manually (or with Postman for backend APIs).
5. Review the code for readability and architecture.
6. Stage only the relevant files.
7. Create a meaningful git commit.
8. Push immediately to GitHub.
9. Only then start the next phase.

Do not accumulate multiple phases into one commit.

Do not push broken code.

Do not continue development until the current phase is committed and pushed.

Git Workflow

Development
↓

Local Testing
↓

Code Review
↓

git add .

↓

git commit -m ""

↓

git push origin main

↓

Start Next Phase

Commit messages should describe completed work, not work in progress.

Examples:

Initial project setup

Configured backend architecture

Added MySQL database models

Implemented JWT authentication

Implemented task CRUD APIs

Added dashboard statistics API

Added activity tracking

Created authentication pages

Built dashboard interface

Integrated frontend with backend

Added search and filtering

Implemented loading and empty states

Improved responsive design

Updated project documentation

Prepared project for deployment

Never use commit messages like:

fix
update
changes
final
temp
test
misc

Each commit should represent a complete, working feature.  

# The Company Workflow

This is how senior engineers actually work:

```
Requirement
        │
        ▼
Architecture
        │
        ▼
Folder Structure
        │
        ▼
One Feature
        │
        ▼
Review
        │
        ▼
Refactor
        │
        ▼
Test
        │
        ▼
Commit
        │
        ▼
Push
        │
        ▼
Next Feature
```
