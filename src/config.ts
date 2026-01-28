const getEnv = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || '';
};

export const config = {
    db: {
        host: getEnv('DB_HOST', false) || 'localhost',
        user: getEnv('DB_USER', false) || 'root',
        password: getEnv('DB_PASSWORD', false) || '', // Allow empty
        name: getEnv('DB_NAME', false) || 'arbiter_db',
    },
    auth: {
        secret: getEnv('BETTER_AUTH_SECRET', false) || 'super-secret-key-123456',
    },
    server: {
        port: Number(getEnv('PORT', false)) || 3000
    }
};
