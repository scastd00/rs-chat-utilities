const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const dotenv = require('dotenv').config({ path: path.resolve(process.cwd(), 'env', '.env') });
const preprocess = require('./nsfw/preprocess');

const app = express();
const nsfw = require('./nsfw');

app.use(cors());
app.use(bodyParser.json());

const port = dotenv.parsed.PORT || 3000;

app.post('/api/v1/nsfw/image', preprocess.imageBufferMiddleware, async (req, res) => {
  const predictions = await nsfw.processImage(req.fileBuffer);

  res.status(200).json(predictions);
});

app.post('/api/v1/nsfw/gif', preprocess.gifBufferMiddleware, async (req, res) => {
  const predictions = await nsfw.processGif(req.fileBuffer);

  res.status(200).json(predictions);
});

// Keep the model in memory, make sure it's loaded only once.
nsfw.load_model().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
