from models.employee import Employee
from models.vendor import Vendor
from utils.sender import verifyOTP
from utils.validate import exists
from flask import Response
from utils.msg import error, success


def register(req):
	if exists(["email","password","type","otp","name","phone"],req):
		email, password, type, otp, name, phone = req['email'], req['password'], req['type'], req['otp'], req['name'], req['phone']
		res = False
		args = {
			"name": name,
			"phone": phone
		}
		if type=="employee":
			obj = Employee(email,password)
			if exists(["roomNo","empId","accomodation"],req):
				roomNo, empId, accomodation = req['roomNo'], req['empId'], req['accomodation']
				args["roomNo"] = roomNo
				args["empId"] = empId
				args['accomodation'] = accomodation
				res = True

		elif type=="vendor":
			obj = Vendor(email,password)
			if exists(["vendorId"],req):
				vendorId = req['vendorId']
				args["vendorId"] = vendorId
				res = True

		if res==True:
			verfotp = verifyOTP({
				"email": email,
				"phone": phone,
				"type": type,
				"code": otp	
			})

			if verfotp==True:
				res = obj.register(args)
				if res==True:
					return success("User registered successfully")
				else:
					return res
			else:
				return verfotp

	return Response(response=error("INVALID_REQUEST"),status=400)
