import { server, database } from '../src/index';

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
    await database.$connect();
});

afterAll(async () => {
    await database.$disconnect();
    server.close();
});
