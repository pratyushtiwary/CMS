from conn import DB
from utils.validate import exists
from utils.msg import success,error

class Feedback(DB):
	def __init__(self):
		self.tableName = "feedback"
		self.conn = DB.__init__(self)

	def get(self,cid,type="employee"):
		conn = self.conn.cursor()
		if type=="employee":
			sql = f"""
				SELECT `employeeStar`,`employeeMsg`
				FROM `{self.tableName}`
				WHERE `forComplaint` = %s
			"""
			vals = (cid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			final = {
				"given": False
			}
			if res:
				if res[0] and res[1]:
					final = {
						"given": True,
						"rating": res[0],
						"feedback": res[1]
					}
			conn.close()
			return final
		elif type == "vendor":
			sql = f"""
				SELECT `vendorStar`,`vendorMsg`
				FROM `{self.tableName}`
				WHERE `forComplaint` = %s
			"""
			vals = (cid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			final = {
				"given": False
			}
			if res:
				if res[0] and res[1]:
					final = {
						"given": True,
						"rating": res[0],
						"feedback": res[1]
					}
			conn.close()
			return final

	def set(self,args,type="employee"):
		conn = self.conn.cursor()
		if type == "employee":
			if exists(["cid","rating","feedback"],args):
				cid,rating,feedback = args["cid"], args["rating"], args["feedback"]
				try:
					sql = f"SELECT 1 FROM `{self.tableName}` WHERE `forComplaint` = %s"
					vals = (cid,)
					conn.execute(sql,vals)
					res = conn.fetchone()

					if res:
						sql = f"""
							UPDATE `{self.tableName}`
							SET `employeeStar` = %s,
							`employeeMsg` = %s,
							`employeeOn` = CURRENT_TIMESTAMP()
							WHERE `forComplaint` = %s
						"""
						vals = (rating,feedback,cid)
					else:
						sql = f"""
							INSERT INTO `{self.tableName}`(`id`, `forComplaint`, `vendorMsg`, `vendorStar`, `employeeMsg`, `employeeStar`, `vendorOn`, `employeeOn`)
							VALUES(NULL,%s,NULL,NULL,%s,%s,NULL,CURRENT_TIMESTAMP())
						"""
						vals = (cid,feedback,rating)

					conn.execute(sql,vals)

					self.conn.commit()
					conn.close()

					return True
				except Exception as e:
					print(e)
					self.conn.rollback()
					return error("SERVER_ERROR")
			return error("SERVER_ERROR")
		elif type=="vendor":
			if exists(["cid","rating","feedback"],args):
				cid,rating,feedback = args["cid"], args["rating"], args["feedback"]
				try:
					sql = f"SELECT 1 FROM `{self.tableName}` WHERE `forComplaint` = %s"
					vals = (cid,)
					conn.execute(sql,vals)
					res = conn.fetchone()

					if res:
						sql = f"""
							UPDATE `{self.tableName}`
							SET `vendorStar` = %s,
							`vendorMsg` = %s,
							`vendorOn` = CURRENT_TIMESTAMP()
							WHERE `forComplaint` = %s
						"""
						vals = (rating,feedback,cid)
					else:
						sql = f"""
							INSERT INTO `{self.tableName}`(`id`, `forComplaint`, `vendorMsg`, `vendorStar`, `employeeMsg`, `employeeStar`, `vendorOn`, `employeeOn`)
							VALUES(NULL,%s,%s,%s,NULL,NULL,CURRENT_TIMESTAMP(),NULL)
						"""
						vals = (cid,feedback,rating)

					conn.execute(sql,vals)

					self.conn.commit()
					conn.close()

					return True
				except Exception as e:
					print(e)
					self.conn.rollback()
					return error("SERVER_ERROR")
			return error("SERVER_ERROR")
		return error("SERVER_ERROR")