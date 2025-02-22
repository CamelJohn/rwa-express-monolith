import supertest from 'supertest';

export const expectUserResponse = (response: supertest.Response, user: any) => {
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username');
    expect(response.body.user).toHaveProperty('bio');
    expect(response.body.user).toHaveProperty('image');
    expect(response.body.user.email).toEqual(user.email);
    expect(response.body.user.token).not.toBe(null);
    expect(response.body.user.username).toEqual(user.username);
    expect(response.body.user.bio).toEqual(null);
    expect(response.body.user.image).toEqual(null);
};