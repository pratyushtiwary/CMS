from conn import DB
from utils.getset import GetSet
from utils.encryption import password_hash,password_verify
from utils.msg import error
from utils.sender import sendOTP, sendMsg

class Employee(DB,GetSet):
	def __init__(self,email,password):
		"""
			Model for Employee to interact with the db
		"""
		self.conn = DB.__init__(self)
		self.tableName = "employees"
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

			self.conn.commit()

			conn.close()
			if conn.rowcount:
				return True
			return False
		else:
			return error("USER_ALREADY_EXISTS")