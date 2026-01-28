import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { bookingController } from './modules/booking/booking.controller';
import { roomController } from './modules/room/room.controller';
import { config } from './config';
import { auth } from './auth';

const app = new Elysia()
  .use(serverTiming())
  // Security Headers & CORS
  .use(cors())
  // centralized error handling
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { success: false, error: 'Not Found' };
    }
    console.error(`[Error] ${code}:`, error);
    return {
      success: false,
      error: (error as any).message || 'Internal Server Error',
      code
    };
  })
  .use(swagger({
    documentation: {
      info: {
        title: 'Arbiter API',
        version: '1.0.0',
        description: 'Room & Agenda Booking System Backend'
      },
      servers: [
        { url: `http://localhost:${config.server.port}`, description: 'Local Server' }
      ]
    }
  }))
  .use(roomController)
  .use(bookingController)
  .all("/api/auth/*", ({ request }) => auth.handler(request))
  .listen(config.server.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
