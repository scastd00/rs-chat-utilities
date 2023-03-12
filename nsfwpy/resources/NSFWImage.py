import tensorflow as tf
from flask_restful import Resource, reqparse


def preprocess_image(image_path, size):
	"""
	Resize an image to a fixed size overwriting the original image.

	:param image_path: Path to the image
	:param size: Target size
	:return: None
	"""
	# Read the image from /tmp
	image_string = open(image_path, 'rb').read()

	# Decode it into a dense vector
	image = tf.io.decode_image(image_string, channels=3, dtype=tf.dtypes.uint8)

	# Resize it to fixed shape
	image = tf.image.resize(image, [size, size], preserve_aspect_ratio=True)
	image = tf.cast(image, tf.uint8)

	# Encode it back to JPEG
	# Todo: Check if this is the best quality and option
	image_string = tf.io.encode_jpeg(image, quality=100, optimize_size=True)

	# Write the compressed image to the same path
	with open(f'{image_path}.resized', 'wb') as f:
		f.write(image_string.numpy())


class NSFWImage(Resource):
	@staticmethod
	def post():
		parser = reqparse.RequestParser()
		parser.add_argument('imagePath', type=str, required=True, help='This field cannot be left blank')
		data = parser.parse_args()
		image_path = data['imagePath']
		preprocess_image(image_path, 299)
		return data, 200
