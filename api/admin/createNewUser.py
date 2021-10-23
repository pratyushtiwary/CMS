from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.admin import Admin

def createNewUser(req):
	if exists(["type"],req):
		type = req["type"]
		admin = Admin("","")
		if type=="employee":
			if exists(["name","email","phone","roomNo","eid","password","accomodationType"],req):
				res = admin.createUser({
					"name": req["name"],
					"email": req["email"],
					"phone": req["phone"],
					"roomNo": req["roomNo"],
					"eid": req["eid"],
					"password": req["password"],
					"accomodationType": req["accomodationType"]
				},"employee")

				if res == True:
					return success("User created successfully!")
				else:
					return res
		elif type=="vendor":
			if exists(["name","email","phone","vid","dept","password"],req):
				res = admin.createUser({
					"name": req["name"],
					"email": req["email"],
					"phone": req["phone"],
					"vid": req["vid"],
					"dept": req["dept"],
					"password": req["password"]	
				},"vendor")

				if res == True:
					return success("User created successfully!")
				else:
					return res
		elif type=="admin":
			if exists(["name","email","phone","password","aid"],req):
				res = admin.createUser({
					"name": req["name"],
					"email": req["email"],
					"phone": req["phone"],
					"aid": req["aid"],
					"password": req["password"]	
				},"admin")

				if res == True:
					return success("User created successfully!")
				else:
					return res
	return Response(response=error("INVALID_REQUEST"),status=400)