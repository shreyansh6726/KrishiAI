# KrishiAI - Smart Agriculture Platform
KrishiAI is a full-stack MERN application designed to provide AI-driven agricultural insights. It features a secure authentication system with JWT and persistent login states.

## Project Overview
Frontend: React.js (Create React App)

Backend: Node.js & Express.js

Database: MongoDB Atlas

Deployment: Render (Web Service & Static Site)

Authentication: JSON Web Tokens (JWT) with localStorage persistence.

## Project Structure

Plaintext

```
KrishiAI/
├── backend/
│   ├── model/           # Mongoose Schemas (User, etc.)
│   ├── routes/          # API Endpoints (Auth, AI)
│   ├── .env             # Environment variables (local only)
│   └── server.js        # Main entry point & DB connection
└── frontend/
    ├── src/
    │   ├── App.jsx      # Main Logic & Routing
    │   └── index.js     # Entry point
    └── package.json
```

## Setup Instructions
### 1. Backend Setup
Navigate to the backend folder: cd backend

Install dependencies: ```npm install```

Create a ```.env``` file and add:

Code snippet

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_secret_key
Start the server: node server.js
```

### 2. Frontend Setup
Navigate to the frontend folder: ```cd frontend```

Install dependencies: ```npm install axios react-router-dom```

Start the React app: ```npm start```

## Authentication Features
Secure Hashing: Passwords are encrypted using bcryptjs before being stored in MongoDB.

JWT Tokens: Secure tokens are generated upon login to verify user identity.

Login Persistence: Uses localStorage to ensure that if a user closes the window while logged in, they are redirected straight to the Homepage upon returning, skipping the login screen.

## Deployment Notes (Render)
#### Backend (Web Service)
Build Command: ```npm install```

Start Command: ```node server.js```

Environment Variables: Ensure ```MONGO_URI``` and ```JWT_SECRET``` are manually added in the Render Dashboard.

IP Whitelist: MongoDB Atlas must have ```0.0.0.0/0``` whitelisted to allow Render to connect.

#### Frontend (Static Site)
Build Command: ```npm run build```

Publish Directory: build

API URL: Points to ```https://krishiai-sxtk.onrender.com```

## License
This project is for educational use as part of the KrishiAI initiative.