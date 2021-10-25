from globals import dbname, dbusername, dbpassword, dbhost
import mysql.connector

class DB:
	def __init__(self):
		"""
			DB class to interact with the database
		"""
		try:
			self.conn = mysql.connector.connect(
				host=dbhost,
				user=dbusername,
				password=dbpassword,
				database=dbname
			)
			return self.conn
		except Exception as e:
			print("MYSQL Connection Error :",e)
			exit()

	def __del__(self):
		if self.conn:
			self.conn.close()

def connect():
	"""
		A handy function to connect with the db,
		if you are not using OOP then use this
		Returns a db connector instance
	"""
	return mysql.connector.connect(
		host=dbhost,
		user=dbusername,
		password=dbpassword,
		database=dbname
	)