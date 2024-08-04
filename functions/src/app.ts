import express from 'express';
import bodyParser from 'body-parser';
import { createNewArticle } from './create-new-article';
import { createNewImage } from './services/create-image/create-new-image';

const app = express();

app.use(bodyParser.json());

app.get('/createNewArticle', async (req: express.Request, res: express.Response) => {
  const { mission, subject, target_audiance, source, section, clientId } = req.body;

  if (!mission || !subject) {
    res.status(400).send('Missing required parameters');
    return;
  }

  const article = await createNewArticle(mission, subject, target_audiance ?? 'general', source, section, clientId);

  res.status(200).send(`${article}`);
});

app.get('/createNewImage', async (req: express.Request, res: express.Response) => {
  let { mission, subject, image, target_audiance } = req.body;

  if (!mission || !subject || !image) {
    res.status(400).send('Missing required parameters');
    return;
  }

  const { picture, url } = await createNewImage(mission, subject, image, target_audiance ?? 'general');

  res.status(200).send(`Creating new image at url ${url}: ${picture}`);
});

//http://127.0.0.1:5001/wonkasite-d43b5/us-central1/app/ping
app.get('/ping', (req: express.Request, res: express.Response) => {
  res.status(200).send('Pong');
});

//export app for firebase functions
export default app;
