import { Elysia, t } from 'elysia';
import { bookingService } from './booking.service';

export const bookingController = new Elysia({ prefix: '/bookings' })
    .post('/', async ({ body, set }) => {
        try {
            const { userId, roomId, title, startTime, endTime } = body;

            const start = new Date(startTime);
            const end = new Date(endTime);

            if (start >= end) {
                set.status = 400;
                return { error: 'Start time must be before end time' };
            }

            const bookingId = await bookingService.createBooking({
                userId,
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
        body: t.Object({
            userId: t.Number(),
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
        query: t.Object({
            from: t.Optional(t.String({ format: 'date-time' })),
            to: t.Optional(t.String({ format: 'date-time' }))
        }),
        detail: {
            summary: 'List bookings',
            tags: ['Bookings']
        }
    });
