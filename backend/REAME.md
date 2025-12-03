# UG HealthConnect Backend

Backend API for UG HealthConnect - Primary Care Management System

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (Supabase)
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (PostgreSQL database)

## Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=<your_postgres_url>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:** Never commit `.env` file to Git!

### 4. Seed Database (First Time Only)

This creates tables and adds demo users:

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:userId` | Get user by ID | Admin |
| GET | `/api/users/role/:role` | Get users by role | Admin |
| POST | `/api/users` | Create new user | Admin |
| PUT | `/api/users/:userId` | Update user | Admin |
| DELETE | `/api/users/:userId` | Delete user | Admin |

## Demo Credentials

After seeding, use these credentials to test:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

### Patient Accounts
- **Username:** `patient1` / **Password:** `patient123`
- **Username:** `patient2` / **Password:** `patient123`
- **Username:** `patient3` / **Password:** `patient123`

### Doctor Accounts
- **Username:** `doctor1` / **Password:** `doctor123`
- **Username:** `doctor2` / **Password:** `doctor123`

## Database Schema

### Users Table
```sql
- user_id (INTEGER, PRIMARY KEY, AUTO INCREMENT)
- first_name (VARCHAR)
- last_name (VARCHAR)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- role (ENUM: admin, patient, doctor)
- last_login (TIMESTAMP)
- last_password_change (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Appointments Table
```sql
- appointment_id (INTEGER, PRIMARY KEY, AUTO INCREMENT)
- date (DATE)
- start_time (TIME)
- end_time (TIME)
- patient_id (INTEGER, FOREIGN KEY -> users.user_id)
- doctor_id (INTEGER, FOREIGN KEY -> users.user_id)
- status (ENUM: scheduled, cancelled, completed, no-show)
- reason (TEXT)
- notes (TEXT)
- last_updated (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Authentication Flow

1. User sends POST request to `/api/auth/login` with username and password
2. Server validates credentials
3. If valid, server generates JWT token
4. Client stores token in localStorage
5. Client includes token in Authorization header for protected routes:
   ```
   Authorization: Bearer <token>
   ```

## Testing API with Postman/Thunder Client

### Login Request
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Get Current User (Protected)
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-jwt-token>
```

### Create User (Admin Only)
```http
POST http://localhost:5000/api/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "first_name": "Test",
  "last_name": "User",
  "username": "testuser",
  "email": "test@ug.edu.gh",
  "password": "test123",
  "role": "patient"
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── auth.js               # JWT verification
├── models/
│   ├── User.js               # User model
│   └── Appointment.js        # Appointment model
├── routes/
│   ├── auth.js               # Auth routes
│   └── users.js              # User routes
├── .env                      # Environment variables (DON'T COMMIT)
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── seed.js                   # Database seeder
├── server.js                 # Main server file
└── README.md                 # This file
```

## Common Issues & Solutions

### Issue: Cannot connect to database
**Solution:** Check your DATABASE_URL in `.env` file

### Issue: Port 5000 already in use
**Solution:** Change PORT in `.env` or kill process using port 5000

### Issue: Tables not created
**Solution:** Run `npm run seed` to create tables and seed data

### Issue: Authentication failed
**Solution:** Make sure JWT_SECRET is set in `.env`

## Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with demo data
```

## Security Notes

- Never commit `.env` file
- Change JWT_SECRET in production
- Use strong passwords
- Enable SSL in production
- Use environment-specific configurations

## Epic 2 Deliverables

- [x] Database design (PostgreSQL/Supabase)
- [x] API with `/api/auth/login` route
- [x] User authentication with JWT
- [x] JWT saved to localStorage (frontend)
- [x] Role-based access control
- [x] Password hashing with bcrypt

## Next Steps (Epic 3)

- Create dashboard pages (admin, patient, doctor)
- Convert to React SPA
- Add more API routes for appointments
- Implement appointment management

## Support

For issues or questions, contact the development team.
