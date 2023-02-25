const sharp = require('sharp');

/**
 * Middleware to extract the file buffer from the request.
 *
 * @param req - Request object.
 * @param res - Response object.
 * @param next - Next middleware.
 * @returns {*} - Response if file is missing, otherwise next middleware.
 */
async function fileBufferMiddleware(req, res, next) {
  if (!req.file) {
    return res.status(400).send("Missing file");
  }

  // Resize image to 299x299
  req.fileBuffer = await sharp(req.file.path)
    .resize(299, 299, { fit: 'contain' })
    .flatten()
    .jpeg({ quality: 100 })
    .toBuffer();

  next();
}

module.exports = fileBufferMiddleware;
