import { db } from './index';
import { users, rooms, bookings } from './schema';
import { faker } from '@faker-js/faker';

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Create Users
    const usersData: (typeof users.$inferInsert)[] = [];
    for (let i = 0; i < 20; i++) {
        usersData.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: faker.helpers.arrayElement(['admin', 'user']),
        });
    }
    await db.insert(users).values(usersData);
    console.log('✅ Created 20 users');

    // We need to fetch the created users to get their IDs for bookings
    // (In a real scenario w/ strict foreign keys, we need valid IDs)
    // Limited to the ones we just inserted or all existing.
    // For simplicity, let's fetch all users.
    const allUsers = await db.select().from(users);

    // 2. Create Rooms
    const roomsData: (typeof rooms.$inferInsert)[] = [];
    for (let i = 0; i < 10; i++) {
        roomsData.push({
            name: `${faker.commerce.department()} Room`,
            capacity: faker.number.int({ min: 5, max: 50 }),
            location: `Floor ${faker.number.int({ min: 1, max: 10 })}`,
            isActive: true, // simplified
        });
    }
    await db.insert(rooms).values(roomsData);
    console.log('✅ Created 10 rooms');

    const allRooms = await db.select().from(rooms);

    // 3. Create Bookings
    const bookingsData: (typeof bookings.$inferInsert)[] = [];
    for (let i = 0; i < 70; i++) {
        const user = faker.helpers.arrayElement(allUsers);
        const room = faker.helpers.arrayElement(allRooms);

        // Future dates to ensure they show up in lists usually
        const startTime = faker.date.soon({ days: 30 });
        const endTime = new Date(startTime.getTime() + faker.number.int({ min: 30, max: 180 }) * 60000); // 30-180 mins later

        bookingsData.push({
            userId: user.id,
            roomId: room.id,
            title: faker.company.catchPhrase(),
            startTime: startTime,
            endTime: endTime,
            status: faker.helpers.arrayElement(['pending', 'confirmed', 'rejected']),
        });
    }

    // Note: This bulk insert might strictly violate the "Arbiter" no-overlap logic if purely random.
    // But for seeding "100 data" quickly, we usually bypass complex business logic validation on the DB level 
    // unless we use the service. Using `db.insert` bypasses the service check. 
    // This is acceptable for seed data unless strict constraints exist in DB triggers (which we don't have).
    await db.insert(bookings).values(bookingsData);
    console.log('✅ Created 70 bookings');

    console.log('🎉 Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
