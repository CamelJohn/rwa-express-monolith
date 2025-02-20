import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { createClient } from 'redis';
import { v4 as uuid } from 'uuid';

import env from './env';

const RedisStore = connectRedis(session);

const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

const session_handler = session({
    store: new RedisStore({ client: redisClient }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
});

interface UserSession {
    userId: string;
    expiresAt: number;
    data: Record<string, any>;
}

export class SessionStore {
    constructor(
        private client = createClient({
            socket: {
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
            },
        }),
        private readonly expiry_time = 60 * 60 * 24
    ) {
        client.on('error', (error) => {
            console.error('Redis client error:', error);
        });

        client.on('connect', () => {
            console.info('Redis client connected');
        });
    }

    async disconnect() {
        await this.client.quit();
        await this.client.disconnect();
    }

    async connect() {
        await this.client.connect();
    }

    async ping() {
        await this.client.ping();
    }

    async init() {
        await this.connect();
        await this.ping();
    }

    async create(userId: string, data: Record<string, any>) {
        const sessionId = uuid();
        const session: UserSession = {
            userId,
            expiresAt: Date.now() + 1000 * this.expiry_time,
            data,
        };

        const session_data = JSON.stringify(session);
        const key = `session:${sessionId}`;

        await this.client.setEx(key, this.expiry_time, session_data);

        return sessionId;
    }

    async get(sessionId: string) {
        const key = `session:${sessionId}`;
        const session_data = await this.client.get(key);

        if (!session_data) {
            return null;
        }

        const session: UserSession = JSON.parse(session_data);

        if (session.expiresAt < Date.now()) {
            await this.remove(sessionId);
            return null;
        }

        return session;
    }

    async remove(sessionId: string) {
        const key = `session:${sessionId}`;
        const result = (await this.client.del(key)) === 1;
        return result;
    }

    async extend(sessionId: string, minutes: number) {
        const session = await this.get(sessionId);

        if (!session) {
            return false;
        }

        session.expiresAt = Date.now() + minutes * 60 * 1000;

        const key = `session:${sessionId}`;
        const session_data = JSON.stringify(session);

        await this.client.setEx(key, minutes, session_data);
    }
}

export default session_handler;