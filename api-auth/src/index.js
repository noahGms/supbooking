import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";
import authRouter from "./router/auth.router.js";

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(morgan('dev'));
  app.use(helmet());

  await setupDatabase();

  app.use('/', authRouter)

  const port = 3001;
  app.listen(port, () => {
    console.log(`API-AUTH running on http://localhost:${port} !`);
  });
})();