const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const os = require("os");
const sharp = require('sharp');

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

app.post('/api/v1/nsfw/image', upload.single('image'), _filePathMiddleware, async (req, res) => {
  const buffer = await sharp(req.newFilePath).toBuffer();
  const predictions = await nsfw.processImage(buffer);
  res.status(200).json(predictions);
});

app.post('/api/v1/nsfw/gif', upload.single('gif'), _filePathMiddleware, async (req, res) => {
  const buffer = await sharp(req.newFilePath).toBuffer();
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
function _filePathMiddleware(req, res, next) {
  if (!req.file) {
    return res.status(400).send('Missing multipart/form-data');
  }

  const newFilePath = req.file.destination + '/Resized-' + req.file.filename;
  // Resize image to 299x299
  sharp(req.file.path)
    .resize(299, 299, { fit: 'contain' })
    .flatten()
    .toFile(newFilePath)
    .then(() => {
      req.newFilePath = newFilePath;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error resizing image');
    });
}

// Keep the model in memory, make sure it's loaded only once.
nsfw.load_model().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
