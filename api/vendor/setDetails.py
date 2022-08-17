import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.vendor import Vendor
from utils.auth import viewToken

def setDetails(req):
	if exists(["name","email","phone","vendorid","notify"],req):
		id = viewToken(req["token"])["id"]
		name, email, phone, vid, notify = req["name"], req["email"], req["phone"], req["vendorid"],req["notify"]
		vendor = Vendor("","")
		res = vendor.setDetail({
			"id": id,
			"name": name,
			"email": email,
			"phone": phone,
			"vendorid": vid,
			"notify": notify
		})

		if res==True:
			return success("Settings saved successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	