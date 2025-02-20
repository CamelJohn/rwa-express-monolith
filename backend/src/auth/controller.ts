import { type RequestHandler } from 'express';
import { type ParamsDictionary } from 'express-serve-static-core';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';

import User from './user.model';
import { sessionStore } from '../';

interface BaseUser {
    email: string;
    username: string;
    password: string;
}

interface AuthUserDto {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
}

interface LoginUserResponse {
    user: AuthUserDto;
    sessionId: string;
}

interface LogingUserRequest {
    user: Omit<BaseUser, 'username'>;
}

interface RegisterUserRequest {
    user: BaseUser;
}

interface RegisterUserResponse {
    user: AuthUserDto;
}

interface Controller {
    login: RequestHandler<ParamsDictionary, LoginUserResponse, LogingUserRequest>;
    register: RequestHandler<ParamsDictionary, RegisterUserResponse, RegisterUserRequest>;
    get: RequestHandler;
    update: RequestHandler;
}

const controller: Controller = {
    login: async (req, res, next) => {
        const { user: dto } = req.body;

        const result = await User.findOne({ where: { email: dto.email } });

        if (!result) {
            return next(new createHttpError.Unauthorized('Invalid credentials'));
        }

        const is_authenticated = await bcrypt.compare(dto.password, result.password);

        if (!is_authenticated) {
            return next(new createHttpError.Unauthorized('Invalid credentials'));
        }

        const sessionId = await sessionStore.create(result.toJSON().id, { user: result.toAuthJSON() });

        try {
            res.status(200).send({ user: result.toAuthJSON(), sessionId });
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const { user: dto } = req.body;

            const result = await User.create(dto);

            res.status(201).send({
                user: result.toAuthJSON(),
            });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                next(new createHttpError.Conflict('User already exists'));
                return;
            }

            if (error instanceof ValidationError) {
                next(new createHttpError.BadRequest('Invalid user data'));
                return;
            }

            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const userSession = await sessionStore.get(req.params.sessionId);

            if (!userSession) {
                return next(new createHttpError.Unauthorized('Invalid session'));
            }

            const user = await User.findByPk(userSession.userId);

            if (!user) {
                return next(new createHttpError.Unauthorized('Invalid session'));
            }

            res.status(200).send({ user: user.toAuthJSON() });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {},
};

export default controller;
