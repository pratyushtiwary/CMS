from flask import Response
from utils.msg import success
from utils.validate import exists
from models.admin import Admin
from utils.auth import viewToken

def saveSettings(req):
	if exists(["name","email","phone","aid"],req):
		id = viewToken(req["token"])["id"]
		admin = Admin("","")
		res =  admin.save(id,{
			"name": req["name"],
			"email": req["email"],
			"phone": req["phone"],
			"aid": req["aid"]	
		})
		if res==True:
			return success("Settings Saved successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)
