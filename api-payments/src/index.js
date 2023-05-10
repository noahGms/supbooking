import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";
import dotenv from 'dotenv';
import paymentRouter from './router/payment.router.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(morgan('dev'));
  app.use(helmet());

  await setupDatabase();

  app.use('/payments', paymentRouter);

  const port = 3004;
  app.listen(port, () => {
    console.log(`API-PAYMENTS running on http://localhost:${port} !`);
  });
})();