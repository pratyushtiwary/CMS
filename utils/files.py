from globals import allowed_file_types, save_path
from utils.msg import error
from uuid import uuid4 as uuid
import os
import re
from models.image import Image
from shutil import copyfile


class FileBlob:
	def __init__(self,filename):
		self.filename = filename

	def save(self,newFileName):
		filepath = os.path.join(save_path,self.filename)
		copyfile(filepath,newFileName)

class Files:
	def __init__(self):
		self.files = []
		self.paths = []
		self.status = "unsaved"
		self.mode = "create"

	def __getExtension(self,file):
		return re.split(r"\.",file.filename).pop()

	def __is_valid_file(self,file):
		filetype = self.__getExtension(file)

		if filetype in allowed_file_types:
			return True
		return False


	def append(self,file):
		if type(file) != str:
			if self.__is_valid_file(file):
				newFileName = str(uuid()) + "." + self.__getExtension(file)
				self.files.append(file)
				self.paths.append(newFileName)
				return newFileName
			else:
				raise Exception(error("INVALID_FILE"))

	def createCopy(self,file):
		if type(file)==str:
			file = FileBlob(file)
			newFileName = str(uuid()) + "." + self.__getExtension(file)
			self.files.append(file)
			self.paths.append(newFileName)
			return newFileName
		else:
			newFileName = str(uuid()) + "." + self.__getExtension(file)
			self.files.append(file)
			self.paths.append(newFileName)
			return newFileName

	def delete(self,file):
		if type(file) == str:
			self.mode = "delete"
			self.paths.append(os.path.join(save_path,file))
		
	def commit(self):
		if self.mode == "delete":
			if len(self.paths) >0:
				paths = self.paths
				for path in paths:
					if os.path.exists(path):
						os.remove(path)
		else:
			if len(self.files) > 0:
				files = self.files
				paths = self.paths

				for i in range(len(files)):
					files[i].save(os.path.join(save_path,paths[i]))

			self.status = "saved"

	def __del__(self):
		del self.files
		del self.paths
