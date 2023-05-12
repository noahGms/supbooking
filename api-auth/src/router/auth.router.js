import {Router} from 'express';
import authController from "../controller/auth.controller.js";
import {isAuth} from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/whoami', isAuth, authController.whoami);

export default authRouter;