import supertest from 'supertest';

export function updateToken (response: supertest.Response)  {
    const token = response.body.user.token;
    const headers = { Authorization: `Bearer ${token}` };
    return { token, headers };
};