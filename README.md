# UG HealthConnect — Patient Portal Web App

UG HealthConnect — Patient Portal Web App
CSC 423 Fall 2025 Team Project
- A Single-Page Web App for managing users and appointments in a primary-care medical clinic.
Users authenticate and are routed to dashboards based on one of three roles: Admin/Clerk, Patient, Doctor.

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
DATABASE_URL=postgresql://postgres.qujxcynsgnwxthalxohx:youneverknow123@aws-1-us-east-2.pooler.supabase.com:5432/postgres
JWT_SECRET=ug-healthconnect-jwt-secret-key-2025-change-in-production
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:** Never commit `.env` file to Git!

### 4. Seed Database (First Time Only)

NOT IMPLEMENTED

```bash
NOT IMPLEMENTED
```

**Note:** All patients, doctors, and appointments should be created through the admin dashboard.

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

### Appointment Routes (`/api/appointments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/appointments` | Get all appointments | Admin |
| GET | `/api/appointments/search?query=name&type=patient` | Search by patient/doctor name | Admin |
| GET | `/api/appointments/today` | Get today's appointments | Private |
| GET | `/api/appointments/upcoming` | Get upcoming appointments | Private |
| GET | `/api/appointments/history` | Get appointment history | Private |
| GET | `/api/appointments/patient/:patientId` | Get patient appointments | Private |
| GET | `/api/appointments/doctor/:doctorId` | Get doctor appointments | Private |
| GET | `/api/appointments/:id` | Get single appointment | Private |
| POST | `/api/appointments` | Create appointment | Admin |
| PUT | `/api/appointments/:id` | Update appointment | Admin |
| DELETE | `/api/appointments/:id` | Cancel appointment (soft delete) | Patient/Admin |
| DELETE | `/api/appointments/:id/permanent` | Delete appointment permanently | Admin |

## Admin Credentials

After seeding, use these credentials:

- **Username:** `admin`
- **Password:** `admin123`

## Admin Capabilities

The admin user has full control over the system:

### User Management
- ✅ Create new users (patients and doctors)
- ✅ View all users
- ✅ Update user information
- ✅ Delete users
- ✅ Filter users by role

### Appointment Management
- ✅ Create appointments for patients
- ✅ View all appointments
- ✅ Update appointment details
- ✅ Cancel appointments (soft delete)
- ✅ Permanently delete appointments
- ✅ Search appointments by patient name
- ✅ Search appointments by doctor name
- ✅ Filter appointments by status, date, doctor, or patient

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

### Create Patient (Admin Only)
```http
POST http://localhost:5000/api/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "username": "patient1",
  "email": "patient1@ug.edu.gh",
  "password": "patient123",
  "role": "patient"
}
```

### Create Appointment (Admin Only)
```http
POST http://localhost:5000/api/appointments
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "date": "2025-10-25",
  "start_time": "09:00",
  "end_time": "09:30",
  "patient_id": 2,
  "doctor_id": 3,
  "reason": "Regular checkup",
  "notes": "First visit"
}
```

### Search Appointments by Patient Name (Admin Only)
```http
GET http://localhost:5000/api/appointments/search?query=John&type=patient
Authorization: Bearer <admin-jwt-token>
```

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── appointmentController.js  # Appointment management
├── middleware/
│   └── auth.js               # JWT verification
├── models/
│   ├── User.js               # User model
│   └── Appointment.js        # Appointment model
├── routes/
│   ├── auth.js               # Auth routes
│   ├── users.js              # User routes
│   └── appointments.js       # Appointment routes
├── .env                      # Environment variables (DON'T COMMIT)
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── seed.js                   # Database seeder (admin only)
├── server.js                 # Main server file
└── README.md                 # This file
```

## Common Issues & Solutions

### Issue: Cannot connect to database
**Solution:** Check your DATABASE_URL in `.env` file

### Issue: Port 5000 already in use
**Solution:** Change PORT in `.env` or kill process using port 5000

### Issue: Tables not created
**Solution:** Run `npm run seed` to create tables

### Issue: Authentication failed
**Solution:** Make sure JWT_SECRET is set in `.env`

## Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with admin user
```

## Security Notes

- Never commit `.env` file
- Change JWT_SECRET in production
- Use strong passwords
- Enable SSL in production
- Use environment-specific configurations

## Project Requirements (CSC423)

### Epic 2 Deliverables ✅
- [x] Database design (PostgreSQL/Supabase)
- [x] API with `/api/auth/login` route
- [x] User authentication with JWT
- [x] JWT saved to localStorage (frontend)
- [x] Role-based access control
- [x] Password hashing with bcrypt
- [x] Admin-only user management

### Epic 3 Requirements (In Progress)
- [ ] Convert to React SPA
- [ ] React components for dashboards
- [ ] Enhanced admin dashboard
- [ ] Patient and doctor dashboards

### Epic 4 Requirements (Upcoming)
- [ ] Complete appointment CRUD in React
- [ ] Full patient functionality
- [ ] Full doctor functionality
- [ ] Search and filter capabilities

## Admin Workflow

1. **Initial Setup:**
   - Run `npm run seed` to create admin user
   - Login with admin credentials

2. **Create Doctors:**
   - POST to `/api/users` with role: "doctor"
   - Provide doctor details

3. **Create Patients:**
   - POST to `/api/users` with role: "patient"
   - Provide patient details

4. **Schedule Appointments:**
   - POST to `/api/appointments`
   - Select patient and doctor
   - Set date and time

5. **Manage Appointments:**
   - View all appointments
   - Search by patient or doctor name
   - Update or cancel as needed

## Support

For issues or questions, contact the development team.

---

**Note:** This is a course project for CSC423 - Web Development Application at University of Ghana.# WebApp
