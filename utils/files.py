from globals import allowed_file_types, save_path
from utils.msg import error
from uuid import uuid4 as uuid
import os
import re
from models.image import Image


def getExtension(file):
	return re.split(r"\.",file.filename).pop()

def is_valid_file(file):
	filetype = getExtension(file)

	if filetype in allowed_file_types:
		return True
	return False

def validate(files,keys):
	all_valid = []
	for key in keys:
		if files[key].filename != "":
			all_valid.append(is_valid_file(files[key]))

	if len(all_valid) == len(keys):
		return True

	return False


def uploader(files,id):
	img = Image()
	keys = list(files.keys())
	if validate(files,keys):
		for key in keys:
			newFileName = str(uuid()) + "." + getExtension(files[key])
			filepath = os.path.join(save_path,newFileName)
			files[key].save(filepath)
			imgId, status = img.add({
				"cid": id,
				"path": filepath
			})

			if status!=True:
				return imgId

		return True
	return error("INVALID_FILE")

