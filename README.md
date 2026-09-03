# Roxiler Store Rating App

A full-stack store rating web application developed as a Full-Stack Intern Coding Challenge.

The application allows users to browse stores, submit ratings from 1 to 5, and update their ratings. It also provides separate dashboards for administrators and store owners with role-based access.

## Features

- User registration and login
- JWT-based authentication
- Role-based access for:
  - System Administrator
  - Normal User
  - Store Owner
- Admin dashboard with user, store and rating statistics
- Admin can add and manage users and stores
- Users can search stores by name or address
- Users can submit and modify store ratings
- Store owners can view their store's average rating and customer ratings
- Secure password hashing using bcrypt
- Password update functionality

## Tech Stack

**Frontend:** React.js, Vite, JavaScript, CSS

**Backend:** Node.js, Express.js

**Database:** PostgreSQL

**Authentication:** JWT, bcrypt

## Project Structure

```text
roxiler-store-rating-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── index.css
│
└── README.md

How to Run
Backend
cd backend
npm install
node server.js

Backend runs on http://localhost:5000.

Frontend
cd frontend
npm install
npm run dev

Database
The application uses PostgreSQL with three main tables:
users – stores user accounts and roles
stores – stores store information and owners
ratings – stores user ratings for stores


Security
Passwords are securely hashed using bcrypt.
JWT is used for authentication.
Protected routes use authentication and role-based authorization.
Database credentials and JWT secrets are stored using environment variables.


Author
Developed as part of the Full-Stack Intern Coding Challenge.