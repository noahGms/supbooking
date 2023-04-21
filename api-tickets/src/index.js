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
    return res.json({message: 'Hello World from API-TICKETS !'})
  });

  const port = 3003;
  app.listen(port, () => {
    console.log(`API-TICKETS running on http://localhost:${port} !`);
  });
})();