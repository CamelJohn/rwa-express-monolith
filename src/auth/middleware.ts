import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { loginRequestSchema, loginResponseSchema, registerRequestSchema, registerResponseSchema, updateUserRequestSchema } from './validation.schemas';

const validate_login_request: RequestHandler = (req, res, next) => {
    const { error } = loginRequestSchema.validate(req.body);

    if (error) {
        next(new createHttpError.BadRequest(error.message));
    }

    next();
};

const validate_login_response: RequestHandler = (req, res, next) => {
    const { error } = loginResponseSchema.validate(req.body);

    if (error) {
        next(new createHttpError.InternalServerError(error.message));
    }

    next();
};

const validate_register_request: RequestHandler = (req, res, next) => {
    const { error } = registerRequestSchema.validate(req.body);

    if (error) {
        next(new createHttpError.BadRequest(error.message));
    }

    next();
};

const validate_register_response: RequestHandler = (req, res, next) => {
    const { error } = registerResponseSchema.validate(req.body);

    if (error) {
        next(new createHttpError.InternalServerError(error.message));
    }

    next();
};

export const validate_update_user_request: RequestHandler = (req, res, next) => {
    const { error } = updateUserRequestSchema.validate(req.body);

    if (error) {
        return next(new createHttpError.BadRequest(error.message));
    }

    next();
};

const middleware = {
    validate: {
        preLogin: validate_login_request,
        postLogin: validate_login_response,
        preRegister: validate_register_request,
        postRegister: validate_register_response,
        preUpdate: validate_update_user_request,
    },
};

export default middleware;