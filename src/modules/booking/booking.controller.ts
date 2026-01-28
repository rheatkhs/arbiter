import { Elysia, t } from 'elysia';
import { bookingService } from './booking.service';
import { authMiddleware } from '../auth/middleware';
import { db } from '../../db';
import { bookings } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const bookingController = new Elysia({ prefix: '/bookings' })
    .use(authMiddleware)
    .post('/', async ({ body, set, user }) => {
        try {
            const { roomId, title, startTime, endTime } = body;

            const start = new Date(startTime);
            const end = new Date(endTime);

            if (start >= end) {
                set.status = 400;
                return { error: 'Start time must be before end time' };
            }

            // Use the authenticated user's ID
            const bookingId = await bookingService.createBooking({
                userId: user!.id, // Guaranteed by isSignedIn guard
                roomId,
                title,
                startTime: start,
                endTime: end
            });

            set.status = 201;
            return { message: 'Booking created successfully', id: bookingId };
        } catch (error: any) {
            if (error.message === 'Room is not available for the selected time range.') {
                set.status = 409;
                return { error: error.message };
            }
            console.error(error);
            set.status = 500;
            return { error: 'Internal Server Error' };
        }
    }, {
        isSignedIn: true, // Auth Guard
        body: t.Object({
            roomId: t.Number(),
            title: t.String(),
            startTime: t.String({ format: 'date-time' }),
            endTime: t.String({ format: 'date-time' })
        }),
        detail: {
            summary: 'Create a new booking',
            tags: ['Bookings']
        }
    })
    .get('/', async ({ query }) => {
        const from = query.from ? new Date(query.from) : undefined;
        const to = query.to ? new Date(query.to) : undefined;

        return await bookingService.getBookings({ from, to });
    }, {
        isSignedIn: true, // Auth Guard
        query: t.Object({
            from: t.Optional(t.String({ format: 'date-time' })),
            to: t.Optional(t.String({ format: 'date-time' }))
        }),
        detail: {
            summary: 'List bookings',
            tags: ['Bookings']
        }
    })
    .patch('/:id/approve', async ({ params, set }) => {
        // Logic for approving booking
        // Ideally move to service, but staying simple here
        const bookingId = parseInt(params.id);

        await db.update(bookings)
            .set({ status: 'confirmed' })
            .where(eq(bookings.id, bookingId));

        return { message: 'Booking approved' };
    }, {
        item: 'admin', // Admin Guard
        params: t.Object({
            id: t.String()
        }),
        detail: {
            summary: 'Approve a booking',
            tags: ['Bookings']
        }
    });
