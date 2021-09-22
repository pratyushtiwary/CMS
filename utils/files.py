from globals import allowed_file_types, save_path
from utils.msg import error
from uuid import uuid4 as uuid
import os
import re
from models.image import Image


class Files:
	def __init__(self):
		self.files = []
		self.paths = []
		self.status = "unsaved"

	def __getExtension(self,file):
		return re.split(r"\.",file.filename).pop()

	def __is_valid_file(self,file):
		filetype = self.__getExtension(file)

		if filetype in allowed_file_types:
			return True
		return False


	def append(self,file):
		if self.__is_valid_file(file):
			newFileName = str(uuid()) + "." + self.__getExtension(file)
			self.files.append(file)
			self.paths.append(newFileName)
			return newFileName
		else:
			raise Exception(error("INVALID_FILE"))

	def commit(self):
		if len(self.files) > 0:
			files = self.files
			paths = self.paths

			for i in range(len(files)):
				files[i].save(os.path.join(save_path,paths[i]))

		self.status = "saved"

	def __del__(self):
		del self.files
		del self.paths
