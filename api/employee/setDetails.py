import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.employee import Employee
from utils.auth import viewToken

def setDetails(req):
	if exists(["name","email","phone","roomNo","accomodation","notify"],req):
		id = viewToken(req["token"])["id"]
		name, email, phone, roomNo, accomodation, notify = req["name"], req["email"], req["phone"], req["roomNo"], req["accomodation"],req["notify"]
		employee = Employee("","")
		res = employee.setDetail({
			"id": id,
			"name": name,
			"email": email,
			"phone": phone,
			"roomNo": roomNo,
			"accomodation": accomodation,
			"notify": notify
		})

		if res==True:
			return success("Settings saved successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	