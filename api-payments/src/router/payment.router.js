import {Router} from 'express';
import {confirmPayment, processPayment, cancelPayment, findOneByTicketId} from '../controller/payment.controller.js';
import {isAuth} from '../middleware/auth.middleware.js';

const paymentRouter = Router();

paymentRouter.get('/by-ticket/:ticketId', isAuth, findOneByTicketId);
paymentRouter.post('/process', isAuth, processPayment);
paymentRouter.post('/:id/cancel', isAuth, cancelPayment);
paymentRouter.get('/confirm/:token', isAuth, confirmPayment);

export default paymentRouter;