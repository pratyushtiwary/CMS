from globals import dbname, dbusername, dbpassword, dbhost
import mysql.connector

class DB:
	def __init__(self):
		"""
			DB class to interact with the database
		"""
		try:
			self.mydb = mysql.connector.connect(
				host=dbhost,
				user=dbusername,
				password=dbpassword,
				database=dbname
			)
			return self.mydb
		except Exception as e:
			print("MYSQL Error :",e)
			exit()

	def __del__(self):
		self.mydb.close()