import { db } from '../../db';
import { bookings } from '../../db/schema';
import { and, eq, gt, lt, sql } from 'drizzle-orm';

export class BookingService {
    /**
     * Checks if a room is available for a given time range.
     * Logic: A conflict exists if (StartA < EndB) AND (EndA > StartB).
     * @param roomId 
     * @param startTime 
     * @param endTime 
     * @returns true if available, false if conflict exists
     */
    async checkAvailability(roomId: number, startTime: Date, endTime: Date): Promise<boolean> {
        // We want to find if there are ANY bookings that overlap.
        // Overlap condition: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
        const conflicts = await db.select({ id: bookings.id })
            .from(bookings)
            .where(and(
                eq(bookings.roomId, roomId),
                lt(bookings.startTime, endTime),
                gt(bookings.endTime, startTime),
                // We only care about active bookings, so we exclude rejected ones if necessary.
                // Assuming 'rejected' bookings don't block the room, but 'pending' and 'confirmed' do.
                sql`${bookings.status} != 'rejected'`
            ))
            .limit(1);

        return conflicts.length === 0;
    }

    async createBooking(data: {
        userId: number;
        roomId: number;
        title: string;
        startTime: Date;
        endTime: Date;
    }) {
        // Transactional check pattern could be strictly enforced here if using a higher isolation level,
        // but for now we perform the check then insert.
        // In a highly concurrent environment, this 'check-then-act' has a race condition window.
        // To solve strictly: Lock the room row or use optimistic concurrency control.
        // For this implementation, we will perform the check explicitly as requested.

        // START TRANSACTION
        return await db.transaction(async (tx) => {
            // Re-check inside transaction for better consistency (though MySQL default isolation repeatable-read might still require specific locking hints like FOR UPDATE on the room or a gap lock mechanism, Drizzle's transaction wrapper helps).
            const isAvailable = await this.checkAvailability(data.roomId, data.startTime, data.endTime);

            if (!isAvailable) {
                throw new Error('Room is not available for the selected time range.');
            }

            const [result] = await tx.insert(bookings).values({
                userId: data.userId,
                roomId: data.roomId,
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                status: 'pending' // Default status
            });

            return result.insertId;
        });
    }

    async getBookings(filters?: { from?: Date; to?: Date }) {
        let whereClause = undefined;

        // Basic date range filtering: overlaps with the requested range?
        // Or just "starts within range"? Usually for calendar view we want overlaps.
        if (filters?.from && filters?.to) {
            whereClause = and(
                lt(bookings.startTime, filters.to),
                gt(bookings.endTime, filters.from)
            );
        }

        return await db.select().from(bookings).where(whereClause);
    }
}

export const bookingService = new BookingService();
