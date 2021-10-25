from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def changeComplaintPriority(req):
	if exists(["id","newPriority"],req):
		complaint = Complaint()
		id = req["id"]
		newPriority = req["newPriority"]
		res = complaint.changePriority(id,newPriority)
		if res==True:
			return success("Priority Changed Successfully!");
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)