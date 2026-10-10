# REST API and Persistent Data

A beginner-friendly REST API for managing internship records using Node.js, Express.js and SQLite.

## Features

- Create internship records
- Get all internships
- Get internship by ID
- Update internship records
- Delete internship records
- Pagination
- Status filtering
- Input validation
- Consistent API responses
- SQLite persistent storage
- Seed data

## Technologies

- Node.js
- Express.js
- SQLite
- JavaScript
- REST API

## Project Structure

REST-API-and-Persistent-Data/

├── src/
│   ├── db.js
│   ├── validation.js
│   └── server.js
│
├── data/
│   └── seed.js
│
├── .env
├── .gitignore
├── package.json
└── README.md

## Setup

Install dependencies:

npm install

Seed the database:

npm run seed

Start the server:

npm start

The API runs at:

http://localhost:5000

## API Endpoints

### Get all internships

GET /api/internships

### Get internship by ID

GET /api/internships/:id

### Create internship

POST /api/internships

### Update internship

PUT /api/internships/:id

### Delete internship

DELETE /api/internships/:id

## Pagination

GET /api/internships?page=1&limit=2

## Status Filter

GET /api/internships?status=applied

Available statuses:

- applied
- interview
- selected
- rejected

## Create Internship Example

POST /api/internships

{
  "title": "Full Stack Developer Intern",
  "company": "Infosys",
  "location": "Pune",
  "startDate": "2026-10-10",
  "endDate": "2026-12-10",
  "stipend": 18000,
  "description": "Full stack development internship",
  "status": "applied"
}

## Update Example

PUT /api/internships/1

{
  "status": "interview"
}

## Response Format

{
  "success": true,
  "data": {},
  "message": "Success message"
}

## Error Format

{
  "success": false,
  "errors": {}
}