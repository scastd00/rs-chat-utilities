from flask_restful import Resource


class Health(Resource):
	@staticmethod
	def get():
		return 'OK', 200
