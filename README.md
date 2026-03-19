# API Task Manager

A fully functioning REST API for a task management application. Users can register, log in, create projects, add tasks with priorities and due dates, and mark them complete. Built as a backend-only project, tested via Postman and documented with Swagger.

**Live URL:** https://api-task-manager-production-7780.up.railway.app  
**API Docs:** https://api-task-manager-production-7780.up.railway.app/docs

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Query Builder:** Knex.js
- **Authentication:** JWT (access + refresh tokens)
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Containerisation:** Docker + Docker Compose
- **Deployment:** Railway
- **Documentation:** Swagger UI (OpenAPI 3.0)

---

## Features

- User registration and login with bcrypt password hashing
- JWT-based authentication with short-lived access tokens (15 min) and refresh tokens (7 days)
- Refresh token rotation and logout
- Full CRUD for projects and tasks
- Task priorities (low, medium, high), due dates, and completion toggling
- Ownership enforcement — users can only access their own data
- Input validation on all POST and PATCH routes
- Centralised error handling
- Offset pagination on list endpoints
- Rate limiting on auth routes
- Secure HTTP headers via Helmet
- Integration tests for auth and resource endpoints
- Full Docker Compose setup for local development

---

## Getting Started

### Prerequisites

- Node.js (v20+)
- Docker and Docker Compose

### Running Locally with Docker

1. Clone the repository:

```bash
git clone https://github.com/your-username/api-task-manager.git
cd api-task-manager
```

2. Create a `.env` file in the root of the project (see Environment Variables below)

3. Start the app and database:

```bash
docker compose up --build
```

Migrations run automatically on startup. The API will be available at `http://localhost:3000`.

### Running Locally without Docker

1. Make sure PostgreSQL is running and you have a database created

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (see Environment Variables below)

4. Run migrations:

```bash
npx knex migrate:latest
```

5. Start the server:

```bash
npm run dev
```

---

## Running Tests

Tests run against a separate test database. Make sure your `.env.test` file is configured before running.

```bash
npm test
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment name | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_USER` | Database user | `admin` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `task_manager` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_random_secret` |

For the test environment, create a `.env.test` file with the same variables but pointing at your test database (`DB_NAME=task_manager_test`).

To generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in and receive tokens | No |
| POST | `/auth/refresh` | Get a new access token | No |
| POST | `/auth/logout` | Invalidate refresh token | No |
| GET | `/auth/me` | Get current user | Yes |

### Projects

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/projects` | Create a project | Yes |
| GET | `/projects` | List all projects | Yes |
| GET | `/projects/:id` | Get a single project | Yes |
| PATCH | `/projects/:id` | Update a project name | Yes |
| DELETE | `/projects/:id` | Delete a project and its tasks | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/projects/:projectId/tasks` | Create a task | Yes |
| GET | `/projects/:projectId/tasks` | List all tasks for a project | Yes |
| GET | `/projects/:projectId/tasks/:id` | Get a single task | Yes |
| PATCH | `/projects/:projectId/tasks/:id` | Update a task | Yes |
| DELETE | `/projects/:projectId/tasks/:id` | Delete a task | Yes |
| PATCH | `/projects/:projectId/tasks/:id/complete` | Toggle task completion | Yes |

All protected routes require an `Authorization` header in the format:

```
Authorization: Bearer <access_token>
```

### Pagination

List endpoints support optional query parameters:

```
GET /projects?page=1&limit=20
GET /projects/:projectId/tasks?page=1&limit=20
```

---

## Project Structure

```
src/
  app.js              # Express app setup
  server.js           # Server entry point
  db.js               # Knex database connection
  middleware/
    auth.js           # JWT authentication middleware
    errorHandler.js   # Centralised error handler
    limiter.js        # Rate limiter
  routes/
    auth/             # Auth routes (register, login, refresh, logout)
    projects/         # Project CRUD routes
      tasks/          # Task CRUD routes (nested under projects)
  schemas/
    projects.js       # Zod validation schemas for projects
    tasks.js          # Zod validation schemas for tasks
tests/
  setup.js            # Jest setup (migrations before tests)
  auth.test.js        # Auth endpoint integration tests
  projects.test.js    # Project endpoint integration tests
  tasks.test.js       # Task endpoint integration tests
```

