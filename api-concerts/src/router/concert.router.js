import {Router} from 'express';
import {isAdmin, isAuth} from "../middleware/auth.middleware.js";
import {create, destroy, findAll, findOne, update} from "../controller/concert.controller.js";

const concertRouter = Router();

concertRouter.get('/', findAll);
concertRouter.get('/:id', findOne);
concertRouter.post('/', [isAuth, isAdmin], create);
concertRouter.put('/:id', [isAuth, isAdmin], update);
concertRouter.delete('/:id', [isAuth, isAdmin], destroy);

export default concertRouter;