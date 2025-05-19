# JobMatch Platform Backend

This is the backend for the AI-Powered Job Match Platform, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- JWT-based authentication
- User profile management
- Job listings API
- AI-powered job recommendations using OpenAI

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- OpenAI API integration
- JWT for authentication
- Jest for testing

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobmatch
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Seed the database with sample jobs:
   ```
   npx ts-node src/utils/seedJobs.ts
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token

- `POST /api/auth/login` - Login a user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object (without password)

### Profile

- `POST /api/profile` - Create or update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "User Name", "location": "City, Country", "yearsOfExperience": 5, "skills": ["JavaScript", "React"], "preferredJobType": "remote" }`
  - Returns: Profile object

- `GET /api/profile/:userId` - Get profile by user ID
  - Returns: Profile object

- `GET /api/profile` - Get current user's profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: Profile object

### Jobs

- `GET /api/jobs` - Get all jobs
  - Returns: Array of job objects

- `GET /api/jobs/:id` - Get job by ID
  - Returns: Job object

- `POST /api/jobs` - Create a new job (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "title": "Job Title", "company": "Company Name", "location": "City, Country", "skills": ["Skill1", "Skill2"], "description": "Job description", "jobType": "remote" }`
  - Returns: Job object

### Recommendations

- `POST /api/recommend` - Get AI job recommendations
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "recommendations": [{ "job": "Job Title", "company": "Company Name", "reason": "Reason for recommendation" }] }`

## AI Integration

The backend integrates with OpenAI's API to provide intelligent job recommendations based on the user's profile and available job listings. The AI analyzes the user's skills, experience, location, and job type preferences to suggest the most suitable matches from the job database.

## Testing

Run tests with:
```
npm test
```
