import { type ErrorRequestHandler, type RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { sessionStore } from '.';

export const catch_all: RequestHandler = (req, res, next) => {
    next(createHttpError.NotFound());
}

export const error_handler: ErrorRequestHandler = (error, req, res, next) => {
    if (createHttpError.isHttpError(error)) {
        res.status(error.status).send({
            message: error.message,
            original: error.name,
        });
    } else {
        res.status(500).send({
            name: 'Internal Server Error',
            message: error.message
        });
    }
}

export const session_middleware: RequestHandler = async (req, res, next) => {
    try {
        const session = await sessionStore.get(req.session.id);

        if (!session) {
            return next(new createHttpError.Unauthorized('Invalid session'));
        }

        next();
    } catch (error) {
        next(error);
    }
}