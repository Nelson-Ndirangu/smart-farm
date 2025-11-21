# Smart Farm

Smart Farm is a full-stack web application that connects farmers and agronomists for consultations, messaging, and subscription/payments management. The backend is built with Node.js, Express and MongoDB (Mongoose). The frontend is a Vite + React single-page application using Tailwind CSS. Real-time chat uses Socket.IO. Authentication is JWT-based.

This README is a single-source, detailed developer and operator guide covering architecture, setup, API surface, realtime behavior, debugging, testing, deployment options, and contribution guidelines.

---

Table of contents
- Project overview
- Key features
- Architecture and components
- Repository layout
- Prerequisites
- Environment variables (example)
- Local development — backend
- Local development — frontend
- Running both (concurrently / Docker)
- API reference (endpoints, payloads, examples)
- Auth flow & token handling
- Chat / realtime (Socket.IO) details
- Database models (summary)
- Testing and debugging
- CI / CD (example GitHub Actions + Docker)
- Security checklist
- Troubleshooting / common issues
- Contributing
- License

---

Project overview
Smart Farm enables:
- Farmers to request consultations, manage subscriptions and chat with agronomists.
- Agronomists to accept/manage consultations and interact via per-consultation chat.
- Admin/ops to view transactions and user stats.

The application separates concerns:
- backend/ — REST + Socket.IO server handling business logic, auth, DB.
- frontend/ — SPA consuming backend APIs and Socket.IO events.

---

Key features
- JWT authentication (register, login, verify)
- User roles: farmer, agronomist, admin (role-based guards in middleware)
- Consultations lifecycle: create, update, cancel, list, view
- Subscription & transaction recording and platform-fee payments
- Per-consultation chat with read receipts and realtime new-message delivery (Socket.IO)
- API client wrapper on frontend: frontend/src/services/api.jsx (axios instance + helpers)

---

Architecture and components
- Backend: Express app (backend/server.js), Mongoose models, controllers, middleware (auth + error), routes.
- Frontend: React + Vite, context-based auth provider, pages/components, services/api.jsx for all HTTP interactions.
- Realtime: Socket.IO server attached to Express; server sets io on app (app.set('io', io)) so routes/controllers can emit.
- Persistence: MongoDB (documents for users, consultations, chats, subscriptions, transactions).

---

Repository layout (important files)
- backend/
  - server.js
  - configs/db.js
  - routes/ (authRoutes.js, userRoutes.js, consultationRoutes.js, subscriptionRoutes.js, chatRoutes.js)
  - controllers/
  - middleware/ (authMiddleware.js, errorHandler.js)
  - models/ (user.js, consultation.js, Chat.js, subcription.js, transaction.js)
  - test.js
- frontend/
  - package.json
  - vite.config.js
  - src/
    - pages/ (Login.jsx, Register.jsx, Dashboard.jsx, ...)
    - contexts/AuthContext.jsx
    - services/api.jsx (axios instance + exported helpers: authAPI, usersAPI, consultationsAPI, subscriptionsAPI, chatAPI)
    - components/
  - public/

---

Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn
- MongoDB (local, Docker, or hosted)
- (Optional) Docker & docker-compose for containerized local development
- (Optional) Redis for Socket.IO scaling in production

---

Environment variables (examples)

backend/.env (example)
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/smart-farm
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

frontend/.env (example)
```env
VITE_API_BASE_URL=http://localhost:8000
```

Notes:
- frontend uses VITE_API_BASE_URL in frontend/src/services/api.jsx (axios baseURL).
- Keep secrets out of git; use .env files or your deployment secret storage.

---

Local development — backend (Windows)
1. Open terminal (PowerShell or CMD)
2. Install and run:
   ```powershell
   cd c:\Users\hp\Desktop\Smart-Farm\backend
   npm install
   # create .env with values above
   node server.js
   # or use nodemon if installed:
   npx nodemon server.js
   ```
3. Verify server is listening on configured PORT (default 8000).
4. Check MongoDB connection in backend/configs/db.js.

Local development — frontend (Windows)
1. In a second terminal:
   ```powershell
   cd c:\Users\hp\Desktop\Smart-Farm\frontend
   npm install
   # create frontend/.env with VITE_API_BASE_URL
   npm run dev
   ```
