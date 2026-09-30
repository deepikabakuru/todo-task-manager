# Todo Task Manager — MERN Stack Build Guide (Phase-Wise AI Prompts)

A phase-by-phase plan for building the **Todo Task Manager** (Beginner MERN project, 17 REST APIs). Each phase below has a ready-to-copy prompt you can paste into an AI coding assistant (Claude Code, Cursor, etc.) to build that piece before moving to the next.

**Stack:** MongoDB + Mongoose · Node.js + Express · React (Vite) · JWT Auth
**Deploy:** MongoDB Atlas · Render (API) · Vercel/Netlify (frontend)

---

## Phase 0 — Project Setup & Folder Structure

**Goal:** Scaffold the repo with the correct folder layout before writing any logic.

> **Prompt:**
> "Set up a MERN stack project called `todo-task-manager` with two folders: `server/` and `client/`.
> In `server/`, initialize a Node.js + Express project with this structure: `models/`, `controllers/`, `routes/`, `middleware/`, `config/`, `server.js`. Install express, mongoose, bcryptjs, jsonwebtoken, dotenv, cors, and nodemon (dev). Add a `.env.example` with `PORT`, `MONGO_URI`, `JWT_SECRET`. Set up a basic Express server with cors and json middleware, and connect to MongoDB using Mongoose.
> In `client/`, scaffold a React app with Vite. Install react-router-dom, axios, and Tailwind CSS. Set up the folder structure: `pages/`, `components/`, `services/`, `context/`. Configure Tailwind.
> Add a root `.gitignore` for `node_modules` and `.env`."

---

## Phase 1 — Database Models

**Goal:** Define the Mongoose schemas for `User`, `Task`, and `Category`.

> **Prompt:**
> "In `server/models/`, create three Mongoose models:
> 1. `User.js` — fields: `name`, `email` (unique), `password` (hashed), `createdAt`.
> 2. `Category.js` — fields: `name`, `user` (ref to User), `createdAt`.
> 3. `Task.js` — fields: `title`, `description`, `priority` (enum: low/medium/high), `dueDate`, `category` (ref to Category), `completed` (boolean, default false), `user` (ref to User), `createdAt`.
> Add a pre-save hook on `User` to hash the password with bcrypt before saving. Add an instance method `comparePassword` to check a candidate password against the hash."

---

## Phase 2 — Auth Middleware & Auth APIs (3 endpoints)

**Goal:** Build register, login, and profile endpoints with JWT.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get logged-in user profile |

> **Prompt:**
> "Create `server/middleware/auth.js`: an Express middleware that reads the `Authorization: Bearer <token>` header, verifies it with `jsonwebtoken` and `JWT_SECRET`, attaches the decoded user id to `req.user`, and returns 401 if the token is missing or invalid.
> Create `server/controllers/authController.js` and `server/routes/authRoutes.js` with:
> - `POST /api/auth/register` — validate `name`, `email`, `password` are present and email isn't already used (400 if not); create the user; return 201 with a JWT token.
> - `POST /api/auth/login` — validate credentials, compare password with bcrypt, return 401 on mismatch, otherwise return 200 with a JWT token.
> - `GET /api/auth/me` — protected by the auth middleware; returns the logged-in user's profile (no password field) with 200, or 404 if not found.
> Mount these routes in `server.js` under `/api/auth`. Use proper status codes throughout (200, 201, 400, 401, 404)."

---

## Phase 3 — Task CRUD APIs (5 endpoints)

**Goal:** Full CRUD for tasks, scoped to the logged-in user, with pagination.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | List all tasks (with pagination) |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

