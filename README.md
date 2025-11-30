# Employee Attendance System
# NAME : SHAIK ARSHIYA ANJUM
# COLLEGE: MOHAN BABU UNIVERSITY
# CONTACT: 9381776229 / arshiyaanjumshaik5@gmail.com
## Project Overview
A full-stack attendance tracking application built with React, Node.js, and MongoDB. 
It features role-based access for Employees (mark attendance, view history, apply for leave) and Managers (monitor live attendance, approve/reject leaves).

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas

## Setup Instructions

### 1. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your MongoDB connection string:
4. Start the server: `node server.js`

### 2. Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

## Environment Variables
Create a `.env` file in the `server` directory with the following:
- `MONGO_URI`: Your MongoDB connection string

## Features
- **Authentication:** Login and Register with Department selection.
- **Employee Dashboard:** Mark attendance (Check In), view history, apply for leaves.
- **Manager Dashboard:** Live attendance monitor (Present/Late/On Time), approve/reject leaves.
- **Leaves:** Submit sick/casual leave requests with date ranges.
