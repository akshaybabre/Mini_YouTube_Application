Mini-YouTube: A Full-Stack Video Streaming Application

Mini-YouTube is a scalable, full-stack web application mimicking YouTube's core features, built with a modern tech stack. It features a responsive frontend, robust backend, and secure MongoDB database, delivering a seamless user experience for video browsing, liking/disliking, and watchlist management, with admin capabilities for content management.


Features:
Responsive Frontend: Dynamic UI built with React.js, TypeScript, and Tailwind CSS, enabling video browsing, liking/disliking, and watchlist management.
Interactive Features: Like/Dislike buttons with custom SVG icons (via CustomLikeButton.tsx) and watchlist functionality, powered by Redux for glitch-free state management.
Secure Authentication: User login/signup with Firebase and JWT, password hashing with bcrypt, and unique email-userId validation.
Admin Dashboard: Dedicated routes (/api/admin/register, /api/admin/videos) for admins to manage users, videos, and categories.
Smooth Animations: Enhanced UX with Framer Motion for transitions (e.g., Like/Dislike buttons) and Lucid Icons for a modern look.
Robust Backend: RESTful APIs using Node.js, Express.js, and Mongoose for efficient video and user management.
Error Handling: Custom validateId middleware and global error-handling in app.js ensure robust API endpoints (e.g., /api/admin/videos/:id).
Professional Branding: Added YouTube favicon via index.html for a polished look.


Technologies Used
Frontend: React.js, TypeScript, Tailwind CSS, Redux, Framer Motion, Lucid Icons
Backend: Node.js, Express.js, Mongoose, Firebase, JWT, bcrypt
Database: MongoDB
Tools: Git, GitHub, Render (CI/CD), ESLint


Demo
Live demo: Mini-YouTube (https://mini-youtube-frontend.onrender.com)


Installation
To run Mini-YouTube locally:
1. Clone the repository:
      git clone https://github.com/akshaybabre/mini-youtube.git
      cd mini-youtube

2. Install dependencies for frontend and backend:
      # Backend
      cd backend
      npm install
      # Frontend
      cd ../frontend
      npm install  

3. Set up environment variables:
   Create .env files in backend/ and frontend/ based on .env.example.
   Add MONGODB_URI, JWT_SECRET, and Firebase credentials.

4. Run the app:
      # Backend (from backend folder)
      npm start
      # Frontend (from frontend folder)
      npm run dev   

5. Access at http://localhost:3000 (frontend) and http://localhost:5000 (backend).



Project Structure:
Frontend (frontend/):
UserDashPage.tsx: User dashboard for browsing videos.
UserVideoCard.tsx: Reusable video card component.
CustomLikeButton.tsx: Custom SVG-based Like/Dislike button.
Backend (backend/):
authRoutes.js: Handles user authentication.
watchlistRoutes.js: Manages watchlist operations.
videoAdminRoutes.js: Admin routes for video/category management.
Modular components and routes ensure reusability and scalability.


Deployment:
Deployed on Render with separate services:
Frontend: mini-youtube-frontend
Backend: mini-youtube-backend
Automated CI/CD via render.yaml for seamless updates.
Secured sensitive data (e.g., MONGODB_URI, JWT_SECRET) using Render’s environment variables and .gitignore for serviceAccountKey.json.


Security Practices:
Excluded sensitive files (serviceAccountKey.json, render.yaml) from GitHub.
Cleaned Git history to prevent data leaks.
Implemented validateId middleware to handle malformed URLs.
Used bcrypt for password hashing and JWT for secure authentication.


Future Improvements:
Add video streaming optimization for faster load times.
Implement search functionality with Elasticsearch.
Enhance admin dashboard with analytics for video performance.


Contact:
Akshay Babre
Email: akshaybabre8@gmail.com
LinkedIn: linkedin.com/in/akshaybabre
Portfolio: https://akshay-x66v.onrender.com

          



