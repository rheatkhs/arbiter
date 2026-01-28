CREATE INDEX `booking_room_time_idx` ON `bookings` (`room_id`,`start_time`,`end_time`);--> statement-breakpoint
CREATE INDEX `booking_user_idx` ON `bookings` (`user_id`);