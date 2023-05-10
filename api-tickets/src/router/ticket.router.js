import {Router} from "express";
import { create } from "../controller/ticket.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const ticketRouter = Router();

ticketRouter.post('/', isAuth, create);

export default ticketRouter;