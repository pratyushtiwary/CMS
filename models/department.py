from conn import DB
from utils.msg import success,error

class Department(DB):
	def __init__(self):
		self.tableName = "department"
		self.vendorTable = "vendor"
		self.complaintTable = "complaint"
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

	def listAll(self,offset):
		conn = self.conn.cursor()
		offset = int(offset)
		sql = f"""
			SELECT `id`,`name`
			FROM {self.tableName}
			LIMIT 10
			OFFSET %s
		"""
		vals = (offset,)
		conn.execute(sql,vals)
		departments = []
		rows = conn.fetchall()
		for row in rows:
			sql = f"SELECT COUNT(*) FROM `{self.vendorTable}` WHERE `dept` = %s";
			vals = (row[0],)
			conn.execute(sql,vals)
			res = conn.fetchone()
			departments.append({
				"id": row[0],
				"name": row[1],
				"count": res[0]
			})
		if offset == 0:
			sql = f"""
				SELECT COUNT(*)
				FROM `{self.vendorTable}`
				WHERE `dept` IS NULL
			"""
			conn.execute(sql)
			row = conn.fetchone()
			departments.append({
				"id": -1,
				"name": "No Department",
				"count": row[0]
			})
		sql = f"SELECT COUNT(*) FROM {self.tableName}";
		conn.execute(sql)
		res = conn.fetchone()
		count = res[0]
		conn.close()

		final = {"departments": departments, "count": count+1}
		return final

	def delete(self,id):
		conn = self.conn.cursor()
		try:
			sql = f"""
				UPDATE `{self.vendorTable}` SET `dept` = NULL WHERE `dept` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)

			sql = f"""
				UPDATE `{self.complaintTable}` SET `dept` = NULL WHERE `dept` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)

			sql = f"""
				DELETE FROM `{self.tableName}` WHERE `id` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			self.conn.rollback()
			return error("SERVER_ERROR")

	def rename(self,id,name):
		conn = self.conn.cursor()
		try:
			sql = f"""
				UPDATE `{self.tableName}` SET `name` = %s WHERE `id` = %s
			"""
			vals = (name,id)
			conn.execute(sql,vals)
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			self.conn.rollback()
			return error("SERVER_ERROR")

	def view(self,id):
		conn = self.conn.cursor()
		if int(id) == -1:
			sql = f"""
				SELECT COUNT(*)
				FROM `{self.vendorTable}`
				WHERE `dept` IS NULL
			"""
			conn.execute(sql)
			res = conn.fetchone()
			final = {
				"name": "No Department",
				"count": res[0]
			}
			return success(final)
		else:
			sql = f"""
				SELECT `name`
				FROM `{self.tableName}`
				WHERE `id` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			if res:
				sql = f"SELECT COUNT(*) FROM `{self.vendorTable}` WHERE `dept` = %s"
				vals = (id,)
				conn.execute(sql,vals)
				r = conn.fetchone()
				count = r[0]
				final = {
					"name": res[0],
					"count": r[0]
				}
				return success(final)
			else:
				return error("NO_DEPARTMENT_FOUND")

	def viewEmployees(self,id,offset):
		count = 0
		conn = self.conn.cursor()
		if int(id) == -1:
			sql = f"SELECT COUNT(*) FROM `{self.vendorTable}` WHERE `dept` IS NULL";
			conn.execute(sql)
			res = conn.fetchone()
			count = res[0]
			sql = f"""
				SELECT `id`,`name`
				FROM `{self.vendorTable}`
				WHERE `dept` IS NULL
				LIMIT 10
				OFFSET %s
			"""
			vals = (offset,)
		else:
			sql = f"SELECT COUNT(*) FROM `{self.vendorTable}` WHERE `dept` = %s";
			vals = (id,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			count = res[0]
			sql = f"""
				SELECT `id`,`name`
				FROM `{self.vendorTable}`
				WHERE `dept` = %s
				LIMIT 10
				OFFSET %s
			"""
			vals = (id,offset)

		conn.execute(sql,vals)
		rows = conn.fetchall()
		employees = []
		if rows:
			for row in rows:
				complaintCount = 0
				sql = f"""
					SELECT COUNT(*)
					FROM `{self.complaintTable}`
					WHERE `vid` = %s
				"""
				vals = (row[0],)
				conn.execute(sql,vals)
				res = conn.fetchone()
				complaintCount = res[0]
				employees.append({
					"id": row[0],
					"name": row[1],
					"complaintCount": complaintCount
				})

		final = {
			"employees": employees,
			"count": count
		}
		return final

	def search(self,term,offset):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `id`,`name`
			FROM `{self.tableName}`
			WHERE LOWER(`name`) LIKE %s
			LIMIT 10
			OFFSET %s
		"""
		vals = ('%'+term+'%',offset)
		conn.execute(sql,vals)
		final = []
		rows = conn.fetchall()
		print(rows)
		if rows:
			for row in rows:
				sql = f"SELECT COUNT(*) FROM `{self.vendorTable}` WHERE `dept` = %s"
				vals = (row[0],)
				conn.execute(sql,vals)
				res = conn.fetchone()
				count = 0
				if res:
					count = res[0]

				final.append({
					"id": row[0],
					"name": row[1],
					"count": count	
				}) 

		return final

	def searchVendor(self,dept,term,offset):
		conn = self.conn.cursor()
		term = term.lower()
		if dept == -1:
			sql = f"""
				SELECT `id`,`name`
				FROM `{self.vendorTable}`
				WHERE `dept` IS NULL
				AND (
					LOWER(`name`) LIKE %s
					OR `id` = %s
				)
				LIMIT 10
				OFFSET %s
			"""
			vals = ('%'+term+'%',term,offset)
		else:
			sql = f"""
				SELECT `id`,`name`
				FROM `{self.vendorTable}`
				WHERE `dept` = %s
				AND (
					LOWER(`name`) LIKE %s
					OR `id` = %s
				)
				LIMIT 10
				OFFSET %s
			"""
			vals = (dept,'%'+term+'%',term,offset)
		conn.execute(sql,vals)
		rows = conn.fetchall()

		final = []

		if rows:
			for row in rows:
				complaintCount = 0
				sql = f"""
					SELECT COUNT(*)
					FROM `{self.complaintTable}`
					WHERE `vid` = %s
				"""
				vals = (row[0],)
				conn.execute(sql,vals)
				res = conn.fetchone()
				complaintCount = res[0]
				final.append({
					"id": row[0],
					"name": row[1],
					"complaintCount": complaintCount	
				})
		conn.close()
		return final