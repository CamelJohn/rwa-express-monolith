import { server, database } from '../src/index';

beforeAll(async () => {
    await database.$connect();
});

afterAll(async () => {
    await database.$disconnect();
    server.close();
});