from conn import DB
from utils.getset import GetSet
from utils.encryption import password_hash,password_verify
from utils.msg import success,error
from utils.sender import sendOTP, sendMsg
from globals import appName
from utils.validate import exists

class Admin(DB,GetSet):
	def __init__(self,email,password):
		"""
			Model for Admin to interact with the db
		"""
		self.conn = DB.__init__(self)
		self.tableName = "admin"
		self.employeeTable = "employee"
		self.vendorTable = "vendor"
		self.departmentTable = "department"
		self.announcementTable = "announcement"
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
			"msg": msg,
			"type": "admin"
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

		self.conn.commit()

		conn.close()

		return True

	def login(self):
		"""
			Logs in the user
		"""

		conn = self.conn.cursor()
		sql = f"SELECT `password` FROM `{self.tableName}` WHERE `email`=%s"
		vals = (self.email,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		conn.close()
		if(res):
			if(password_verify(res[0],self.password)):
				return True
			return error("INVALID_PASSWORD")

		return error("NO_USER_FOUND")

	def exists(self):
		conn = self.conn.cursor()
		sql = f"SELECT 1 FROM `{self.tableName}` WHERE `email`= %s LIMIT 1"
		vals = (self.email,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		conn.close()
		if res:
			return True
		return False

	def getAllUsers(self):
		conn = self.conn.cursor()

		sql = f"""
					SELECT COUNT(DISTINCT e.id), COUNT(DISTINCT v.id)
					FROM {self.employeeTable} e, {self.vendorTable} v
			"""
		conn.execute(sql)
		res = conn.fetchone()
		final = {
			"employees": 0,
			"vendors": 0,
			"total": 0
		}
		if res:
			final["employees"] = res[0]
			final["vendors"] = res[1]
			final["total"] = res[0] + res[1]

		return final


	def createUser(self,args,type="employee"):
		conn = self.conn.cursor()
		if type=="employee":
			if exists(["name","email","phone","roomNo","eid","password","accomodationType"],args):
				name,email,phone,roomNo,eid,password,accomodationType = args["name"],args["email"],args["phone"],args["roomNo"],args["eid"],args["password"],args["accomodationType"]
				password = password_hash(password)
				try:
					sql = f"""
						SELECT 1
						FROM `{self.employeeTable}`
						WHERE `email` = %s
					"""
					vals = (email,)
					conn.execute(sql,vals)

					res = conn.fetchone()

					if res:
						return error("USER_ALREADY_EXISTS")

					sql = f"""
						INSERT INTO `{self.employeeTable}`(`id`, `name`, `email`, `phone`, `roomNo`, `accomodation`, `password`, `empid`, `ts`, `notify`, `active`)
						VALUES (NULL,%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP(),1,1)
					"""
					vals = (name,email,phone,roomNo,accomodationType,password,eid)
					conn.execute(sql,vals)
					id = conn.lastrowid
					sendMsg({
						"email": email,
						"phone": phone,
						"code": "NEW_USER_EMPLOYEE",
						"subject": f"Welcome to {appName}",
						"id": id,
						"type": "employee",
						"force": True	
					})
					self.conn.commit()
					conn.close()
					return True

				except Exception as e:
					print(e)
					self.conn.rollback()
					return error("SERVER_ERROR")

			return error("INVALID_PARAMS")
		elif type=="vendor":
			if exists(["name","email","phone","vid","dept","password"],args):
				name,email,phone,vid,dept,password = args["name"],args["email"],args["phone"],args["vid"],args["dept"],args["password"]
				password = password_hash(password)
				try:
					sql = f"""
						SELECT 1
						FROM `{self.vendorTable}`
						WHERE `email` = %s
					"""
					vals = (email,)
					conn.execute(sql,vals)

					res = conn.fetchone()

					if res:
						return error("USER_ALREADY_EXISTS")

					if int(dept) != -1:
						sql = f"""
							SELECT `name`
							FROM `{self.departmentTable}`
							WHERE `id` = %s
						"""
						vals = (dept,)
						conn.execute(sql,vals)
						res = conn.fetchone()
						if dept:
							deptName = res[0]
						sql = f"""
							INSERT INTO `{self.vendorTable}`(`id`, `name`, `phone`, `dept`, `email`, `password`, `vendorid`, `ts`, `notify`, `active`)
							VALUES(NULL,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP(),1,1)
						"""
						vals = (name,phone,dept,email,password,vid)
					else:
						deptName = "No Department"
						sql = f"""
							INSERT INTO `{self.vendorTable}`(`id`, `name`, `phone`, `dept`, `email`, `password`, `vendorid`, `ts`, `notify`, `active`)
							VALUES(NULL,%s,%s,NULL,%s,%s,%s,CURRENT_TIMESTAMP(),1,1)
						"""
						vals = (name,phone,email,password,vid)
					conn.execute(sql,vals)
					id = conn.lastrowid
					sendMsg({
						"email": email,
						"phone": phone,
						"code": "NEW_USER_VENDOR",
						"subject": f"Welcome to {appName}",
						"id": id,
						"type": "vendor",
						"force": True,
						"extras": (deptName,)
					})
					self.conn.commit()
					conn.close()
					return True

				except Exception as e:
					print(e)
					self.conn.rollback()
					return error("SERVER_ERROR")
			return error("INVALID_PARAMS")
		elif type=="admin":
			if exists(["name","email","phone","password","aid"],args):
				name,email,phone,password,aid = args["name"], args["email"], args["phone"], args["password"], args["aid"]
				password = password_hash(password)
				try:
					sql = f"""
						SELECT 1
						FROM `{self.tableName}`
						WHERE `email` = %s
					"""
					vals = (email,)
					conn.execute(sql,vals)

					res = conn.fetchone()

					if res:
						return error("USER_ALREADY_EXISTS")

					sql = f"""
						INSERT INTO `{self.tableName}`(`id`, `name`, `email`, `password`, `phone`, `ts`, `notify`, `adminid`)
						VALUES(NULL,%s,%s,%s,%s,CURRENT_TIMESTAMP(),1,%s)
					"""
					vals = (name,email,password,phone,aid)
					conn.execute(sql,vals)
					id = conn.lastrowid
					sendMsg({
						"email": email,
						"phone": phone,
						"code": "NEW_USER_ADMIN",
						"subject": f"Welcome to {appName}",
						"id": id,
						"type": "admin",
						"force": True	
					})
					self.conn.commit()
					conn.close()
					return True

				except Exception as e:
					print(e)
					self.conn.rollback()
					return error("SERVER_ERROR")
			return error("INVALID_PARAMS")
		return error("INVALID_PARAMS")

	def getValues(self,id):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `name`,`email`,`phone`,`adminId`
			FROM `{self.tableName}`
			WHERE `id` = %s
		"""
		vals = (id,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		conn.close()
		if res:
			final = {
				"name": res[0],
				"email": res[1],
				"phone": res[2],
				"adminId": res[3]
			}
			return success(final)
		else:
			return error("NO_USER_FOUND")

	def delete(self,id):
		conn = self.conn.cursor()
		try:
			sql = f"""
				DELETE FROM `{self.announcementTable}`
				WHERE `byAdmin` = %s
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

	def save(self,id,args):
		if exists(["name","phone","email","aid"],args):
			name,phone,email,aid = args["name"],args["phone"],args["email"],args["aid"]
			conn = self.conn.cursor()
			try:
				sql = f"""
					UPDATE `{self.tableName}`
					SET `name` = %s,
						`email` = %s,
						`phone` = %s,
						`adminid` = %s
				"""
				vals = (name,email,phone,aid)
				conn.execute(sql,vals)

				self.conn.commit()
				conn.close()
				return True

			except Exception as e:
				print(e)
				self.conn.rollback()
				return error("SERVER_ERROR")
		return error("INVALID_PARAMS")