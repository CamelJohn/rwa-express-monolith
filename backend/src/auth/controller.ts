import { Request, type RequestHandler } from 'express';
import { type ParamsDictionary } from 'express-serve-static-core';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';

import User from './user.model';
import tokenService from '../services/token';
import { AuthUserDto, BaseUser } from './interfaces';

interface LoginUserResponse {
    user: AuthUserDto;
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

interface UpdateUserRequest {
    user: Partial<BaseUser & Pick<AuthUserDto, 'bio' | 'image'>>;
}

interface UpdateUserResponse {
    user: AuthUserDto;
}

interface Controller {
    login: RequestHandler<ParamsDictionary, LoginUserResponse, LogingUserRequest>;
    register: RequestHandler<ParamsDictionary, RegisterUserResponse, RegisterUserRequest>;
    get: RequestHandler;
    update: RequestHandler<ParamsDictionary,UpdateUserResponse, UpdateUserRequest>;
}

async function extract_current_user(req: Request) {
    if (!req.headers.authorization) {
        throw new createHttpError.Unauthorized('Missing token');
    }

    const token = req.headers.authorization.replace(/^Bearer\s/, '');

    tokenService.validate(token);

    const payload = tokenService.parse(token);

    const user = await User.findByPk(payload.userId);

    if (!user) {
        throw new createHttpError.NotFound('User not found');
    }

    return user;
}

const controller: Controller = {
    login: async (req, res, next) => {
        try {
            const { user: dto } = req.body;

            const result = await User.findOne({ where: { email: dto.email } });

            if (!result) {
                return next(new createHttpError.Unauthorized('Invalid credentials'));
            }

            const is_authenticated = await bcrypt.compare(dto.password, result.password);

            if (!is_authenticated) {
                return next(new createHttpError.Unauthorized('Invalid credentials'));
            }

            const token = await tokenService.get(result.id);

            res.cookie('rwa-jwt', token, { httpOnly: true, secure: true })
                .status(200)
                .send({ user: result.toAuthJSON() });
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const { user: dto } = req.body;

            const result = await User.create(dto);

            const token = tokenService.generate({ userId: result.id, email: result.email });

            await User.update({ token }, { where: { id: result.id }, returning: true });

            const user = await User.findByPk(result.id);

            if (!user) {
                return next(new createHttpError.Unauthorized('Invalid credentials'));
            }

            res.cookie('rwa-jwt', token, { httpOnly: true, secure: true }).status(201).send({
                user: user.toAuthJSON(),
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
            const user = await extract_current_user(req);

            res.cookie('rwa-jwt', user.token, { httpOnly: true, secure: true })
                .status(200)
                .send({ user: user.toAuthJSON() });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const user = await extract_current_user(req);

            await User.update(req.body.user, { where: { id: user.id } });
            
            const updated_user = await User.findByPk(user.id);

            if (!updated_user) {
                return next(new createHttpError.NotFound('User not found'));
            }

            res.cookie('rwa-jwt', updated_user.token, { httpOnly: true, secure: true })
                .status(200)
                .send({ user: updated_user.toAuthJSON() });
        } catch (error) {
            next(error);
        }
    },
};

export default controller;
