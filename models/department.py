from conn import DB
from utils.msg import error

class Department(DB):
	def __init__(self):
		self.tableName = "department"

		self.conn = DB.__init__(self)


	def add(self,name):
		conn = self.conn.cursor()
		try:
			sql = f"""
				INSERT INTO `{self.tableName}`(`id`,`name`)
				VALUES(NULL,%s)
			"""

			vals = (name,)

			conn.execute(sql,vals)

			self.conn.commit()

			conn.close()

			return True
		except:
			self.conn.rollback()
			return error("SERVER_ERROR")

	def remove(self,id):
		conn = self.conn.cursor()
		try:
			sql = """
				DELETE FROM `{self.tableName}`
				WHERE `id`=%s
			"""

			vals = (id,)

			conn.execute(sql,vals)

			self.conn.commit()

			conn.close()

			return True
		except:
			self.conn.rollback()
			return error("SERVER_ERROR")

	def fetchAll(self):
		conn = self.conn.cursor()
		sql = f"SELECT `id`,`name` FROM `{self.tableName}`";

		conn.execute(sql)
		res = []
		rows = conn.fetchall()

		for row in rows:
			res.append({
				"id": row[0],
				"name": row[1]	
			})

		conn.close()

		return res