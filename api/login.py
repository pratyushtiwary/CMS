from models.employee import Employee
from models.vendor import Vendor
from models.admin import Admin
from utils.auth import generateToken
from utils.sender import verifyOTP
from utils.validate import exists
from flask import Response
from utils.msg import error, success


def login(req):
	if exists(["email","password","type","otp"],req):
		email, password, type, otp = req['email'], req['password'], req['type'], req['otp']
		if type=="employee":
			obj = Employee(email,password)	
		elif type=="vendor":
			obj = Vendor(email,password)
		elif type=="admin":
			obj = Admin(email,password)

		res = obj.login()
		if res==True:
			phone,id = obj.get(["phone","id"])
			verfotp = verifyOTP({
				"email": email,
				"phone": phone,
				"type": type,
				"code": otp	
			})
			if verfotp==True:
				return success(generateToken({"id":id,"type":type}))
			else:
				return verfotp
	else:
		return Response(response=error("INVALID_REQUEST"),status=400)
