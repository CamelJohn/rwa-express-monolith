import supertest from 'supertest';
import { app, database } from '../../src';

describe('Health Check - GET /health should return status', () => {
    const server = supertest(app);

    it('200 for a healthy service', async () => {
        const response = await server.get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'Healthy',
            services: {
                database: true,
            },
        });
    });

    it('503 for an unhealthy service', async () => {
        jest.spyOn(database.connection, 'authenticate').mockRejectedValue(
            new Error('Database connection failed')
        );
        const response = await server.get('/health');

        expect(response.status).toBe(503);
        expect(response.body).toEqual({
            status: 'Unhealthy',
            services: {
                database: false,
            },
            error: {},
        });
    });
});
