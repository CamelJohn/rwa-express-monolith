import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import Joi from 'joi';

const loginRequestSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).required(),
});

const loginResponseSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        username: Joi.string().required(),
        bio: Joi.string().allow(null).required(),
        image: Joi.string().allow(null).required(),
    }).required(),
    sessionId: Joi.string().required(),
});

const registerRequestSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).required(),
});

const registerResponseSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        username: Joi.string().required(),
        bio: Joi.string().allow(null).required(),
        image: Joi.string().allow(null).required(),
    }).required(),
});

export const validate_login_request: RequestHandler = (req, res, next) => {
    const { error } = loginRequestSchema.validate(req.body);

    if (error) {
        next(new createHttpError.BadRequest(error.message));
    }

    next();
}

export const validate_login_response: RequestHandler = (req, res, next) => {
    const { error } = loginResponseSchema.validate(req.body);

    if (error) {
        next(new createHttpError.InternalServerError(error.message));
    }

    next();
}

export const validate_register_request: RequestHandler = (req, res, next) => {
    const { error } = registerRequestSchema.validate(req.body);

    if (error) {
        next(new createHttpError.BadRequest(error.message));
    }

    next();
}

export const validate_register_response: RequestHandler = (req, res, next) => {
    const { error } = registerResponseSchema.validate(req.body);

    if (error) {
        next(new createHttpError.InternalServerError(error.message));
    }

    next();
}

