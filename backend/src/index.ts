import http from 'node:http';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';

import env from './services/env';
import database from './database';
import api_router from './api.routes';
import health_check_router from './health';
import { catch_all, error_handler } from './middleware';

const PORT = env.SERVER_PORT;

const app = express();

const server = http.createServer(app);

(async () => {
    try {
        await database.$connect();
        
        app.use(
            express.json(),
            express.urlencoded({ extended: true }),
            cors(),
            helmet(),
            morgan('dev')
        );

        app.use('/health', health_check_router);

        app.use('/api/v1', api_router);

        app.use('*', catch_all);

        app.use(error_handler);
    } catch (error) {
        await database.$disconnect();
        process.exit(1);
    }
})();

server.listen(PORT, () => console.info('Server is running on port', PORT));

export { app, server, database}