import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";
import concertRouter from "./router/concert.router.js";

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(morgan('dev'));
  app.use(helmet());

  await setupDatabase();

  app.use('/', concertRouter);

  const port = 3002;
  app.listen(port, () => {
    console.log(`API-CONCERTS running on http://localhost:${port} !`);
  });
})();