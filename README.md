# ⚖️ Arbiter

**Arbiter** is a high-performance, type-safe Room & Agenda Booking System backend designed to handle high-concurrency requests and prevent double-booking conflicts with precision.

Built with modern web technologies, Arbiter ensures rigorous data integrity and provides a seamless developer experience with built-in authentication and documentation.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast, all-in-one JavaScript runtime
- **Framework:** [ElysiaJS](https://elysiajs.com) - Ergonomic web framework for Bun
- **Database:** MySQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) - Lightweight SQL-like ORM
- **Auth:** [Better Auth](https://better-auth.com) - Secure authentication
- **Documentation:** Swagger (via `@elysiajs/swagger`)

## ✨ Key Features

- **Double-booking Prevention:** Core "Arbiter" logic ensures no two bookings can overlap for the same room.
- **Role-Based Access Control (RBAC):** Admin-only approval workflows.
- **Secure Authentication:** Built-in Email/Password authentication.
- **Type-Safe API:** End-to-end type safety from database to API response.
- **Production Ready:** Includes robust configuration validation, security middleware (CORS, Helmet compatibility), and global error handling.

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- MySQL Database running

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd arbiter
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory (optional overrides, defaults exist for local dev):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=arbiter_db
BETTER_AUTH_SECRET=your_secret_key
PORT=3000
```

### 3. Database Migration

Initialize your database schema:

```bash
# Generate migration files
bun run db:generate

# Push schema to the database
bun run db:push
```

### 4. Seeding Data

Populate your database with test data (Users, Rooms, Bookings):

```bash
bun run db:seed
```

### 5. Running the Application

Start the development server:

```bash
bun run dev
```

The server will start at `http://localhost:3000`.

## 📖 API Documentation

Arbiter comes with built-in Swagger documentation.
Visit **[http://localhost:3000/swagger](http://localhost:3000/swagger)** to explore and test endpoints.

### 🔐 Authentication

This app uses **Better Auth**. You must authenticate to create bookings.

#### Sign Up
```bash
POST /api/auth/sign-up/email
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Sign In
```bash
POST /api/auth/sign-in/email
{
  "email": "user@example.com",
  "password": "password123"
}
```
*Response will include a Session Cookie. Include this cookie in subsequent requests.*

### 📅 Booking Workflow

#### 1. List Rooms
**Public Endpoint**
```http
GET /rooms
```

#### 2. Create Booking
**Requires Auth (User/Admin)**
```http
POST /bookings
Content-Type: application/json

{
  "roomId": 1,
  "title": "Strategy Meeting",
  "startTime": "2024-06-01T10:00:00Z",
  "endTime": "2024-06-01T11:00:00Z"
}
```

#### 3. Approve Booking
**Requires Auth (Admin Only)**
```http
PATCH /bookings/{id}/approve
```

## 📂 Project Structure

```
src/
├── config.ts           # Configuration validation
├── auth.ts             # Better Auth setup
├── db/                 # Database layer (Schema, Connection, Seed)
├── modules/            
│   ├── booking/        # Booking Service & Controller
│   ├── room/           # Room Service & Controller
│   └── auth/           # Auth Middleware/Macro
└── index.ts            # Application entry point
```

## 📜 License

This project is licensed under the MIT License.