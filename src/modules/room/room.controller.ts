import { Elysia } from 'elysia';
import { roomService } from './room.service';

export const roomController = new Elysia({ prefix: '/rooms' })
    .get('/', async () => {
        return await roomService.getRooms();
    }, {
        detail: {
            summary: 'List all rooms',
            tags: ['Rooms']
        }
    });
