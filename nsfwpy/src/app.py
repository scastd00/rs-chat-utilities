import os

from flask import Flask
from flask_restful import Api

from endpoints.Endpoints import NSFWImage, Health

app = Flask(__name__)
api = Api(app)

api.add_resource(Health, '/api/v1/health')
api.add_resource(NSFWImage, '/api/v1/nsfw/image')
# api.add_resource(NSFWGif, '/api/v1/nsfw/gif')

if __name__ == '__main__':
	app.run(
		host=os.getenv('HOST_ADDR'),
		port=os.getenv('PORT')
	)