2. Visit the dev URL printed by Vite (default: http://localhost:5173).

Running both (simple)
- Start backend and frontend in separate terminals (as above).
- Optionally add concurrently script or use Docker Compose (see Docker section).

---

Docker Compose (recommended for consistent local dev)
Example docker-compose (create root docker-compose.yml) — containerizes backend + mongodb + frontend build static serve or separate dev mode. Provide this file if needed; request from maintainer to generate.

---

API reference (select endpoints, request/response examples)

All API endpoints prefixed with /api. Most protected routes require Authorization: Bearer <token> header; frontend/api.jsx sends token from localStorage 'token'.

Auth
- POST /api/auth/register
  - Body: { name, email, password, role } (role optional: "farmer" | "agronomist")
  - Success: 201 { user: { ... }, token: "<jwt>" }
- POST /api/auth/login
  - Body: { email, password }
  - Success: 200 { user: { ... }, token: "<jwt>" }
  - Example curl:
    ```bash
    curl -X POST http://localhost:8000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"user@example.com","password":"password"}'
    ```
- GET /api/auth/verify
  - Header: Authorization: Bearer <token>
  - Success: 200 { user: { ... } }

Users
- GET /api/users/search/agronomists
  - Returns list of agronomists (summary fields).
- GET /api/users/stats
  - Returns aggregated stats (counts, growth metrics).
- PATCH /api/users/profile
  - Body: fields to update (name, profile, contact, etc.)

Consultations
- GET /api/consultations
  - Query: ?limit=3 for recent.
- GET /api/consultations/:id
- POST /api/consultations
  - Body example: { topic, description, agronomistId, farmerId, scheduledAt, price }
- PATCH /api/consultations/:id
  - Use to update status (accepted, completed, cancelled) or other fields.

Subscriptions & Transactions
- GET /api/subscriptions
- GET /api/subscriptions/payments
- POST /api/subscriptions
  - Body: { planId }
- POST /api/subscriptions/pay-platform-fee
  - No body or specify fee context.
- PATCH /api/subscriptions/:id
  - Body: { active: false } to cancel

Chat (see backend/routes/chatRoutes.js)
- GET /api/chat
  - Returns chats for current user; includes participants and consultation summary; lastMessage manually attached.
- GET /api/chat/:chatId
  - Returns chat with messages; access checked against participants.
- POST /api/chat/consultation/:consultationId
  - Returns existing chat for consultation or creates one if none. Participants set to [farmer, agronomist].
- POST /api/chat/:chatId/messages
  - Body: { content, messageType?: 'text' | 'file', fileUrl?: string }
  - Adds message with sender = current user; server emits newMessage to Socket.IO room = chat._id.
- PATCH /api/chat/:chatId/messages/read
  - Marks all messages in chat as read by the current user.

Example client request to send a message
```bash
curl -X POST http://localhost:8000/api/chat/<chatId>/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"content":"Hello, this is a test"}'
```

Responses follow JSON structure. Errors use { error: "<message>" }.

---

Auth flow & token handling
- On successful login/register backend returns a JWT and user object.
- Frontend AuthContext should:
  - store token in localStorage (key: token)
  - set user in context
  - set authLoading boolean during requests
- frontend/src/services/api.jsx:
  - axios instance with baseURL from VITE_API_BASE_URL
  - request interceptor injects Authorization: Bearer <token> from localStorage
  - response interceptor logs, handles 401 by clearing token and redirecting to /login
  - exported helpers: authAPI, usersAPI, consultationsAPI, subscriptionsAPI, chatAPI

Important: Ensure AuthContext's login/save-token logic stores token using exactly the key expected by api.jsx ('token').

---

Chat / realtime (Socket.IO) details
Server:
- Socket server attached to Express. Controllers call `req.app.get('io')` to emit events.
- Typical emit event: 'newMessage' sent to room named by chat._id (string).
- Routes set up chat rooms; when a new chat created client and server must join appropriate room.

Client responsibilities:
- Connect to backend Socket.IO with same origin and token if required.
- On opening a chat, join room for chat._id: socket.emit('joinRoom', chatId)
- Listen for 'newMessage' to append messages in UI
- Optionally emit 'typing' / 'stopTyping' events (if implemented)

Scaling:
- Use Redis adapter (socket.io-redis) in production for horizontal scaling.

---

Database models (summary)
- User: { name, email, passwordHash, role, profile, createdAt }
- Consultation: { farmer, agronomist, topic, description, scheduledAt, status, price, createdAt }
- Chat (Chat.js): { consultation, participants: [userIds], messages: [{ sender, content, messageType, fileUrl, readBy:[{user,at}] }], isActive, createdAt, updatedAt }
- Subscription / Transaction: subscription plans, user subscriptions, payment records.

See backend/models/ files for schema specifics.

---

Testing and debugging
- Sanity test script: backend/test.js
  - Run: node backend/test.js
- Manual endpoint testing: curl or Postman.
- Frontend dev logs: Vite console + browser DevTools network tab.
- Backend logs: console output where server started. Add debug logs in controllers when needed.
- Common checks when login fails:
  - Is backend running? Is the endpoint reachable?
  - Is VITE_API_BASE_URL correctly set in frontend/.env and frontend dev restarted?
  - Is token being saved to localStorage with key 'token'?
  - Are CORS headers configured on the backend to allow frontend origin?
  - Inspect frontend/src/services/api.jsx interceptors — 401 handling will clear token and redirect to /login.

Example debugging curl for login:
```bash
curl -v -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```
- Check response headers and body for token and 200 status.

---

CI / CD (example)
- Dockerfile for backend and frontend (multi-stage) recommended.
- Example GitHub Actions workflow (CI):
  - Steps: checkout, cache node modules, install, lint, run backend tests, build frontend, run basic integration smoke tests.
- Example deployment pattern:
  - Build frontend and serve static via Nginx or via Express static.
  - Backend container connected to managed MongoDB.
  - Use environment variables and secret storage for JWT_SECRET and DB URI.
- If you want, a sample GitHub Actions + Dockerfiles can be generated on request.

---

Security checklist
- Use strong JWT_SECRET and rotate periodically.
- Set httpOnly, Secure cookies if storing tokens in cookies. LocalStorage is simpler but vulnerable to XSS.
- Validate and sanitize user inputs in controllers.
- Limit allowed CORS origins; avoid wildcard in production.
- Rate-limit authentication endpoints to mitigate brute force.
- Hash passwords with bcrypt (salt + appropriate rounds).
- Use HTTPS in production and redirect HTTP to HTTPS.
- Limit file upload sizes and validate file types when supporting file messages.
- Ensure proper access checks: routes should verify that current user is participant/owner when modifying resources. Example checks exist in routes/chatRoutes.js.

---

Troubleshooting / common issues
- Frontend cannot reach backend:
  - Ensure backend PORT is correct and backend process running.
  - Confirm VITE_API_BASE_URL and that frontend dev server was restarted after .env changes.
  - Check CORS middleware in backend and CORS_ORIGIN value.
- 401 responses:
  - Check token presence in localStorage and that token hasn't expired.
  - Verify backend verifies token using same JWT_SECRET.
- Socket.IO connection fails:
  - Confirm Socket.IO server CORS config allows your frontend origin.
  - Ensure same protocol and domain/port used (ws/wss vs http/https).
- Chat messages not appearing:
  - Confirm server emits 'newMessage' to the room; client joined the room; client listens for the correct event name.

---

Contributing
- Fork repo, create feature branch, open PR.
- Follow commit conventions and include tests for new behavior.
- Run linters and tests before PR.
- Update README when adding or changing env vars, API endpoints, or architectual decisions.

Pull request checklist:
- [ ] Functional change described
- [ ] Tests included or updated
- [ ] Documentation updated (README / inline)
- [ ] No secrets committed

---

License
- Add LICENSE file in repository root. Suggested: MIT (create LICENSE file with chosen license text).

---

Appendix: quick-auth example (expected flow)

1. Register
   POST /api/auth/register
   Body: { name, email, password }
   Response:
   ```json
   {
     "user": { "_id": "...", "name": "Jane Farmer", "email": "jane@example.com", "role": "farmer" },
     "token": "eyJ..."
   }
   ```

2. Login
   POST /api/auth/login
   Body: { email, password }
   Response:
   ```json
   {
     "user": { "_id": "...", "name": "Jane Farmer", "email": "jane@example.com", "role": "farmer" },
     "token": "eyJ..."
   }
   ```

3. Frontend should:
   - store localStorage.setItem('token', token)
   - set context user
   - redirect to dashboard

4. axios instance (frontend/src/services/api.jsx) injects Authorization header for subsequent requests.

---

