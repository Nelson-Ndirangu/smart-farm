# Smart Farm

Smart Farm is a full-stack application for managing agricultural consultations, subscriptions, and user management. The project is split into two main folders: `backend/` (API and database models) and `frontend/` (Vite + React client). This README covers project structure, setup, common commands, API surface, environment variables, testing, and contribution notes.

Repository structure (top-level)
- [backend/.env](backend/.env)
- [backend/.gitignore](backend/.gitignore)
- [backend/package.json](backend/package.json)
- [backend/server.js](backend/server.js)
- [backend/test.js](backend/test.js)
- [backend/configs/db.js](backend/configs/db.js)
- [backend/controllers/authController.js](backend/controllers/authController.js)
- [backend/controllers/consultationController.js](backend/controllers/consultationController.js)
- [backend/controllers/subscriptionController.js](backend/controllers/subscriptionController.js)
- [backend/controllers/userControllers.js](backend/controllers/userControllers.js)
- [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)
- [backend/middleware/errorHandler.js](backend/middleware/errorHandler.js)
- [backend/models/consultation.js](backend/models/consultation.js)
- [backend/models/subcription.js](backend/models/subcription.js)
- [backend/models/transaction.js](backend/models/transaction.js)
- [backend/models/user.js](backend/models/user.js)
- [backend/routes/authRoutes.js](backend/routes/authRoutes.js)
- [backend/routes/...] (other backend routes)
- [backend/utils/](backend/utils/)
- [frontend/.env](frontend/.env)
- [frontend/.gitignore](frontend/.gitignore)
- [frontend/components.json](frontend/components.json)
- [frontend/eslint.config.js](frontend/eslint.config.js)
- [frontend/index.html](frontend/index.html)
- [frontend/jsconfig.json](frontend/jsconfig.json)
- [frontend/package.json](frontend/package.json)
- [frontend/README.md](frontend/README.md)
- [frontend/vite.config.js](frontend/vite.config.js)
- [frontend/public/](frontend/public/)
- [frontend/src/](frontend/src/)
- Key frontend API helper: [`authAPI`](frontend/src/services/api.jsx), [`usersAPI`](frontend/src/services/api.jsx), [`consultationsAPI`](frontend/src/services/api.jsx), [`subscriptionsAPI`](frontend/src/services/api.jsx) (see [frontend/src/services/api.jsx](frontend/src/services/api.jsx)).

Quick overview
- Backend: Node.js + Express (entry: [backend/server.js](backend/server.js)), MongoDB config at [backend/configs/db.js](backend/configs/db.js).
- Frontend: Vite + React (entry: [frontend/index.html](frontend/index.html)), client side API wrapper at [frontend/src/services/api.jsx](frontend/src/services/api.jsx).
- Auth: JWT-based auth handled in controllers and middleware ([backend/controllers/authController.js](backend/controllers/authController.js), [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)).
- Domain models: users, consultations, subscriptions, transactions under [backend/models/](backend/models/).

Getting started (development)

1. Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- MongoDB (local or hosted)

2. Backend setup
- From repository root:
  - cd backend
  - Install dependencies:
    ```sh
    npm install
    ```
  - Create/edit environment variables in [.env](http://_vscodecontentref_/0). Typical variables:
    ```env
    PORT=8000
    MONGO_URI=mongodb://localhost:27017/smart-farm
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    ```
  - Start server:
    ```sh
    node server.js
    ```
  - Useful files:
    - API entry: [server.js](http://_vscodecontentref_/1)
    - DB config: [db.js](http://_vscodecontentref_/2)
    - Auth controller: [authController.js](http://_vscodecontentref_/3)
    - Test runner / scripts: [test.js](http://_vscodecontentref_/4)

3. Frontend setup
- From repository root:
  - cd frontend
  - Install dependencies:
    ```sh
    npm install
    ```
  - Configure environment variables in [.env](http://_vscodecontentref_/5). Common setting:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```
  - Start dev server:
    ```sh
    npm run dev
    ```
  - Key client API helper: [api.jsx](http://_vscodecontentref_/6) which exports:
    - [authAPI](http://_vscodecontentref_/7) — login/register/verify
    - [usersAPI](http://_vscodecontentref_/8) — users/profile/stats
    - [consultationsAPI](http://_vscodecontentref_/9) — create/update/get consultations
    - [subscriptionsAPI](http://_vscodecontentref_/10) — subscription/payment endpoints

API surface (high level)
- Auth
  - POST /api/auth/login — handled by [authController.js](http://_vscodecontentref_/11)
  - POST /api/auth/register — handled by [authController.js](http://_vscodecontentref_/12)
  - GET /api/auth/verify — handled by [authController.js](http://_vscodecontentref_/13)
  - Client wrapper: [authAPI](http://_vscodecontentref_/14)
- Users
  - GET /api/users
  - GET /api/users/stats
  - PATCH /api/users/profile
  - Controllers: [userControllers.js](http://_vscodecontentref_/15)
  - Client wrapper: [usersAPI](http://_vscodecontentref_/16)
- Consultations
  - GET /api/consultations
  - GET /api/consultations/:id
  - POST /api/consultations
  - PATCH /api/consultations/:id
  - Controller: [consultationController.js](http://_vscodecontentref_/17)
  - Client wrapper: [consultationsAPI](http://_vscodecontentref_/18)
- Subscriptions & transactions
  - GET /api/subscriptions
  - POST /api/subscriptions (create subscription)
  - POST /api/subscriptions/pay-platform-fee
  - PATCH /api/subscriptions/:id
  - Controller: [subscriptionController.js](http://_vscodecontentref_/19)
  - Models: [subcription.js](http://_vscodecontentref_/20), [transaction.js](http://_vscodecontentref_/21)
  - Client wrapper: [subscriptionsAPI](http://_vscodecontentref_/22)

Environment variables
- Backend: see [.env](http://_vscodecontentref_/23). Typical keys:
  - MONGO_URI
  - PORT
  - JWT_SECRET
  - NODE_ENV
- Frontend: see [.env](http://_vscodecontentref_/24)
  - VITE_API_BASE_URL (used in frontend/src/services/api.jsx)

Testing
- Backend basic/test script: [test.js](http://_vscodecontentref_/25). Invoke as:
  ```sh
  node backend/test.js