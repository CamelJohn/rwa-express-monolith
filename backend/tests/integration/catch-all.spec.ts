import supertest from 'supertest';
import { app } from '../../src';

describe('Catch All', () => {
    const server = supertest(app);

    it('should return 404 for unknown routes', async () => {
        const response = await server.get('/unknown-route');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            name: 'NotFoundError',
            message: 'Not Found',
        });
    });
});
