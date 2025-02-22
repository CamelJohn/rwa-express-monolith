import {
    named_registered_user,
    named_registered_user_update_bad_dto,
    named_registered_user_update_dto,
    named_registered_user_updated,
    new_user,
    registered_user,
    unregistered_user,
} from './fixtures/user.fixture';
import { app } from '../../src';
import supertest from 'supertest';
import { expectUserResponse } from './helpers/expectUserResponse';
import { updateToken } from './helpers/updateToken';

describe('Auth Routes', () => {
    let token: string;
    let headers: Record<string, string>;

    const server = supertest(app);
    describe('Register - POST /auth/register', () => {
        it('should register a new user', async () => {
            const response = await server.post('/api/v1/auth/users').send(new_user);
            expect(response.status).toBe(201);
            expectUserResponse(response, new_user.user);
            expect(response.headers['set-cookie'][0]).toMatch(
                /rwa-jwt=.+; Path=\/; HttpOnly; Secure/
            );

            ({ token, headers } = updateToken(response));
        });

        it('should handle conflicts for a duplicate user', async () => {
            const response = await server.post('/api/v1/auth/users').send(new_user);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                name: 'ConflictError',
                message: 'User already exists',
            });
        });
    });

    describe('Login - POST /auth/login', () => {
        it('should login an existing user', async () => {
            const response = await server.post('/api/v1/auth/users/login').send(registered_user);

            expect(response.status).toBe(200);

            expectUserResponse(response, named_registered_user.user);

            expect(response.headers['set-cookie'][0]).toMatch(
                /rwa-jwt=.+; Path=\/; HttpOnly; Secure/
            );
        });
        it('should reject an unregistered user', async () => {
            const response = await server.post('/api/v1/auth/users/login').send(unregistered_user);

            expect(response.status).toBe(401);

            expect(response.body).toEqual({
                message: 'Invalid credentials',
                name: 'UnauthorizedError',
            });
        });
    });

    describe('Get User - GET /auth/user', () => {
        it('should get the user details', async () => {
            const response = await server.get('/api/v1/auth/user').set(headers);

            expect(response.status).toBe(200);

            expectUserResponse(response, named_registered_user.user);
        });
        it('should fail without proper auth headers', async () => {
            const response = await server.get('/api/v1/auth/user');

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                message: '"authorization" is required',
                name: 'BadRequestError',
            });
        });
    });

    describe('Update User - PUT /auth/user', () => {
        it('should successfully update the user details', async () => {
            const response = await server
                .put('/api/v1/auth/user')
                .send(named_registered_user_update_dto)
                .set(headers);

            ({ token, headers } = updateToken(response));

            expect(response.status).toBe(200);
        });

        it('should get the updated details', async () => {
            const response = await server.get('/api/v1/auth/user').set(headers);

            expect(response.status).toBe(200);
            expectUserResponse(response, named_registered_user_updated.user);
        });

        it('should fail to update the user details for a bad request', async () => {
            const response = await server
                .put('/api/v1/auth/user')
                .send(named_registered_user_update_bad_dto)
                .set(headers);

            expect(response.body).toEqual({
                message: '"user" must have at least 1 key',
                name: 'BadRequestError',
            });

            expect(response.status).toBe(400);
        });
    });
});
