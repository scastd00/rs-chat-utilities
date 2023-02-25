const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const os = require("os");
const fs = require('fs');
const preprocessImage = require('./nsfw/preprocess');

const app = express();
const nsfw = require('./nsfw');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => cb(null, file.originalname)
  })
});

app.use(cors());
app.use(bodyParser.json());

const port = /*dotenv.config().parsed.PORT ||*/ 3000;

app.post('/api/v1/nsfw/image', upload.single('image'), preprocessImage, async (req, res) => {
  const predictions = await nsfw.processImage(req.fileBuffer);
  const jsonResult = {
    path: req.file.path,
    predictions
  };

  res.status(200).json(jsonResult);
  console.log(jsonResult);

  // Delete the local file
  fs.rmSync(req.file.path);
});

app.post('/api/v1/nsfw/gif', upload.single('gif'), preprocessImage, async (req, res) => {
  const predictions = await nsfw.processGif(req.fileBuffer);
  const jsonResult = {
    path: req.file.path,
    predictions
  };

  res.status(200).json(jsonResult);
  console.log(jsonResult);

  // Delete the local file
  fs.rmSync(req.file.path);
});

// Keep the model in memory, make sure it's loaded only once.
nsfw.load_model().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
