import { db } from './index';
import { users, rooms, bookings, accounts } from './schema';
import { faker } from '@faker-js/faker';

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Create Users
    const usersData: (typeof users.$inferInsert)[] = [];
    const accountsData: (typeof accounts.$inferInsert)[] = [];

    for (let i = 0; i < 20; i++) {
        const userId = faker.string.uuid();
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const role = faker.helpers.arrayElement(['admin', 'user']);
        const now = new Date();

        usersData.push({
            id: userId,
            name: name,
            email: email,
            emailVerified: true,
            image: faker.image.avatar(),
            createdAt: now,
            updatedAt: now,
            role: role as 'admin' | 'user'
        });

        // Mock account for Better Auth (Password login usually requires an account or just password in some configs, but better-auth often uses 'account' table for providers, email/pass might store hash elsewhere or in account depending on config. 
        // Wait, Better Auth with email/password usually stores password hash in `account` table with providerId='credential' or similar? 
        // Actually, strictly better-auth v1 stores password in `account` table for `credential` provider.
        // Let's create a fake account entry so they can potentially login if we knew the hash. 
        // For seeding, we might just want rows to exist for foreign keys.
        accountsData.push({
            id: faker.string.uuid(),
            userId: userId,
            accountId: userId, // often same as user id for credential
            providerId: "credential",
            password: "$2a$10$YourHashedPasswordHere", // Placeholder hash
            createdAt: now,
            updatedAt: now,
        });
    }

    await db.insert(users).values(usersData);
    await db.insert(accounts).values(accountsData);
    console.log('✅ Created 20 users');

    const allUsers = await db.select().from(users);

    // 2. Create Rooms
    const roomsData: (typeof rooms.$inferInsert)[] = [];
    for (let i = 0; i < 10; i++) {
        roomsData.push({
            name: `${faker.commerce.department()} Room`,
            capacity: faker.number.int({ min: 5, max: 50 }),
            location: `Floor ${faker.number.int({ min: 1, max: 10 })}`,
            isActive: true,
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

        // Future dates
        const startTime = faker.date.soon({ days: 30 });
        const endTime = new Date(startTime.getTime() + faker.number.int({ min: 30, max: 180 }) * 60000);

        bookingsData.push({
            userId: user.id,
            roomId: room.id,
            title: faker.company.catchPhrase(),
            startTime: startTime,
            endTime: endTime,
            status: faker.helpers.arrayElement(['pending', 'confirmed', 'rejected']),
        });
    }

    await db.insert(bookings).values(bookingsData);
    console.log('✅ Created 70 bookings');

    console.log('🎉 Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
