# Team Task Manager (Full-Stack)

A full-stack app where users can create projects, assign tasks, and track progress with role-based access (**Admin / Member**).

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT + bcrypt
- **Deploy**: Railway

## Roles & Permissions

- **Admin**
  - Projects: full CRUD
  - Tasks: create / update / delete
- **Member**
  - Tasks: can update **status/description** only for **tasks assigned to them**

## Demo Login (Optional)

This project supports a demo shortcut:

- **Email**: `admin`
- **Password**: `admin`

On Railway (production), enable it on the **backend service** with:

- `DEMO_ADMIN_LOGIN=true`

## Local Setup

### Backend

Create `server/.env` (copy from `server/.env.example`) and set at least:

```env
MONGO_URI=...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

Run:

```bash
cd server
npm install
npm run dev
```

Healthcheck: `GET /health`

### Frontend

Create `client/.env` (copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000
```

Run:

```bash
cd client
npm install
npm run dev
```

Open: `http://localhost:5173`

## API Routes (Quick)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects (Admin only)
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks
- `GET /api/tasks?projectId=...`
- `POST /api/tasks` (Admin only)
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id` (Admin; or assigned Member limited fields)
- `DELETE /api/tasks/:id` (Admin only)

## Railway Deployment (Separate Services)

### Backend service
- **Root directory**: `server`
- **Healthcheck path**: `/health`
- **Variables**:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN` (optional, e.g. `7d`)
  - `CORS_ORIGIN` = your frontend Railway domain (e.g. `https://<frontend>.up.railway.app`)
  - `DEMO_ADMIN_LOGIN=true` (optional)

### Frontend service
- **Root directory**: `client`
- **Variables**:
  - `VITE_API_URL` = your backend Railway domain (e.g. `https://<backend>.up.railway.app`)
  - `NODE_VERSION=20` (if Railway tries Node 18)

## Notes

- Do **not** commit `.env` files. This repo includes `.env.example` templates only.

