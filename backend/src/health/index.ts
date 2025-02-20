import express from 'express';
import database from '../database';
import { sessionStore } from '..';

const health_check_router = express.Router();

health_check_router.get('/', async (req, res, next) => {
    try {
        await database.connection.authenticate({
            logging: false,
        });

        await sessionStore.ping();
        res.status(200).json({
            status: 'Healthy',
            services: {
                database: true,
                cache: true,
            },
        });
    } catch (error) {
        console.log({ error})
        res.status(503).json({
            status: 'Unhealthy',
            services: {
                database: false,
                cache: false,
            },
            error
        });
    }
});

export default health_check_router;
