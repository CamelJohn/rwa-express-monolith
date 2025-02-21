import { type ErrorRequestHandler, type RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { tokenValidationSchema } from './validation.schemas';
import tokenService from './services/token';

export const catch_all: RequestHandler = (req, res, next) => {
    next(createHttpError.NotFound());
};

export const error_handler: ErrorRequestHandler = (error, req, res, next) => {
    if (createHttpError.isHttpError(error)) {
        res.status(error.status).send({
            message: error.message,
            name: error.name,
        });
    } else {
        res.status(500).send({
            name: 'Internal Server Error',
            message: error.message,
        });
    }
};

export const verify_token: RequestHandler = async (req, res, next) => {
    try {
        const { error } = tokenValidationSchema.validate(req.headers);

        if (error) {
            throw new createHttpError.BadRequest(error.message);
        }

        if (!req.headers.authorization) {
            throw new createHttpError.Unauthorized('Missing token');
        }

        const token = req.headers.authorization.replace(/^Bearer\s/, '');
        
        tokenService.validate(token);

        const payload = tokenService.parse(token);

        await tokenService.get(payload.userId);

        next();
    } catch (error) {
        next(error);
    }
};