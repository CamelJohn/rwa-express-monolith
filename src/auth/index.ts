import express from 'express';
import controller from './controller';
import middleware from './middleware';
import { verify_token } from '../middleware';

const auth_router = express.Router();

auth_router.post(
    '/users/login',
    middleware.validate.preLogin,
    controller.login,
    middleware.validate.postLogin
);

auth_router.post(
    '/users',
    middleware.validate.preRegister,
    controller.register,
    middleware.validate.postRegister
);

auth_router.use(verify_token);

auth_router.get('/user', controller.get);

auth_router.put('/user', middleware.validate.preUpdate, controller.update);

export default auth_router;
