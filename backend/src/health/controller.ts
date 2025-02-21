import { type RequestHandler } from 'express'
import database from '../database';

interface Controller {
    health_check: RequestHandler;
}

const controller: Controller = {
    health_check: async (req, res, next) => {
        try {
            await database.connection.authenticate({
                logging: false,
            });
    
            res.status(200).json({
                status: 'Healthy',
                services: {
                    database: true,
                },
            });
        } catch (error) {
            console.log({ error });
            res.status(503).json({
                status: 'Unhealthy',
                services: {
                    database: false,
                },
                error,
            });
        }
    }
}

export default controller;