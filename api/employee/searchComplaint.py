import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def searchComplaint(req):
	if exists(["term","offset"],req):
		term = req["term"]
		offset = req["offset"]
		eid = viewToken(req["token"])["id"]
		complaint = Complaint()

		complaints = complaint.searchEmployeeComplaint(eid,term,offset)

		return success(complaints)
	return Response(response=error("INVALID_REQUEST"),status=400)	