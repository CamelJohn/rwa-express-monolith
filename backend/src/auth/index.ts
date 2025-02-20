import express from 'express';
import controller from './controller';
import {
    validate_login_request,
    validate_login_response,
    validate_register_request,
    validate_register_response,
} from './middleware';

const auth_router = express.Router();

auth_router.post('/users/login', validate_login_request, controller.login, validate_login_response);
auth_router.post(
    '/users',
    validate_register_request,
    controller.register,
    validate_register_response
);
auth_router.get('/user/:sessionId', controller.get);
auth_router.put('/user', controller.update);

export default auth_router;
