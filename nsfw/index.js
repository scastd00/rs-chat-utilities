const jpeg = require('jpeg-js');
const tf = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');

/**
 * Model is loaded once and kept in memory.
 * @type {nsfw.NSFWJS}
 */
let _model;
const NUM_CHANNELS = 3;

/**
 * Convert image to tensor.
 *
 * @param {Buffer} img
 * @returns {Promise<Tensor<Rank.R3>>} - Tensor with shape [height, width, 3]
 * @private
 */
const _convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const image = await jpeg.decode(img, { useTArray: true });

  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * NUM_CHANNELS);

  for (let i = 0; i < numPixels; i++)
    for (let c = 0; c < NUM_CHANNELS; ++c)
      values[i * NUM_CHANNELS + c] = image.data[i * 4 + c];

  return tf.tensor3d(values, [image.height, image.width, NUM_CHANNELS], 'int32');
};

// https://github.com/lovell/sharp can be used as preprocessing step to resize images.

/**
 * Process image and return the predictions.
 *
 * @param {Buffer} imageBuffer - Buffer containing the image.
 * @returns {Promise<Array<*>>} - Array of predictions.
 */
const processImage = async (imageBuffer) => {
  const image = await _convert(imageBuffer);
  const predictions = await _model.classify(image);
  image.dispose();
  // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor
  // go out of scope for its memory to be released).

  return predictions;
};

/**
 * Process gif and return the predictions.
 *
 * @param {Buffer} gifBuffer - Buffer containing the gif.
 * @returns {Promise<Array<*>>} - Array of predictions.
 */
const processGif = async (gifBuffer) => {
  // TODO: Implement
};

/**
 * Load the model. This function must be called before using the other functions.
 * In order to keep the model in memory (for better response times), it is recommended
 * to call this function before starting the server.
 *
 * @returns {Promise<void>} - Promise that resolves when the model is loaded.
 */
const load_model = async () => {
  // if (process.env.ENV.includes('prod')) {
  // }
  tf.enableProdMode();

  _model = await nsfw.load();
};

module.exports = {
  processImage,
  processGif,
  load_model
};
