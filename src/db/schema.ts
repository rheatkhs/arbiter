import { mysqlTable, int, varchar, datetime, mysqlEnum, boolean, timestamp, text } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// Better Auth Tables

export const users = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: mysqlEnum('role', ['admin', 'user']).default('user').notNull() // Kept custom role field
});

export const sessions = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id)
});

export const accounts = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verifications = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

// Domain Tables

export const rooms = mysqlTable('rooms', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  capacity: int('capacity').notNull(),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true)
});

export const bookings = mysqlTable('bookings', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id).notNull(),
  roomId: int('room_id').references(() => rooms.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'rejected']).default('pending')
});
