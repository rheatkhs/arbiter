import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "mysql",
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        database: process.env.DB_NAME || "arbiter_db",
        ...(process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {}),
    },
} satisfies Config;
