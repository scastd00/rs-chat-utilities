import base64
import os
import random
import string

from flask_restful import Resource, reqparse
from nsfw_detector import predict

model = predict.load_model(os.getenv('MODEL_PATH'))
IMAGE_SIZE = 299


def classify_image(image_path):
	return predict.classify(model, image_path, IMAGE_SIZE)


def classify_gif(gif_path):
	# return predict.classify(model, image_path, IMAGE_SIZE)
	return ""


def random_string(size=10) -> str:
	return ''.join(random.choices(string.ascii_letters + string.digits, k=size))


class NSFWImage(Resource):
	@staticmethod
	def post():
		parser = reqparse.RequestParser()
		parser.add_argument('base64EncodedImage', type=str, required=True, help='This field cannot be left blank')
		data = parser.parse_args()

		# Decode and save image to a file in /tmp
		decoded_image = base64.b64decode(data['base64EncodedImage'])
		image_file = f'/tmp/decoded_image_{random_string()}.png'
		with open(image_file, 'w+b') as f:  # w+b is for writing bytes and create it if it doesn't exist
			f.write(decoded_image)

		classification = classify_image(image_file)

		# Delete the file
		os.remove(image_file)
		return classification.get(image_file), 200  # Return the classification for the image


class NSFWGif(Resource):
	@staticmethod
	def post():
		parser = reqparse.RequestParser()
		parser.add_argument('base64EncodedImage', type=str, required=True, help='This field cannot be left blank')
		data = parser.parse_args()
		return classify_gif(data['base64EncodedImage']), 200


class Health(Resource):
	@staticmethod
	def get():
		return 'OK', 200
