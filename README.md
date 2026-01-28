# ⚖️ Arbiter

**Arbiter** is a high-performance, type-safe Room & Agenda Booking System backend designed to handle high-concurrency requests and prevent double-booking conflicts with precision.

Built with modern web technologies, Arbiter ensures rigorous data integrity and provides a seamless developer experience.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast, all-in-one JavaScript runtime
- **Framework:** [ElysiaJS](https://elysiajs.com) - Ergonomic web framework for Bun
- **Database:** MySQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) - Lightweight SQL-like ORM
- **Validation:** TypeBox (`t`) - Strict input validation
- **Documentation:** Swagger (via `@elysiajs/swagger`)

## ✨ Key Features

- **Double-booking Prevention:** Core "Arbiter" logic ensures no two bookings can overlap for the same room.
- **Transactional Integrity:** Uses database checks to guarantee consistency.
- **Modular Architecture:** Clean separation of concerns (Modules, Services, Controllers).
- **Type-Safe API:** End-to-end type safety from database to API response.

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

Configure your database credentials in `.env` or modify `src/db/index.ts` / `drizzle.config.ts` (defaults to localhost/root/empty/arbiter_db).

### 3. Database Migration

Initialize your database schema:

```bash
# Generate migration files
bun run db:generate

# Push schema to the database
bun run db:push
```

### 4. Seeding Data (Optional)

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

1. Start the server.
2. Visit **[http://localhost:3000/swagger](http://localhost:3000/swagger)** to explore and interact with the API.

### Core Endpoints

- **`POST /bookings`**: Create a new booking.
  - *Payload:* `userId`, `roomId`, `title`, `startTime`, `endTime`
  - *Returns:* `201 Created` or `409 Conflict` if the slot is taken.
- **`GET /rooms`**: List all available rooms.
- **`GET /bookings`**: List bookings. Supports `from` and `to` query parameters for date filtering.

## 📂 Project Structure

```
src/
├── db/                 # Database configuration and schema
│   ├── schema.ts       # Drizzle schema definitions
│   ├── index.ts        # Database connection
│   └── seed.ts         # Data seeder
├── modules/            # Domain-specific modules
│   ├── booking/        # Booking logic and controller
│   └── room/           # Room controller
└── index.ts            # Application entry point
```

## 📜 License

This project is licensed under the MIT License.