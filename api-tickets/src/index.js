import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";
import dotenv from 'dotenv';

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

  app.get('/tickets', (req, res) => {
    return res.json({message: 'Hello World from API-TICKETS !'})
  });

  const port = 3003;
  app.listen(port, () => {
    console.log(`API-TICKETS running on http://localhost:${port} !`);
  });
})();