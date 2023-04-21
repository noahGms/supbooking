import {Router} from 'express';
import {login, register, whoami} from "../controller/auth.controller.js";
import {isAuth} from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.get('/whoami', isAuth, whoami);

export default authRouter;