import express from 'express';
import auth_router from './auth';
import { session_middleware } from './middleware';

const api_router = express.Router();

api_router.use('/auth', auth_router);

api_router.use(session_middleware);

export default api_router;