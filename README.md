# AI-Powered Job Match Platform

A full-stack application where users can sign up, create their job profile, view job listings, and get AI-powered job recommendations.

## Features

- **Authentication**: JWT-based authentication with register, login, and profile management
- **User Profiles**: Create and manage your professional profile with skills, experience, and job preferences
- **Job Listings**: Browse and search through job listings with filtering options
- **AI Recommendations**: Get personalized job recommendations powered by OpenAI
- **Responsive Design**: Fully responsive UI that works on all device sizes

## Tech Stack

### Frontend
- **Next.js**: React framework for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client for API requests

### Backend
- **Node.js + Express**: Server-side framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB with Mongoose**: Database for storing user profiles and job listings
- **JWT**: Authentication mechanism
- **OpenAI API**: AI-powered job recommendations

## Project Structure

```
jobmatch-platform/
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # Utility functions and API services
├── backend/                # Express app
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Profile
- `POST /api/profile` - Create or update profile
- `GET /api/profile/:userId` - Get profile by user ID
- `GET /api/profile` - Get current user's profile

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - View single job
- `POST /api/jobs` - Create a new job (admin only)

### Recommendations
- `POST /api/recommend` - Get AI-powered job recommendations

## AI Integration

The platform uses OpenAI's API to generate personalized job recommendations based on the user's profile and available job listings. The AI analyzes:

- User's skills and experience
- User's location and job type preferences
- Available job listings and their requirements

The AI then returns the top 3 matching jobs with a personalized reason for each recommendation, helping users understand why a particular job might be a good fit for them.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
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

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Frontend
The frontend can be deployed to Vercel or Netlify.

### Backend
The backend can be deployed to Render, Railway, or Fly.io.

### MongoDB
Use MongoDB Atlas for the database in production.

## Screenshots

![Home Page](screenshots/home.png)
![Dashboard](screenshots/dashboard.png)
![Job Listings](screenshots/jobs.png)
![Recommendations](screenshots/recommendations.png)

## Future Enhancements

- Admin dashboard for managing job listings
- Enhanced AI recommendations with more parameters
- Job application tracking
- Company profiles and reviews
- Salary insights and comparisons
