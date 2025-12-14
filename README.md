# TDD Kata - Sweet Shop Application

A full-stack web application for managing a sweet shop inventory, built following Test-Driven Development (TDD) principles. The application allows users to browse, search, and manage sweets with role-based authentication.

## Features

- **User Authentication**: Register, login with JWT-based authentication
- **Sweet Management**: CRUD operations for sweets (admin only)
- **Inventory Tracking**: Purchase and restock functionality
- **Search & Filter**: Find sweets by name, category, or price range
- **Responsive UI**: Modern, mobile-friendly interface
- **Role-based Access**: Admin and regular user permissions

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Jest** for testing

### Frontend
- **Next.js** with **React** and **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Axios** for API calls
- **js-cookie** for client-side storage

## Project Structure

```
TDD-Kata/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── __tests__/
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── services/
    ├── types/
    └── package.json
```

## Setup and Installation

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   If using local MongoDB, ensure it's running on default port 27017.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`

6. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
   This creates sample users and sweets data.

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration (optional):**
   If your backend is not running on `http://localhost:5000`, create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

## Testing

### Backend Testing

The backend includes comprehensive unit and integration tests using Jest.

**Run all tests:**
```bash
cd backend
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

### Test Report

```
Test Suites: 1 failed, 5 passed, 6 total
Tests:       1 failed, 52 passed, 53 total
Snapshots:   0 total
Time:        15.132 s
```

**Passed Test Suites:**
- ✅ Sweet Model (8 tests)
- ✅ Auth Middleware (5 tests)
- ✅ User Model (6 tests)
- ✅ Auth Service (8 tests)
- ✅ Auth Controller (8 tests)

**Failed Test Suite:**
- ❌ Sweet Controller (1 failed out of 12 tests)

**Failed Test Details:**
- `GET /api/sweets › should fail without authentication`
  - Expected: 401 Unauthorized
  - Actual: 200 OK
  - Issue: The endpoint currently allows unauthenticated access

**Note:** The failing test indicates that the GET /api/sweets endpoint should require authentication but currently doesn't. This is a known issue that should be addressed in future updates.

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Login with existing credentials

### Sweet Management Routes
- `GET /api/sweets` - Get all sweets (public access)
- `POST /api/sweets` - Create a new sweet (admin only)
- `PUT /api/sweets/:id` - Update an existing sweet (admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (admin only)
- `GET /api/sweets/search` - Search sweets by name, category, or price range (public access)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (authenticated users)
- `POST /api/sweets/:id/restock` - Restock a sweet (admin only)

### Authentication Requirements
- **Public**: No authentication required
- **Authenticated**: Valid JWT token required
- **Admin**: Valid JWT token + admin role required

## My AI Usage

Throughout the development of this TDD Kata project, I leveraged several AI tools to enhance productivity and code quality:

- **Claude**: Assisted with initial project architecture planning, explaining TDD concepts, and providing guidance on Express.js best practices for the backend structure.

- **GitHub Copilot**: Used for code completion, suggesting middleware implementations, database model definitions, and helping debug TypeScript errors in the authentication system.

- **Vercel by v0**: Helped generate initial UI component boilerplate and some CSS styling for the frontend, particularly for form layouts and responsive design elements.

While AI tools provided valuable assistance in accelerating development and offering suggestions, the core application logic, test suite creation, database design, and overall project architecture were implemented manually to ensure deep understanding and adherence to TDD principles. The AI tools served as helpful assistants rather than replacing the development process.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.