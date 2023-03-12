from flask import Flask
from flask_restful import Api

from resources.Health import Health
from resources.NSFWGif import NSFWGif
from resources.NSFWImage import NSFWImage

app = Flask(__name__)
api = Api(app)

api.add_resource(NSFWImage, '/api/v1/nsfw/image')
api.add_resource(NSFWGif, '/api/v1/nsfw/gif')
api.add_resource(Health, '/api/v1/health')


if __name__ == '__main__':
	app.run()
