import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from utils.files import uploader
from models.complaint import Complaint
from utils.auth import viewToken

def newComplaint():
	req = request.form
	files = request.files
	if exists(["token","body"],req,True):
		token, body = req["token"], req["body"]
		eid = viewToken(token)["id"]
		complaint = Complaint()

		id, status = complaint.create({
			"eid": eid,
			"body": body,
			"priority": "low",
			"status": "pending"
		}) 

		if status == True:
			upload = uploader(files,id)
			if upload==True:
				return success("Complaint Opened Successfully!")
			else:
				return upload
		else:
			return id
	return Response(response=error("INVALID_REQUEST"),status=400)	