Task Management API

A Node.js-based task management API using Express, MongoDB Atlas, JWT authentication, and bcrypt password hashing.

Features
*************************************************
1. User Registration (POST /auth/signup)

2. User Login (POST /auth/login)

3. JWT Token-based Authentication

4. Create Task (POST /tasks)

5. Get All Tasks (GET /tasks)

6. Get Specific Task (GET /tasks/:id)

7. Update Task (PUT /tasks/:id)

8. Delete Task (DELETE /tasks/:id)

Installation & Setup
**************************************************

1. Clone the repository
2. Install dependencies: npm install
3. Create a .env file:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
4. uncomment the 26th and 27th line before run the local server
5. npm start
