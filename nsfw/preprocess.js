const sharp = require('sharp');

/**
 * Middleware to extract the image buffer from the request.
 *
 * @param req - Request object.
 * @param res - Response object.
 * @param next - Next middleware.
 * @returns {Promise<*>} - Response if image is missing, otherwise next middleware.
 */
async function imageBufferMiddleware(req, res, next) {
  const { imagePath } = req.body;

  if (!imagePath) {
    return res.status(400).send("Missing image path.");
  }

  // Resize image to 299x299
  req.fileBuffer = await sharp(imagePath)
    .resize(299, 299, { fit: 'contain' })
    .flatten()
    .jpeg({ quality: 100 })
    .toBuffer();

  next();
}

/**
 * Middleware to extract the gif buffer from the request.
 *
 * @param req - Request object.
 * @param res - Response object.
 * @param next - Next middleware.
 * @returns {Promise<*>} - Response if gif is missing, otherwise next middleware.
 */
async function gifBufferMiddleware(req, res, next) {
  const { imagePath } = req.body;

  if (!imagePath) {
    return res.status(400).send("Missing gif path.");
  }

  // Resize gif to 299x299
  req.fileBuffer = await sharp(imagePath, { animated: true })
    .resize(299, 299, { fit: 'contain' })
    .gif({ effort: 4 })
    .toBuffer();

  next();
}

module.exports = { imageBufferMiddleware, gifBufferMiddleware };
