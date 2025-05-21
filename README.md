# User Access Management System

This system allows user registration, login & authentication, software access requests, and managerial approvals for these requests.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** React
-   **Database:** PostgreSQL
-   **ORM:** TypeORM
-   **Authentication:** JWT (JSON Web Tokens)
-   **Tooling:** bcrypt (password hashing), dotenv (environment variables), nodemon (dev server), cors, body-parser

## Features

-   User Registration (default role: Employee)
-   JWT-based Authentication & Login
-   Role-based access control and redirection:
    -   **Employee:** Can sign up, login, request software access, view their requests.
    -   **Manager:** Can view and approve/reject access requests.
    -   **Admin:** Can create software listings, has full access (implicitly).
-   Software Listing & Creation (Admin only)
-   Software Access Request Submission (Employee)
-   Access Request Approval or Rejection (Manager)

## Project Structure

\`\`\`
user-access-management/
├── backend/        # Node.js/Express backend
├── frontend/       # React frontend
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites

-   Node.js (v16 or later recommended)
-   npm or yarn
-   PostgreSQL server running

### 1. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create a .env file (if not already created by script, or copy from .env.example)
# cp .env.example .env

# Edit backend/.env with your PostgreSQL credentials and JWT secret:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=your_postgres_user
# DB_PASSWORD=your_postgres_password
# DB_DATABASE=user_access_db  (Ensure this database exists in PostgreSQL)
# JWT_SECRET=your_super_secret_jwt_key_very_long_and_random
# ADMIN_USERNAME=admin (For default admin creation)
# ADMIN_PASSWORD=admin123 (For default admin creation)


# Start the backend server (development mode with nodemon)
npm run dev

# To start in production mode:
# npm start
\`\`\`
The backend will run on \`http://localhost:5000\` (or the port specified in \`.env\`).
TypeORM \`synchronize: true\` is enabled for development, so it will create database tables automatically if they don't exist. For production, use migrations. A default admin user (admin/admin123 or as per .env) will be created if it doesn't exist.

### 2. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Create a .env file (if not already created by script, or copy from .env.example)
# cp .env.example .env

# Edit frontend/.env if your backend is running on a different port:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend development server
npm start
\`\`\`
The frontend React app will run on \`http://localhost:3000\` (or another port if 3000 is busy).

### 3. Database Setup
- Ensure PostgreSQL is installed and running.
- Create a database named \`user_access_db\` (or whatever you specified in \`backend/.env\`).
- The backend, when started with \`synchronize: true\`, will attempt to create the necessary tables (\`users\`, \`software\`, \`requests\`).

## API Documentation

Base URL: \`/api\`

### Authentication (\`/api/auth\`)

-   **\`POST /signup\`**
    -   Description: Register a new user.
    -   Body: \`{ "username": "testuser", "password": "password123", "role": "Employee" }\` (role is optional, defaults to 'Employee')
    -   Response (Success 201): \`{ "message": "User registered successfully", "userId": 1 }\`

-   **\`POST /login\`**
    -   Description: Log in an existing user.
    -   Body: \`{ "username": "testuser", "password": "password123" }\`
    -   Response (Success 200): \`{ "message": "Login successful", "token": "jwt_token_here", "user": { "id": 1, "username": "testuser", "role": "Employee" } }\`

### Software Management (\`/api/software\`)

-   **\`POST /\`** (Requires Admin role, JWT Auth)
    -   Description: Add new software.
    -   Headers: \`Authorization: Bearer <jwt_token>\`
    -   Body: \`{ "name": "Photoshop", "description": "Image editing software", "accessLevels": ["Read", "Write"] }\`

-   **\`GET /\`** (Requires JWT Auth)
    -   Description: Get a list of all available software.
    -   Headers: \`Authorization: Bearer <jwt_token>\`

### Access Requests (\`/api/requests\`)

-   **\`POST /\`** (Requires Employee role, JWT Auth - can be adjusted)
    -   Description: Submit a new access request.
    -   Headers: \`Authorization: Bearer <jwt_token>\`
    -   Body: \`{ "softwareId": 1, "accessType": "Read", "reason": "Need it for project X" }\`

-   **\`GET /my-requests\`** (Requires authenticated user, JWT Auth)
    -   Description: Get all requests submitted by the logged-in user.
    -   Headers: \`Authorization: Bearer <jwt_token>\`

-   **\`GET /pending\`** (Requires Manager or Admin role, JWT Auth)
    -   Description: Get all pending access requests for approval.
    -   Headers: \`Authorization: Bearer <jwt_token>\`

-   **\`PATCH /:id\`** (Requires Manager or Admin role, JWT Auth)
    -   Description: Approve or reject an access request.
    -   Headers: \`Authorization: Bearer <jwt_token>\`
    -   Params: \`id\` (request ID)
    -   Body: \`{ "status": "Approved" }\` or \`{ "status": "Rejected" }\`

## Running the Application
1.  Start the PostgreSQL server & ensure the database (e.g., \`user_access_db\`) is created.
2.  Open a terminal, navigate to the \`user-access-management/backend\` directory, and run \`npm run dev\`.
3.  Open another terminal, navigate to the \`user-access-management/frontend\` directory, and run \`npm start\`.
4.  Open your browser and go to \`http://localhost:3000\`.

