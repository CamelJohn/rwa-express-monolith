import express from 'express';
import controller from './controller';

const health_check_router = express.Router();

health_check_router.get('/', controller.health_check);

export default health_check_router;
