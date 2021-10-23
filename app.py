from flask import Flask, Response, send_from_directory
from flask_cors import CORS
import globals
from api import api
from utils.msg import error
import os
import mimetypes
import time

app = Flask(__name__)

if globals.max_file_size:
	app["MAX_CONTENT_LENGTH"] = globals.max_file_size * 1024 * 1024

CORS(app)


app.register_blueprint(api,url_prefix='/api')

@app.route("/images/<path:path>")
def showImage(path):
	return send_from_directory(globals.save_path,path)

# @app.before_request
# def before_request():
# 	time.sleep(5)

if __name__ == "__main__":
	app.run()