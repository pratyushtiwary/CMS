from conn import DB
from utils.getset import GetSet
from utils.encryption import password_hash,password_verify
from utils.msg import error, success
from utils.validate import exists
from utils.sender import sendOTP, sendMsg
from models.complaint import Complaint
from globals import appName

class Employee(DB,GetSet):
	def __init__(self,email,password):
		"""
			Model for Employee to interact with the db
		"""
		self.conn = DB.__init__(self)
		self.tableName = "employee"
		self.complaintTable = "complaint"
		self.departmentTable = "department"
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
			"subject": "Password Changed(Employee)",
			"id": 0,
			"type": "employee",
			"force": True
		})
		self.conn.commit()

		conn.close()

		return True


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
			roomNo = args["roomNo"]
			empId = args["empId"]
			accomodation = args["accomodation"]

			sql = f"""INSERT INTO `{self.tableName}`(`id`, `name`, `email`, `phone`, `roomNo`, `accomodation`, `password`, `empid`, `ts`, `notify`,`active`)
					 VALUES(NULL,%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP(),1,0)"""
			vals = (name,email,phone,roomNo,accomodation,pwd,empId)

			conn.execute(sql,vals)
			sendMsg({
				"email": email,
				"phone": phone,
				"code": "NEW_USER_EMPLOYEE",
				"subject": f"Welcome to {appName}",
				"id": 0,
				"type": "employee",
				"force": True	
			})
			self.conn.commit()

			conn.close()
			if conn.rowcount:
				return True
			return False
		else:
			return error("USER_ALREADY_EXISTS")

	def setDetail(self,args):
		if exists(["id","name","email","phone","roomNo","accomodation","notify"],args):
			conn = self.conn.cursor()
			id, name, email, phone, roomNo, accomodation, notify = args["id"], args["name"], args["email"], args["phone"], args["roomNo"], args["accomodation"], args["notify"]
			try:
				sql = f"""
						UPDATE {self.tableName} 
						SET `name` = %s, `email` = %s, `phone` = %s, `roomNo` = %s, `accomodation` = %s, `notify` = %s
						WHERE `id` = %s
				"""
				vals = (name,email,phone,roomNo,accomodation,notify,id)
				conn.execute(sql,vals)
				self.conn.commit()
				conn.close()

				return True
			except Exception as e:
				self.conn.rollback()
				return error("SERVER_ERROR")
		return error("SERVER_ERROR")

	def fetchDetail(self,id):
		conn = self.conn.cursor()
		try:
			eid = id
			sql = f"""
					SELECT `name`,`email`,`phone`,`roomNo`,`accomodation`,`notify`
					FROM `{self.tableName}`
					WHERE `id` = %s
			"""
			vals = (eid,)
			conn.execute(sql,vals)

			res = conn.fetchone()
			conn.close()
			if res:
				final = {
					"name": res[0],
					"email": res[1],
					"phone": res[2],
					"roomNo": res[3],
					"accomodation": res[4],
					"notify": res[5]
				}
				return (True,final)
			else:
				return (False,error("NO_USER_FOUND"))
		except Exception as e:
			self.conn.rollback()
			return (False,error("SERVER_ERROR"))

	def listAll(self,offset):
		conn = self.conn.cursor()
		employees = {
			"list": [],
			"count": 0
		}
		sql = f"""
				SELECT e.`id`, e.`name`, e.`email`, e.`roomNo`, e.`ts`, e.`active`, c.`count`
				FROM {self.tableName} e, (
					SELECT COUNT(*) as count
					FROM {self.tableName}
				) c
				LIMIT 10
				OFFSET %s;
		"""
		vals = (offset,)
		conn.execute(sql,vals)
		res = conn.fetchall()
		if res:
			for row in res:
				employees["list"].append({
					"id": row[0],
					"name": row[1],
					"email": row[2],
					"room": row[3],
					"on": row[4].strftime("%d/%m/%Y"),
					"active": row[5]
				})
			employees["count"] = res[0][6]
		conn.close()
		return employees

	def view(self,id):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `name`,`phone`,`email`,`ts`,`active`,`roomNo`
			FROM `{self.tableName}`
			WHERE `id` = %s
		"""
		vals = (id,)
		conn.execute(sql,vals)
		res = conn.fetchone()
		if res:
			final = {
				"id": id,
				"name": res[0],
				"phone": res[1],
				"email": res[2],
				"on": res[3].strftime("%d/%m/%Y"),
				"active": res[4],
				"roomNo": res[5]
			}
			return success(final)
		else:
			return error("NO_EMPLOYEE_FOUND")

	def viewComplaints(self,id,offset):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `id`,`shortBody`,`ts`,`status`,`priority`
			FROM `{self.complaintTable}`
			WHERE `eid` = %s
			LIMIT 10
			offset %s
		"""
		vals = (id,offset)
		conn.execute(sql,vals)
		complaints = []
		count = 0
		rows = conn.fetchall()
		sql = f"SELECT COUNT(*) FROM `{self.complaintTable}` WHERE `eid` = %s"
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
					"on": row[2].strftime("%d/%m/%Y"),
					"status": row[3],
					"priority": row[4]	
				})

		final = {
			"complaints": complaints,
			"count": count
		}
		return final

	def changeRoomNo(self,id,newRoomNo):
		conn = self.conn.cursor()
		try:
			sql = f"""
				UPDATE `{self.tableName}`
				SET `roomNo` = %s
				WHERE `id` = %s
			"""
			vals = (newRoomNo,id)
			conn.execute(sql,vals)

			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")

	def delete(self,id):
		conn = self.conn.cursor()
		complaint = Complaint()
		try:
			sql = f"""
				SELECT `id`
				FROM `{self.complaintTable}`
				WHERE `eid` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			rows = conn.fetchall()
			for row in rows:
				complaint.delete(row[0])

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
				"type": "employee"
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
		term = term.lower()
		sql = f"""
			SELECT `id`,`name`,`email`,`roomNo`,`ts`,`active`
			FROM `{self.tableName}`
			WHERE LOWER(`name`) LIKE %s
			OR LOWER(`email`) LIKE %s
			OR `roomNo` = %s
			OR `id` = %s
			LIMIT 10
			OFFSET %s
		"""
		vals = ('%'+term+'%','%'+term+'%',term,term,offset)
		conn.execute(sql,vals)
		final = []
		rows = conn.fetchall()
		if rows:
			for row in rows:
				final.append({
					"id": row[0],
					"name": row[1],
					"email": row[2],
					"room": row[3],
					"on": row[4].strftime("%d/%m/%Y"),
					"active": row[5]	
				})

		return final