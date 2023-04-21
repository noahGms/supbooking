import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {setupDatabase} from "./config/db.js";

(async () => {
  const app = express();

  app.use(morgan('dev'));
  app.use(helmet());

  await setupDatabase();

  app.get('/', (req, res) => {
    res.send('Hello World from API-AUTH !');
  });

  const port = 3001;
  app.listen(port, () => {
    console.log(`API-AUTH running on http://localhost:${port} !`);
  });
})();