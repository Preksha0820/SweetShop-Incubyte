# TDD Kata: Sweet Shop Management System

A full-stack Sweet Shop Management System designed and developed using
**Test-Driven Development (TDD)**.\
This project demonstrates backend API development, database integration,
authentication, frontend UI implementation, and responsible AI-assisted
development workflows.

------------------------------------------------------------------------

## 🚀 Project Overview

The Sweet Shop Management System allows users to browse sweets, purchase
items, manage inventory, and perform administrative actions such as
adding or updating sweets.

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Backend

-   Node.js + Express\
-   MongoDB + Mongoose\
-   JWT Authentication\
-   Multer for image uploads\
-   Jest + Supertest

### Frontend

-   React + Vite\
-   Axios

------------------------------------------------------------------------

## 🔐 Test User Accounts

### Admin

-   Email: **preksha@test.com**\
-   Password: **123456**

### User

-   Email: **yashi@test.com**\
-   Password: **123456**

------------------------------------------------------------------------

## 📦 Project Setup

### 1️⃣ Backend

    cd backend
    npm install

Create `.env`:

    PORT=5000
    MONGO_URI=your_mongo_url
    JWT_SECRET=your_secret

Run backend:

    npm start

Run tests:

    npm test

------------------------------------------------------------------------

### 2️⃣ Frontend

    cd frontend
    npm install
    npm run dev

------------------------------------------------------------------------

## 📡 API Endpoints

### Auth

-   POST `/api/auth/register`
-   POST `/api/auth/login`

### Sweets (Protected)

-   POST `/api/sweets`
-   GET `/api/sweets`
-   GET `/api/sweets/search`
-   PUT `/api/sweets/:id`
-   DELETE `/api/sweets/:id`

### Inventory (Protected)

-   POST `/api/sweets/:id/purchase`
-   POST `/api/sweets/:id/restock`

------------------------------------------------------------------------


## 🧪 Test Report

    Test Suites: 2 passed, 2 total
    Tests:       28 passed

------------------------------------------------------------------------

# 🤖 My AI Usage

AI tools (ChatGPT, etc.) were used for: - Brainstorming API structure\
- Debugging\
- Generating boilerplate\
- Writing documentation\
- Improving tests

All AI-generated content was reviewed and refined manually.

------------------------------------------------------------------------

## 🎉 Final Notes

This README is auto-generated and ready for submission.
