from globals import allowed_file_types, save_path
from utils.msg import error
from uuid import uuid4 as uuid
import os
import re
from models.image import Image
from shutil import copyfile


class FileBlob:
	def __init__(self,filename):
		"""
			An alias that represents file
		"""
		self.filename = filename

	def save(self,newFileName):
		"""
			Saves the file to `save_path`
			`save_path` is present in the `globals.py`
			**filename needs to be provided
		"""
		filepath = os.path.join(save_path,self.filename)
		copyfile(filepath,newFileName)

class Files:
	def __init__(self):
		"""
			A utility class to handle files
		"""
		self.files = []
		self.paths = []
		self.status = "unsaved"
		self.mode = "create"

	def __getExtension(self,file):
		"""
			Returns the extension of the file
			file should be either FileBlob or file received using request
		"""
		return re.split(r"\.",file.filename).pop()

	def __is_valid_file(self,file):
		"""
			Check if a file is valid or not
			uses `allowed_file_types` present in `globals.py` to check for validity
			file should be either FileBlob or file received using request
		"""
		filetype = self.__getExtension(file)

		if filetype in allowed_file_types:
			return True
		return False


	def append(self,file):
		"""
			Adds a new file to the queue
			file should be either FileBlob or file received using request
		"""
		if type(file) != str:
			if self.__is_valid_file(file):
				newFileName = str(uuid()) + "." + self.__getExtension(file)
				self.files.append(file)
				self.paths.append(newFileName)
				return newFileName
			else:
				raise Exception(error("INVALID_FILE"))

	def createCopy(self,file):
		"""
			Creates a copy of given file
			file should be either FileBlob or file received using request
		"""
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
		"""
			Adds the file to the delete queue
			file should be either FileBlob or file received using request
		"""
		if type(file) == str:
			self.mode = "delete"
			self.paths.append(os.path.join(save_path,file))
		
	def commit(self):
		"""
			Make the changes
			Without it no file will get added or deleted
		"""
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
