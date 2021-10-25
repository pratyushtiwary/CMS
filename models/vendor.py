from conn import DB
from utils.getset import GetSet
from utils.encryption import password_hash,password_verify
from utils.msg import error, success
from utils.sender import sendOTP, sendMsg
from models.department import Department
from globals import appName

class Vendor(DB,GetSet):
	def __init__(self,email,password):
		"""
			Model for Vendor to interact with the db
		"""
		self.conn = DB.__init__(self)
		self.tableName = "vendor"
		self.departmentTable = "department"
		self.complaintTable = "complaint"
		GetSet.__init__(self,self.tableName)

		self.email = email
		self.password = password

	def sendotp(self):
		email = self.email
		conn = self.conn.cursor()
		phone,id = self.get(["phone","id"])
		OTP = sendOTP({
			"email": email,
			"phone": phone,
			"id": id
		})
		if OTP:
			return True
		else:
			return error("UNABLE_TO_SEND_OTP")

	def notify(self,msg):
		email = self.email
		phone, id = self.get(["phone","id"])
		res = sendMsg({
			"email": email,
			"phone": phone,
			"id": id,
			"msg": msg	
		})
		if res:
			return True
		else:
			return error("UNABLE_TO_SEND_MSG")

	def resetPass(self,newPwd,phone):
		conn = self.conn.cursor()
		pwd = password_hash(newPwd)

		sql = f"UPDATE `{self.tableName}` SET `password` = %s WHERE `email` = %s and `phone`=%s and `active` = 1"
		vals = (pwd,self.email,phone)

		conn.execute(sql,vals)

		sendMsg({
			"email": self.email,
			"phone": phone,
			"code": "PASSWORD_CHANGE",
			"subject": "Password Changed(Vendor)",
			"type": "vendor",
			"id": 0,
			"force": True
		})

		self.conn.commit()

		conn.close()

		return True

	def login(self):
		"""
			Logs in the user
		"""

		conn = self.conn.cursor()
		sql = f"SELECT `password`,`active` FROM `{self.tableName}` WHERE `email`=%s"
		vals = (self.email,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		conn.close()
		if(res):
			if(password_verify(res[0],self.password)):
				if res[1]:
					return True
				else:
					return error("INACTIVE_ACCOUNT")
			else:
				return error("INVALID_PASSWORD")


		return error("NO_USER_FOUND")

	def exists(self):
		conn = self.conn.cursor()
		sql = f"SELECT 1 FROM `{self.tableName}` WHERE `email`= %s"
		vals = (self.email,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		conn.close()
		if res:
			return True

		return False

	def register(self,args):
		"""
			Register the user
		"""

		conn = self.conn.cursor()
		if(not self.exists()):

			email = self.email
			pwd = password_hash(self.password)
			name = args["name"]
			phone = args["phone"]
			vendorId = args["vendorId"]

			sql = f"""INSERT INTO `{self.tableName}`(`id`, `name`, `phone`, `dept`, `email`, `password`, `vendorid`, `ts`, `notify`,`active`)
					 VALUES(NULL,%s,%s,NULL,%s,%s,%s,CURRENT_TIMESTAMP(),1,0)"""
			vals = (name,phone,email,pwd,vendorId)

			conn.execute(sql,vals)
			sendMsg({
				"email": email,
				"phone": phone,
				"code": "NEW_USER_VENDOR_REGISTER",
				"subject": f"Welcome to {appName}",
				"id": 0,
				"type": "vendor",
				"force": True	
			})
			self.conn.commit()

			conn.close()
			if conn.rowcount:
				return True
			return False
		else:
			return error("USER_ALREADY_EXISTS")

	def listAll(self,offset):
		conn = self.conn.cursor()
		vendors = []
		sql = f"SELECT `id`,`name` FROM `{self.departmentTable}` LIMIT 10 OFFSET %s"
		vals = (offset,)
		conn.execute(sql,vals)
		depts = conn.fetchall()
		for (i,dept) in enumerate(depts):
			vendors.append({})
			vendors[i]["name"] = dept[1]
			sql = f"""
				SELECT `id`, `name`, `ts`, `email`, `phone`, `active`
				FROM {self.tableName}
				WHERE dept = %s
			"""
			vendors[i]["vendors"] = []
			vals = (dept[0],)
			conn.execute(sql,vals)
			rows = conn.fetchall()
			for row in rows:
				vendors[i]["vendors"].append({
					"id": row[0],
					"name": row[1],
					"on": row[2].strftime("%d/%m/%y"),
					"email": row[3],
					"phone": row[4],
					"active": row[5]
				})
		if offset == 0:
			sql = f"""
				SELECT `id`, `name`, `ts`, `email`, `phone`, `active`
				FROM {self.tableName}
				WHERE dept IS NULL
			"""
			conn.execute(sql)
			vendors.append({})
			rows = conn.fetchall()
			vendors[len(vendors)-1]["name"] = "-"
			vendors[len(vendors)-1]["vendors"] = []
			for row in rows:
				vendors[len(vendors)-1]["vendors"].append({
					"id": row[0],
					"name": row[1],
					"on": row[2].strftime("%d/%m/%y"),
					"email": row[3],
					"phone": row[4],
					"active": row[5]
				})


		sql = f"SELECT COUNT(*) FROM `{self.departmentTable}`"
		conn.execute(sql)
		res = conn.fetchone()
		count = res[0]

		final = {
			"count": count+1,
			"vendors": vendors
		}

		conn.close()
		return final

	def view(self,id):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `name`,`phone`,`email`,`ts`,`dept`,`active`
			FROM `{self.tableName}`
			WHERE `id` = %s
		"""
		vals = (id,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		if res:
			if res[4]:
				sql = f"SELECT `name` FROM `{self.departmentTable}` WHERE `id` = %s"
				vals = (res[4],)
				conn.execute(sql,vals)
				r = conn.fetchone()
				dept = r[0]
				deptId = res[4]
			else:
				dept = "No Department"
				deptId = -1
			final = {
				"id": id,
				"name": res[0],
				"phone": res[1],
				"email": res[2],
				"on": res[3].strftime("%d/%m/%y"),
				"department": dept,
				"deptId": deptId,
				"active": res[5]
			}
			return success(final)
		else:
			return error("NO_VENDOR_FOUND")

	def viewComplaints(self,id,offset):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `id`,`shortBody`,`ts`,`status`,`priority`
			FROM `{self.complaintTable}`
			WHERE `vid` = %s
			LIMIT 10
			offset %s
		"""
		vals = (id,offset)
		conn.execute(sql,vals)
		complaints = []
		count = 0
		rows = conn.fetchall()
		sql = f"SELECT COUNT(*) FROM `{self.complaintTable}` WHERE `vid` = %s"
		vals = (id,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		if res:
			count = res[0]
		if rows:
			for row in rows:
				complaints.append({
					"id": row[0],
					"title": row[1],
					"on": row[2].strftime("%d/%m/%y"),
					"status": row[3],
					"priority": row[4]	
				})

		final = {
			"complaints": complaints,
			"count": count
		}
		return final

	def changeDept(self,id,newDept):
		conn = self.conn.cursor()
		try:
			sql = f"""
				SELECT `email`,`phone`,`dept`
				FROM `{self.tableName}`
				WHERE `id` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			email,phone,dept = res[0],res[1],res[2]
			deptName = "No Department"
			if dept:
				sql = f"""
					SELECT `name`
					FROM `{self.departmentTable}`
					WHERE `id` = %s
				"""
				vals = (dept,)
				conn.execute(sql,vals)
				res = conn.fetchone()
				deptName = res[0]
			newDeptName = "No Department"
			if int(newDept) != -1:
				sql = f"""
					SELECT `name`
					FROM `{self.departmentTable}`
					WHERE `id` = %s
				"""
				vals = (newDept,)
				conn.execute(sql,vals)
				res = conn.fetchone()
				newDeptName = res[0]
			if int(newDept) == -1:
				sql = f"""
					UPDATE `{self.tableName}`
					SET `dept` = NULL
					WHERE `id` = %s
				"""
				vals = (id,)
				conn.execute(sql,vals)
			else:
				sql = f"""
					UPDATE `{self.tableName}`
					SET `dept` = %s
					WHERE `id` = %s
				"""
				vals = (newDept,id)
				conn.execute(sql,vals)
			sendMsg({
				"email": email,
				"phone": phone,
				"code": "CHANGE_DEPARTMENT",
				"subject": "Department Changed",
				"id": id,
				"type": "vendor",
				"extras": (deptName,newDeptName)
			})
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")

	def delete(self,id):
		conn = self.conn.cursor()
		try:
			sql = f"""
				UPDATE `{self.complaintTable}`
				SET `vid` = NULL
				WHERE `vid` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			sql = f"""
				DELETE FROM `{self.tableName}`
				WHERE `id` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")

	def toggleActivation(self,id,active:bool):
		conn = self.conn.cursor()
		try:
			sql = f"""
				SELECT `email`,`phone`
				FROM `{self.tableName}`
				WHERE `id` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			email,phone = res[0],res[1]

			sql = f"""
				UPDATE `{self.tableName}`
				SET `active` = %s
				WHERE `id` = %s
			"""
			vals = (active,id)
			conn.execute(sql,vals)
			action = "Activated" if active else "Deactivated"
			sendMsg({
				"email": email,
				"phone": phone,
				"code": "ACCOUNT_"+action.upper(),
				"subject": "Account "+action,
				"id": id,
				"type": "vendor"
			})
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")

	def search(self,term,offset):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `id`,`name`,`ts`,`email`,`phone`,`dept`,`active`
			FROM `{self.tableName}`
			WHERE `name` LIKE %s
			OR `email` LIKE %s
			OR `phone` LIKE %s
			OR `id` = %s
			LIMIT 10
			OFFSET %s
		"""
		vals = ('%'+term+'%','%'+term+'%','%'+term+'%',term,offset)
		conn.execute(sql,vals)

		final = []
		temp = {}
		i = 0
		rows = conn.fetchall()
		if rows:
			for row in rows:
				deptName = "-"
				if row[5]:
					sql = f"SELECT `name` FROM `{self.departmentTable}` WHERE `id` = %s"
					vals = (row[5],)
					conn.execute(sql,vals)
					res = conn.fetchone()
					deptName = res[0]
				if temp.get(deptName,None)!=None:
					j = temp.get(deptName,0)
					final[j]["vendors"].append({
						"id": row[0],
						"name": row[1],
						"on": row[2].strftime("%d/%m/%y"),
						"email": row[3],
						"phone": row[4],
						"active": row[6]
					})
				else:
					temp[deptName] = i
					final.append({
						"name": deptName,
						"vendors": [
							{
								"id": row[0],
								"name": row[1],
								"on": row[2].strftime("%d/%m/%y"),
								"email": row[3],
								"phone": row[4],
								"active": row[6]
							}
						]	
					})
					i += 1
		return final