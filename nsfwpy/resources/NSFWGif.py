import tensorflow as tf
import tensorflow_io as tfio
from flask_restful import Resource


def preprocess_gif(gif_path, size):
	"""
	Resize a gif to a fixed size overwriting the original gif.

	:param gif_path: Path to the gif
	:param size: Target size
	:return: None
	"""
	# Read the gif from /tmp
	gif_string = open(gif_path, 'rb').read()
	# Decode it into a dense vector
	gif = tf.image.decode_gif(gif_string)
	# Resize it to fixed shape
	gif = tf.image.resize(gif, [size, size], preserve_aspect_ratio=True)
	# Encode it back to GIF
	gif_string = tfio.image.encode_gif(gif)
	# Write the compressed gif to /tmp
	with open(gif_path, 'wb') as f:
		f.write(gif_string.numpy())


class NSFWGif(Resource):
	pass
