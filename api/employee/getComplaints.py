from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def getComplaints(req):
	if exists(["token","offset"],req):
		token = req["token"]
		offset = int(req["offset"])
		complaint = Complaint()
		eid = viewToken(token)["id"]
		data = complaint.fetch(eid,offset)
		return success(data)
	return Response(response=error("INVALID_REQUEST"),status=400)	