> **Prompt:**
> "Create `server/controllers/taskController.js` and `server/routes/taskRoutes.js`, all routes protected by the auth middleware and scoped to `req.user` (a user can only see/edit/delete their own tasks):
> - `POST /api/tasks` — validate `title` is required (400 if missing); create task linked to `req.user` and optional `category`; return 201.
> - `GET /api/tasks` — return tasks belonging to `req.user` only, with pagination via `?page=` and `?limit=` query params (default page 1, limit 10); return total count and page info with 200.
> - `GET /api/tasks/:id` — return the task if it belongs to `req.user` (200), 404 if not found or not owned.
> - `PUT /api/tasks/:id` — update fields if the task belongs to `req.user`; 404 if not found/not owned; 200 on success.
> - `DELETE /api/tasks/:id` — delete if owned by `req.user`; 404 if not found/not owned; 200 on success.
> Mount under `/api/tasks` in `server.js`."

---

## Phase 4 — Category CRUD APIs (5 endpoints)

**Goal:** Full CRUD for categories, scoped to the logged-in user.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/categories` | Create a new category |
| GET | `/api/categories` | List all categories (with pagination) |
| GET | `/api/categories/:id` | Get a single category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

> **Prompt:**
> "Create `server/controllers/categoryController.js` and `server/routes/categoryRoutes.js`, mirroring the pattern used for tasks: all routes protected by the auth middleware, scoped to `req.user`, with the same CRUD behavior and pagination on the list endpoint, and the same status code rules (200/201/400/404). Mount under `/api/categories` in `server.js`."

---

## Phase 5 — Special/Utility Endpoints (4 endpoints)

**Goal:** Add the extra task endpoints beyond basic CRUD.

| Method | Endpoint | Purpose |
|---|---|---|
| PATCH | `/api/tasks/:id/complete` | Toggle task complete or pending |
| GET | `/api/tasks/search?q=` | Search tasks by title |
| GET | `/api/tasks/due-today` | Tasks due today |
| GET | `/api/tasks/stats` | Count of pending vs completed tasks |

> **Prompt:**
> "Add four more endpoints to `taskController.js` / `taskRoutes.js`, all protected and scoped to `req.user`:
> - `PATCH /api/tasks/:id/complete` — flips the `completed` boolean on the task if owned by `req.user`; 404 if not found/not owned; 200 on success.
> - `GET /api/tasks/search?q=<text>` — case-insensitive search on `title` (use a Mongo regex or text index), scoped to `req.user`, 200 with results (empty array if none).
> - `GET /api/tasks/due-today` — returns tasks where `dueDate` falls within today's date range, scoped to `req.user`, 200.
> - `GET /api/tasks/stats` — returns `{ pending: <count>, completed: <count> }` for `req.user`'s tasks, 200.
> IMPORTANT: register `/api/tasks/search`, `/api/tasks/due-today`, and `/api/tasks/stats` routes BEFORE the `/api/tasks/:id` route in Express, so they aren't shadowed by the dynamic `:id` param."

---

## Phase 6 — Postman Testing Pass

**Goal:** Verify all 17 APIs work correctly before touching the frontend.

> **Prompt:**
> "Generate a Postman collection (JSON export format) covering all 17 API endpoints built so far: 3 auth, 5 task CRUD, 5 category CRUD, and 4 special task endpoints. Include example request bodies, a `{{token}}` collection variable for the Authorization header, and a pre-request script or test script on the login request that automatically sets `{{token}}` from the response. Also give me a checklist of test cases to run for each endpoint, including expected success and failure status codes (400, 401, 404)."

---

## Phase 7 — Frontend Setup: Routing, Auth Context & API Service

**Goal:** Wire up the React app shell: routing, auth state, and the Axios client.

> **Prompt:**
> "In `client/src/`, set up:
> - `services/api.js` — an Axios instance with the backend base URL, and a request interceptor that attaches `Authorization: Bearer <token>` from localStorage to every request.
> - `context/AuthContext.jsx` — a Context (or Redux Toolkit slice, your choice) holding `user`, `token`, `login()`, `register()`, `logout()`, and `loading` state; persist the token to localStorage.
> - `App.jsx` — set up React Router with routes for `/login`, `/register`, `/dashboard` (protected), `/tasks/:id` (protected), and `/categories` (protected).
> - A `ProtectedRoute` component that redirects to `/login` if there's no authenticated user."

---

## Phase 8 — Auth Pages (Login & Register)

**Goal:** Build the Register and Login UI, wired to the auth APIs.

> **Prompt:**
> "Create `pages/Register.jsx` and `pages/Login.jsx` using Tailwind for styling.
> - Register form: name, email, password fields, client-side validation, calls the register API via AuthContext, shows inline error messages from the API (e.g. 'email already in use'), redirects to `/dashboard` on success.
> - Login form: email, password, calls the login API, shows an error on 401, redirects to `/dashboard` on success.
> Add a simple loading state on submit and disable the button while submitting."

---

## Phase 9 — Task Dashboard (List, Create, Update, Delete, Complete Toggle)

**Goal:** Build the main task management UI.

> **Prompt:**
> "Create `pages/Dashboard.jsx`:
> - Fetch and display the user's tasks (paginated, with page controls) using the `/api/tasks` endpoint.
> - Show title, priority, due date, category, and completed status per task, with a checkbox/toggle calling `PATCH /api/tasks/:id/complete`.
> - Add a 'New Task' form/modal (title, description, priority, due date, category dropdown) that calls `POST /api/tasks`.
> - Add edit (inline or modal, calling `PUT /api/tasks/:id`) and delete (`DELETE /api/tasks/:id` with a confirm step) actions per task.
> - Add a search bar calling `GET /api/tasks/search?q=` and a 'Due Today' filter calling `GET /api/tasks/due-today`.
> - Add a small stats widget showing pending vs completed counts from `GET /api/tasks/stats`."

---

## Phase 10 — Category Management Page

**Goal:** Build a simple page to manage categories.

> **Prompt:**
> "Create `pages/Categories.jsx`: list categories with pagination (`GET /api/categories`), a form to add a new category (`POST /api/categories`), and inline edit/delete actions (`PUT`/`DELETE /api/categories/:id`). Make sure the category list here is also used to populate the category dropdown on the task form in the Dashboard."

---

## Phase 11 — Polish, Error Handling & UX

**Goal:** Tighten up validation, loading/error states, and responsiveness.

> **Prompt:**
> "Review the whole client app and: add loading spinners for all API calls, add toast/error banners for failed requests (400/401/404/500), auto-logout and redirect to `/login` if a request returns 401, make all pages responsive with Tailwind, and add empty-state messages (e.g. 'No tasks yet — create your first one') for empty lists."

---

## Phase 12 — Deployment

**Goal:** Ship the app using free-tier hosting.

> **Prompt:**
> "Prepare this project for deployment:
> 1. Create a MongoDB Atlas connection guide — how to create a free cluster, get the `MONGO_URI`, and whitelist all IPs for Render.
> 2. Add a `render.yaml` or deployment instructions for deploying `server/` to Render as a Web Service, with environment variables `MONGO_URI`, `JWT_SECRET`, `PORT`.
> 3. Update `client/services/api.js` to use an environment variable (`VITE_API_URL`) for the base URL instead of a hardcoded localhost address.
> 4. Give me step-by-step instructions to deploy `client/` to Vercel (or Netlify), setting `VITE_API_URL` to the deployed Render backend URL.
> 5. Add CORS configuration on the server to allow requests only from the deployed frontend domain."

---

## Suggested Order of Execution

1. Phase 0 → 1 → 2 → 3 → 4 → 5 (backend fully built)
2. Phase 6 (test everything in Postman — don't skip this)
3. Phase 7 → 8 → 9 → 10 → 11 (frontend fully built)
4. Phase 12 (deploy)

Run each phase's prompt one at a time, test the result, then move to the next — don't chain multiple phases into one prompt, or the AI tends to skip details like pagination, ownership checks, or status codes.
