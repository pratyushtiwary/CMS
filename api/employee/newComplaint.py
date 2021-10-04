from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def newComplaint():
	req = request.form
	files = request.files
	if exists(["token","body","dept"],req,True):
		token, body, dept = req["token"], req["body"],req["dept"]
		eid = viewToken(token)["id"]
		complaint = Complaint()
		status = complaint.create({
			"eid": eid,
			"body": body,
			"dept": dept,
			"priority": "low",
			"status": "pending",
			"images": files
		}) 
		if status == True:
			return success("Complaint Opened Successfully!")
		else:
			return status
	return Response(response=error("INVALID_REQUEST"),status=400)	