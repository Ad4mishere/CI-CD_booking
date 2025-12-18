# Booking System – DevOps CI/CD Project

# Description

The focus of the project is **architecture, testability, and automation of CI/CD**, rather than UI complexity.
The application demonstrates a complete DevSecOps workflow including automated testing,
branch protection, and a CI pipeline running on every pull request. The tests included in this project are
Vitest (unit testing), Postman + Newman (Api testing) and Playwright (E2E testing).

---

## 🧱 Tech Stack

### Backend
- Node.js 20 (ES Modules)
- Express
- SQLite (better-sqlite3)
- REST API with proper HTTP status codes

### Frontend
- HTML, CSS and JavaScript
- Fetch API for backend communication
- Modal-based UX for booking management

### Testing
- **Vitest** – Unit tests (backend logic)
- **Postman + Newman** – API tests
- **Playwright** – End-to-end tests (frontend + backend)

### CI/CD
- GitHub Actions
- Branch protection on `main`
- Pull request–based workflow

---

##  How to Run the Project Locally

### 1. Install dependencies

- npm install

2. Start the server

- npm start
The application will be available at:

http://localhost:3000

# Testing

### Code Quality
- **ESLint** – Automated code style and quality checks


Unit Tests (Vitest)
Tests backend logic without HTTP or database access.


npm test

API Tests (Postman / Newman)

Runs a Postman collection against the running backend.


npm run test:api

End-to-End Tests (Playwright)

Tests the full user flow through the frontend.


npx playwright test

CI/CD Pipeline

The GitHub Actions pipeline runs automatically on every push and pull request.


### Pipeline steps:
1. Install dependencies
2. Run ESLint (code quality checks)
3. Run security audit (`npm audit`)
4. Run unit tests (Vitest)
5. Start backend server
6. Run API tests (Newman)
7. Run E2E tests (Playwright)


# API Endpoints

- Get available time slots

GET /api/time-slots

Returns all available (unbooked) time slots.

- Create a booking

POST /api/bookings

Request body:

{
  "timeSlotId": 1
}


Response:

{
  "orderNumber": "ORD-XXXXXXX"
}

- Reschedule a booking

PUT /api/bookings/:orderNumber
Request body:

{
  "newTimeSlotId": 2
}

- Cancel a booking

DELETE /api/bookings/:orderNumber

- Health check

GET /health

Architecture & Design Decisions
n
ode_modules and the database file are excluded from Git with .gitignore

Native dependencies are built in CI

Tests are separated by responsibility:

Unit tests (logic)

API tests (HTTP & integration)

E2E tests (user flow)

Backend server is started once in CI and reused by API and E2E tests

Frontend includes confirmation modal before destructive actions (UX improvement)

# Branch Strategy

Development is done on the develop branch

Changes are merged into main via Pull Requests

main is protected and requires passing CI before merge

## Summary

A Postman collection for testing all API endpoints is included in the `postman/` directory.

This project demonstrates:

A complete CI/CD pipeline

Automated testing at multiple levels

Secure and controlled merge strategy

Practical DevSecOps problem-solving
The focus is on correct engineering practices, not visual complexity.