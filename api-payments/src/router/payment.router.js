import {Router} from 'express';
import paymentController from '../controller/payment.controller.js';
import {isAuth} from '../middleware/auth.middleware.js';
import {notFound} from "../middleware/not-found.middleware.js";

const paymentRouter = Router();

paymentRouter.get('/by-ticket/:ticketId', isAuth, paymentController.findOneByTicketId);
paymentRouter.post('/process', isAuth, paymentController.process);
paymentRouter.post('/:id/cancel', [isAuth, notFound], paymentController.cancel);
paymentRouter.get('/confirm/:token', isAuth, paymentController.confirm);
paymentRouter.post('/verify-credit-card', isAuth, paymentController.verifyCreditCard);

export default paymentRouter;