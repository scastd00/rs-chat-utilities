const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const dotenv = require('dotenv').config({ path: path.resolve(process.cwd(), 'env', '.env') });
const fs = require('fs');
const preprocessImage = require('./nsfw/preprocess');

const app = express();
const nsfw = require('./nsfw');

app.use(cors());
app.use(bodyParser.json());

const port = dotenv.parsed.PORT || 3000;

app.post('/api/v1/nsfw/image', preprocessImage, async (req, res) => {
  const predictions = await nsfw.processImage(req.fileBuffer);

  res.status(200).json(predictions);

  // Delete the local file
  fs.rmSync(req.body.imagePath);
});

app.post('/api/v1/nsfw/gif', preprocessImage, async (req, res) => {
  const predictions = await nsfw.processGif(req.fileBuffer);

  res.status(200).json(predictions);

  // Delete the local file
  fs.rmSync(req.body.imagePath);
});

// Keep the model in memory, make sure it's loaded only once.
nsfw.load_model().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
