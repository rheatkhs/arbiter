import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        admin()
    ],
    secret: process.env.BETTER_AUTH_SECRET || "super-secret-key-123456" // Should be in .env
});
