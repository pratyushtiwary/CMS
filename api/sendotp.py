from utils.sender import sendOTP
from models.employee import Employee
from models.vendor import Vendor
from models.admin import Admin
from utils.msg import error, success
from utils.validate import exists
from flask import Response

def sendotp(req):
	if exists(["email","type","by"],req):
		email, type, by = req['email'], req['type'], req["by"]
		if type=="employee":
			obj = Employee(email,"")
		elif type=="vendor":
			obj = Vendor(email,"")
		elif type=="admin":
			obj = Admin(email,"")

		res = obj.exists()
		if by=="register" and res!=True:
			if exists(["phone"],req):
				phone = req["phone"]

				if phone:

					result = sendOTP({
						"email": email,
						"phone": phone,
						"type": type	
					})

					if result:
						return success("OTP sent")
					else:
						return error("UNABLE_TO_SEND_OTP")
		elif by=="login":
			if exists(["password"],req):
				password = req["password"]
				obj.password = password
				res = obj.login()
				if res==True:
					phone = obj.get("phone",False)

					if phone:

						result = sendOTP({
							"email": email,
							"phone": phone,
							"type": type	
						})

						if result:
							return success("OTP sent")
						else:
							return error("UNABLE_TO_SEND_OTP")
					else:
						return error("NO_USER_FOUND")
				else:
					return res
		elif by=="forget_password" and res:
			if type!="admin":
				phone, active = obj.get(["phone","active"])
				if int(active)==0:
					return error("INACTIVE_ACCOUNT")
			else:
				phone = obj.get("phone")

			ph = req["phone"]
			if phone==ph:

				result = sendOTP({
					"email": email,
					"phone": phone,
					"type": type	
				})

				if result:
					return success("OTP sent")
				else:
					return error("UNABLE_TO_SEND_OTP")
			else:
				return error("NO_USER_FOUND_PHONE")
		elif res:
			return error("USER_ALREADY_EXISTS")
		else:
			return error("NO_USER_FOUND")
	return Response(response=error("INVALID_REQUEST"),status=400)