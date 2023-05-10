import {Router} from "express";
import {cancel, create, findOne, paid} from "../controller/ticket.controller.js";
import {isAuth} from "../middleware/auth.middleware.js";

const ticketRouter = Router();

ticketRouter.post('/', isAuth, create);
ticketRouter.get('/:id', isAuth, findOne);
ticketRouter.put('/:id/paid', isAuth, paid);
ticketRouter.post('/:id/cancel', isAuth, cancel);

export default ticketRouter;