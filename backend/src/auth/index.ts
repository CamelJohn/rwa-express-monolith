import express from 'express';
import controller from './controller';

const auth_router = express.Router();

auth_router.post('/users/login', controller.login);
auth_router.post('/users', controller.register);
auth_router.get('/user/:sessionId', controller.get);
auth_router.put('/user', controller.update);

export default auth_router;