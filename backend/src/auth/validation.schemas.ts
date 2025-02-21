import Joi from 'joi';

export const loginRequestSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).required(),
});

export const loginResponseSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        username: Joi.string().required(),
        bio: Joi.string().allow(null).required(),
        image: Joi.string().allow(null).required(),
    }).required(),
    sessionId: Joi.string().required(),
});

export const registerRequestSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).required(),
});

export const registerResponseSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        username: Joi.string().required(),
        bio: Joi.string().allow(null).required(),
        image: Joi.string().allow(null).required(),
    }).required(),
});

export const updateUserRequestSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string(),
        bio: Joi.string().allow(null),
        image: Joi.string().allow(null),
    }).min(1).required(),
});