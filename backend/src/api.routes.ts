import express from 'express';
import auth_router from './auth';

const api_router = express.Router();

api_router.use('/auth', auth_router);

export default api_router;