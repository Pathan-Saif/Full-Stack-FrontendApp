# Team Task Manager Frontend

React + Vite frontend for a role-based team task manager.

## Features

- Auth screens for login and signup
- Role based routes for admin and member users
- Admin dashboard with project/task overview
- Member dashboard and task status updates
- Project listing, search, detail, create and edit screens
- Task create/edit screens with assignee, priority, status and due date

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app expects the backend API at:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Build

```bash
npm run build
```
