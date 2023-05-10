import {Router} from "express";
import { create, findOne, paid } from "../controller/ticket.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const ticketRouter = Router();

ticketRouter.post('/', isAuth, create);
ticketRouter.get('/:id', isAuth, findOne);
ticketRouter.put('/:id/paid', isAuth, paid);

export default ticketRouter;