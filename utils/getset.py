from conn import DB

class GetSet:
	def __init__(self,tableName):
		self.conn = DB.__init__(self)
		self.tableName = tableName

	def get(self,keys,notFoundVal=False):
		email = self.email
		conn = self.conn.cursor()
		if type(keys) == str:
			sql = f"SELECT `{keys}` FROM `{self.tableName}` WHERE `email` = %s"
			vals = (email,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			conn.close()
			if res:
				return str(res[0])
			else:
				return notFoundVal
		elif type(keys) == list:
			cols = ""
			for i in range(len(keys)-1):
				cols += f"`{keys[i]}`,"

			cols += f"`{keys[len(keys)-1]}`"

			sql = F"SELECT {cols} FROM `{self.tableName}` WHERE `email` = %s"
			vals = (email,)
			conn.execute(sql,vals)
			res = list(conn.fetchone())
			for i in range(len(res)):
				res[i] = str(res[i])
			conn.close()
			if res:
				return tuple(res)
			else:
				return notFoundVal
		else:
			return notFoundVal

	def set(self,vdict:dict):
		email = self.email
		conn = self.conn.cursor()
		keys = list(vdict.keys())
		vals = list(vdict.values())
		updates = ""

		for i in range(len(keys)-1):
			updates += f"`{keys[i]}` = %s,"

		updates += f"`{keys[len(keys)-1]}` = %s"

		sql = f"UPDATE {self.tableName} SET {updates}"

		conn.execute(sql,vals)

		self.conn.commit()

		conn.close()

		return True