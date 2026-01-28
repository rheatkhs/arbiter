import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { bookingController } from './modules/booking/booking.controller';
import { roomController } from './modules/room/room.controller';

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Arbiter API',
        version: '1.0.0',
        description: 'Room & Agenda Booking System Backend'
      }
    }
  }))
  .use(roomController)
  .use(bookingController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
