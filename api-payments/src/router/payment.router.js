import {Router} from 'express';
import {confirmPayment, processPayment} from '../controller/payment.controller.js';
import {isAuth} from '../middleware/auth.middleware.js';

const paymentRouter = Router();

paymentRouter.post('/process', isAuth, processPayment);
paymentRouter.get('/confirm/:token', isAuth, confirmPayment);

export default paymentRouter;