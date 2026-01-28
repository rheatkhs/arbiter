import { Elysia } from 'elysia';
import { db } from '../../db';
import { rooms } from '../../db/schema';

export const roomController = new Elysia({ prefix: '/rooms' })
    .get('/', async () => {
        return await db.select().from(rooms);
    }, {
        detail: {
            summary: 'List all rooms',
            tags: ['Rooms']
        }
    });
