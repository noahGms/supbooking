import {Router} from "express";
import ticketController from "../controller/ticket.controller.js";
import {isAuth} from "../middleware/auth.middleware.js";
import {notFound} from "../middleware/not-found.middleware.js";

const ticketRouter = Router();

ticketRouter.post('/', isAuth, ticketController.create);
ticketRouter.get('/:id', [isAuth, notFound], ticketController.findOne);
ticketRouter.put('/:id/paid', [isAuth, notFound], ticketController.setPaid);
ticketRouter.post('/:id/cancel', [isAuth, notFound], ticketController.cancel);

export default ticketRouter;