from conn import DB
from utils.getset import GetSet
from utils.encryption import password_hash,password_verify
from utils.msg import error
from globals import otp_validity_minutes
import time
import datetime


class OTP(DB,GetSet):
	def __init__(self,email:str,phone:str,type:str="employee"):

		self.email = email
		self.tableName = "otp"
		self.phone = phone

		self.conn = DB.__init__(self)

		GetSet.__init__(self,self.tableName)

		self.type = type

	def setOTP(self,code):
		email = self.email
		phone = self.phone
		type = self.type
		sql = f"SELECT 1 FROM `{self.tableName}` WHERE `email` = %s and `type` = %s"
		vals = (email,type)
		conn = self.conn.cursor()
		conn.execute(sql,vals)

		res = conn.fetchone()

		if(res):
			sql = f"UPDATE `{self.tableName}` SET `Code`= %s, `ts`= CURRENT_TIMESTAMP() WHERE `email`= %s and `type` = %s"
			vals = (code,email,type)
		else:
			sql = f"INSERT INTO `{self.tableName}`(`id`, `ts`, `code`, `phone`, `email`, `type`) VALUES(NULL,CURRENT_TIMESTAMP(),%s,%s,%s,%s)"
			vals = (code,phone,email,type)

		conn.execute(sql,vals)

		self.conn.commit()

		conn.close()

		return True

	def checkOTP(self,code):
		conn = self.conn.cursor()
		email = self.email
		phone = self.phone
		type = self.type

		sql = f"SELECT `code`,`ts` FROM `{self.tableName}` WHERE `email`= %s and phone= %s and type= %s"
		vals = (email,phone,type)

		conn.execute(sql,vals)

		res = conn.fetchone()

		if res:

			ts = res[1] + datetime.timedelta(minutes=otp_validity_minutes)

			now = datetime.datetime.now()

			if now > ts:
				return error("EXPIRED_OTP")

			if password_verify(res[0],str(code)):
				sql = f"DELETE FROM `{self.tableName}` WHERE `email` = %s and `type` = %s"
				vals = (email,type)
				conn.execute(sql,vals)

				self.conn.commit()

				conn.close()
				return True

		return error("INVALID_OTP")