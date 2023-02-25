const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const os = require("os");

const app = express();
const ball_reply = require('./8-ball');
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

app.post('/api/v1/8ball', (req, res) => {
  res.status(200).json(
    ball_reply(req.body.question, req.body.lucky)
  );
});

app.post('/api/v1/nsfw/image', upload.single('image'), _fileBufferMiddleware, async (req, res) => {
  const predictions = await nsfw.processImage(req.fileBuffer);
  res.status(200).json(predictions);
});

app.post('/api/v1/nsfw/gif', upload.single('gif'), _fileBufferMiddleware, async (req, res) => {
  const predictions = await nsfw.processGif(req.fileBuffer);
  res.status(200).json(predictions);
});

/**
 * Middleware to extract the file buffer from the request.
 *
 * @param req - Request object.
 * @param res - Response object.
 * @param next - Next middleware.
 * @returns {*} - Response if file is missing, otherwise next middleware.
 * @private
 */
function _fileBufferMiddleware(req, res, next) {
  if (!req.file) {
    return res.status(400).send('Missing multipart/form-data');
  }

  req.fileBuffer = req.file.buffer;
  next();
}

// Keep the model in memory, make sure it's loaded only once.
nsfw.load_model().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
