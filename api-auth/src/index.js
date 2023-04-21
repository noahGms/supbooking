import express from 'express';

(async () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World from API-AUTH !');
  });

  const port = 3001;
  app.listen(port, () => {
    console.log(`API-AUTH running on http://localhost:${port} !`);
  });
})();