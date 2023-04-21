import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";

(async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(morgan('dev'));
  app.use(helmet());

  await setupDatabase();

  app.get('/', (req, res) => {
    return res.send('Hello World from API-CONCERTS!');
  });

  const port = 3002;
  app.listen(port, () => {
    console.log(`API-CONCERTS running on http://localhost:${port} !`);
  });
})();