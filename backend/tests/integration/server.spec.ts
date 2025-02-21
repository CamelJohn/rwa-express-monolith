import supertest from 'supertest';
import express from 'express';
import { app, database } from '../../src';
import { new_user, registered_user, unregistered_user } from './fixtures/user.fixture';

describe('Express App', () => {
    let token: string;
    let headers: Record<string, string>;

    const server = supertest(app);
    it('should be defined', async () => {
        expect(app).toBeDefined();
        expect(app).toBeInstanceOf(express.application.constructor);
    });

    describe('Health Check - GET /health should return status', () => {
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

    describe('Catch All', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await server.get('/unknown-route');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                name: 'NotFoundError',
                message: 'Not Found',
            });
        });
    });

    describe('Auth Routes', () => {
        describe('Register - POST /auth/register', () => {
            it('should register a new user', async () => {
                const response = await server.post('/api/v1/auth/users').send(new_user);

                expect(response.status).toBe(201);

                expect(response.body).toHaveProperty('user');

                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user).toHaveProperty('token');
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user).toHaveProperty('bio');
                expect(response.body.user).toHaveProperty('image');

                expect(response.body.user.email).toEqual(new_user.user.email);
                expect(response.body.user.token).not.toBe(null);
                expect(response.body.user.username).toEqual(new_user.user.username);
                expect(response.body.user.bio).toEqual(null);
                expect(response.body.user.image).toEqual(null);

                expect(response.headers['set-cookie'][0]).toMatch(
                    /rwa-jwt=.+; Path=\/; HttpOnly; Secure/
                );

                token = response.body.user.token;
                headers = { Authorization: `Bearer ${token}` };
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
                const response = await server
                    .post('/api/v1/auth/users/login')
                    .send(registered_user);

                expect(response.status).toBe(200);

                expect(response.body).toHaveProperty('user');

                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user).toHaveProperty('token');
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user).toHaveProperty('bio');
                expect(response.body.user).toHaveProperty('image');

                expect(response.body.user.email).toEqual(registered_user.user.email);
                expect(response.body.user.token).not.toBe(null);
                expect(response.body.user.bio).toEqual(null);
                expect(response.body.user.image).toEqual(null);

                expect(response.headers['set-cookie'][0]).toMatch(
                    /rwa-jwt=.+; Path=\/; HttpOnly; Secure/
                );
            });
            it('should reject an unregistered user', async () => {
                const response = await server
                    .post('/api/v1/auth/users/login')
                    .send(unregistered_user);

                expect(response.status).toBe(401);

                expect(response.body).toEqual({
                    message: 'Invalid credentials',
                    name: 'UnauthorizedError',
                });
            });
        });
    });
});
