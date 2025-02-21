import Joi from 'joi';

export const tokenValidationSchema = Joi.object({
    authorization: Joi.string().pattern(/^Bearer\s.+$/).required(),
}).unknown(true);