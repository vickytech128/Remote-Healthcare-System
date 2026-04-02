# 🏥 Medical Tourism Patient Portal — Backend API

A robust REST API for a Medical Tourism Patient Portal built with **Node.js**, **Express.js**, and **MongoDB**.

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Signup & Login
│   ├── patientController.js# Dashboard, Profile
│   ├── appointmentController.js
│   ├── reportController.js
│   ├── messageController.js
│   └── doctorController.js
├── middleware/
│   ├── auth.js             # JWT protect middleware
│   ├── upload.js           # Multer file upload
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── Patient.js
│   ├── Doctor.js
│   ├── Appointment.js
│   ├── Report.js
│   └── Message.js
├── routes/
│   ├── patientRoutes.js
│   ├── appointmentRoutes.js
│   ├── reportRoutes.js
│   ├── messageRoutes.js
│   └── doctorRoutes.js
├── uploads/
│   └── reports/            # Uploaded report files
├── .env
├── .gitignore
├── package.json
├── seed.js                 # Sample data seeder
└── server.js               # Entry point
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medical_tourism
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
```

### 3. Seed sample doctors
```bash
npm run seed
```

### 4. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 🔑 Authentication

All protected routes require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned on **signup** and **login**.

---

## 📡 API Reference

### Patient Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/patient/signup` | Public | Register new patient |
| POST | `/api/patient/login` | Public | Login patient |

#### POST `/api/patient/signup`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "country": "USA",
  "passportNumber": "US1234567",
  "medicalCondition": "Coronary Artery Disease"
}
```

#### POST `/api/patient/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Patient Profile & Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/patient/dashboard` | 🔒 Private | Upcoming appointments, reports & messages |
| GET | `/api/patient/profile` | 🔒 Private | Get patient profile |
| PUT | `/api/patient/profile` | 🔒 Private | Update patient profile |

#### PUT `/api/patient/profile` — updatable fields
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+9876543210",
  "country": "Canada",
  "passportNumber": "CA7654321",
  "passportExpiry": "2030-01-01",
  "medicalCondition": "Type 2 Diabetes",
  "allergies": ["Penicillin"],
  "currentMedications": ["Metformin 500mg"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1122334455"
  }
}
```

---

### Appointments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/appointments` | 🔒 Private | Request appointment |
| GET | `/api/appointments` | 🔒 Private | List appointments |
| GET | `/api/appointments/:id` | 🔒 Private | Get single appointment |
| PUT | `/api/appointments/:id/cancel` | 🔒 Private | Cancel appointment |

#### POST `/api/appointments`
```json
{
  "doctorId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "hospital": "Apollo Hospitals",
  "treatment": "Cardiac Bypass Surgery",
  "appointmentDate": "2025-09-15",
  "timeSlot": "10:00",
  "appointmentType": "in-person",
  "symptoms": "Chest pain, shortness of breath",
  "country": "India",
  "city": "Chennai"
}
```

#### GET `/api/appointments` — Query params
| Param | Values | Description |
|-------|--------|-------------|
| `status` | `pending`, `confirmed`, `completed`, `cancelled` | Filter by status |
| `upcoming` | `true` | Show only upcoming appointments |
| `page` | number | Page number |
| `limit` | number | Results per page |

---

### Medical Reports

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reports` | 🔒 Private | Upload report (multipart/form-data) |
| GET | `/api/reports` | 🔒 Private | List all reports |
| GET | `/api/reports/:id` | 🔒 Private | Get report metadata |
| GET | `/api/reports/:id/download` | 🔒 Private | Download report file |
| DELETE | `/api/reports/:id` | 🔒 Private | Delete report |

#### POST `/api/reports` — `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `report` | File | ✅ | PDF, image, or Word doc (max 10MB) |
| `title` | String | ✅ | Report title |
| `reportType` | String | | `blood-test`, `x-ray`, `mri`, `ct-scan`, `ultrasound`, `ecg`, `pathology`, `prescription`, `discharge-summary`, `other` |
| `description` | String | | Additional notes |
| `reportDate` | Date | | Date of the report |
| `hospital` | String | | Hospital where report was done |
| `labName` | String | | Lab name |

---

### Messages

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/messages` | 🔒 Private | Send message to doctor |
| GET | `/api/messages` | 🔒 Private | Get all messages |
| PUT | `/api/messages/:id/read` | 🔒 Private | Mark message as read |

---

### Doctors

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/doctors` | 🔒 Private | List all doctors |
| GET | `/api/doctors/:id` | 🔒 Private | Get doctor details |

#### GET `/api/doctors` — Query params
| Param | Example | Description |
|-------|---------|-------------|
| `specialization` | `Cardiology` | Filter by specialization |
| `hospital` | `Apollo` | Filter by hospital name |
| `country` | `India` | Filter by country |
| `page` | `1` | Page number |
| `limit` | `10` | Results per page |

---

## 🗄️ Database Collections

| Collection | Model | Description |
|------------|-------|-------------|
| `patients` | Patient | Patient accounts and profiles |
| `doctors` | Doctor | Doctor profiles and availability |
| `appointments` | Appointment | Patient-doctor appointments |
| `reports` | Report | Medical report metadata + file paths |
| `messages` | Message | Doctor-patient messages |

---

## 🔒 Security Features

- **bcryptjs** — Password hashing with 12 salt rounds
- **JWT** — 7-day token expiry, verified on every protected route
- **Input validation** — Mongoose schema validators
- **Error sanitization** — Stack traces hidden in production
- **File type filtering** — Only PDF, images, and Word docs allowed for uploads
- **Ownership enforcement** — Patients can only access their own data

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.19.2 | Web framework |
| mongoose | ^8.3.4 | MongoDB ODM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| multer | ^1.4.5-lts.1 | File uploads |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.4.5 | Environment config |
| nodemon | ^3.1.0 | Dev auto-restart |
