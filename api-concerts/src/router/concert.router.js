import {Router} from 'express';
import {isAdmin, isAuth} from "../middleware/auth.middleware.js";
import concertController from "../controller/concert.controller.js";
import {notFound} from "../middleware/not-found.middleware.js";

const concertRouter = Router();

concertRouter.get('/', concertController.findAll);
concertRouter.get('/:id', notFound, concertController.findOne);
concertRouter.post('/', [isAuth, isAdmin], concertController.create);
concertRouter.put('/:id', [isAuth, isAdmin, notFound], concertController.update);
concertRouter.delete('/:id', [isAuth, isAdmin, notFound], concertController.destroy);
concertRouter.post('/:id/buy', [isAuth, notFound], concertController.buyTicket);

export default concertRouter;