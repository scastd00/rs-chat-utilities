import tensorflow as tf
from flask_restful import Resource


class Health(Resource):
	@staticmethod
	def get():
		print(tf.reduce_sum(tf.random.normal([1000, 1000])))
		return 'OK', 200
