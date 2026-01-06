import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;
