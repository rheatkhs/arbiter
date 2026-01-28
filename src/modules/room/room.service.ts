import { db } from '../../db';
import { rooms } from '../../db/schema';

export class RoomService {
    async getRooms() {
        return await db.select().from(rooms);
    }
}

export const roomService = new RoomService();
