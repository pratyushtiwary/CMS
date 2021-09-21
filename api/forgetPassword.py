import json
from models.employee import Employee
from models.vendor import Vendor
from models.admin import Admin
from utils.auth import generateToken
from utils.sender import verifyOTP
from utils.validate import exists
from flask import Response
from utils.msg import error, success

def forgetPassword(req):
	if exists(["email","phone","password","type","otp"],req):
		email, phone, password, type, otp = req["email"], req["phone"], req["password"], req["type"], req["otp"]
		if type=="employee":
			obj = Employee(email,"")	
		elif type=="vendor":
			obj = Vendor(email,"")
		elif type=="admin":
			obj = Admin(email,"")


		res = obj.exists()

		if res==True:
			verfotp = verifyOTP({
				"email": email,
				"phone": phone,
				"type": type,
				"code": otp	
			})

			if verfotp==True:
				obj.resetPass(password,phone)
				return success("Password reset successfull!")
			return verfotp

		else:
			return error("NO_USER_FOUND")

	return Response(response=error("INVALID_REQUEST"),status=400)