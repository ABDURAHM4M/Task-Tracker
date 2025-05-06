
# Task Tracker App

A full-stack Task Tracking application built with **MERN stack** (MongoDB, Express.js, React, Node.js). It supports user authentication, task CRUD, and analytics dashboard. Ideal for personal productivity, portfolio demonstration, or learning full-stack development.

## Features

- User Authentication (JWT-based)
- Task Management (Add, View, Delete)
- Analytics Dashboard
- Fully Responsive Frontend using MUI
- Protected Routes with React Router
- Backend API with Express & MongoDB
- RESTful API architecture
- CORS secured communication
- Cookie-based session handling
- Modular folder structure

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React, MUI, Axios, React Router |
| Backend   | Node.js, Express.js, Mongoose, JWT |
| Database  | MongoDB |
| Dev Tools | Postman, VSCode, Git, npm, curl |

---

## Project Structure

```
/task-tracker
│
├── backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── server.js
│
└── client
    ├── public/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── App.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB installed and running
- Git

### Environment Variables

Copy and update `.env` in `backend/` folder:

```
MONGO_URI=mongodb://localhost:27017/tasktracker
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Run App Locally

**Backend**

```bash
cd backend
npm run dev
# or if using production mode
npm start
```

**Frontend**

```bash
cd client
npm start
```

Visit: `http://localhost:3000`

---

## API Endpoints

| Endpoint             | Method | Description         |
|----------------------|--------|---------------------|
| /api/v1/auth/login   | POST   | Login user          |
| /api/v1/auth/register| POST   | Register user       |
| /api/v1/tasks        | GET    | Get all tasks       |
| /api/v1/task/create  | POST   | Create a new task   |
| /api/v1/task/:id     | DELETE | Delete a task       |

---

## Screenshots

(Include screenshots of login page, dashboard, task page, analytics here)

---

## Deployment

You can deploy this project using services like:

- **Render**, **Vercel**, **Netlify**, or **Heroku** (for frontend)
- **Railway**, **Render**, or **MongoDB Atlas** (for backend + DB)

---

## Contribution

Feel free to open issues or submit PRs.

---

## License

This project is **free to use** under the [MIT License](LICENSE).
