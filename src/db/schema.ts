import { mysqlTable, int, varchar, datetime, mysqlEnum, boolean } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: mysqlEnum('role', ['admin', 'user']).default('user').notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const rooms = mysqlTable('rooms', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  capacity: int('capacity').notNull(),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true)
});

export const bookings = mysqlTable('bookings', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id).notNull(),
  roomId: int('room_id').references(() => rooms.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time').notNull(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'rejected']).default('pending')
});
