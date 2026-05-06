TEAM TASK MANAGER (FULL-STACK)

A full-stack app where users can create projects, assign tasks, and track progress with role-based access (Admin / Member).

TECH STACK
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Auth: JWT + bcrypt
- Deployment: Railway

ROLES & PERMISSIONS
- Admin
  - Projects: full CRUD
  - Tasks: create / update / delete
- Member
  - Tasks: can update status/description only for tasks assigned to them

DEMO LOGIN (OPTIONAL)
Email: admin
Password: admin

On Railway, enable on backend service:
DEMO_ADMIN_LOGIN=true

LOCAL RUN
1) Backend
   - Create server/.env (copy server/.env.example)
   - Required:
     MONGO_URI=...
     JWT_SECRET=...
     CORS_ORIGIN=http://localhost:5173
     PORT=5000

   Commands:
     cd server
     npm install
     npm run dev

   Test:
     GET /health

2) Frontend
   - Create client/.env (copy client/.env.example)
     VITE_API_URL=http://localhost:5000

   Commands:
     cd client
     npm install
     npm run dev

   Open:
     http://localhost:5173

API ROUTES (QUICK)
Auth:
- POST /api/auth/signup
- POST /api/auth/login
- GET  /api/auth/me

Projects (Admin only):
- GET    /api/projects
- POST   /api/projects
- GET    /api/projects/:id
- PUT    /api/projects/:id
- DELETE /api/projects/:id

Tasks:
- GET    /api/tasks?projectId=...
- POST   /api/tasks              (Admin only)
- GET    /api/tasks/:id
- PUT    /api/tasks/:id          (Admin; or assigned Member limited fields)
- DELETE /api/tasks/:id          (Admin only)

RAILWAY DEPLOY (SEPARATE BACKEND + FRONTEND)
Backend service:
- Root directory: server
- Healthcheck path: /health
- Variables:
  MONGO_URI=...
  JWT_SECRET=...
  JWT_EXPIRES_IN=7d (optional)
  CORS_ORIGIN=https://<your-frontend>.up.railway.app
  DEMO_ADMIN_LOGIN=true (optional)

Frontend service:
- Root directory: client
- Variables:
  VITE_API_URL=https://<your-backend>.up.railway.app
  NODE_VERSION=20 (only if Railway uses Node 18)

NOTES
- Do not commit .env files (use .env.example templates).

