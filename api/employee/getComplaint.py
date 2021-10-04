from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def getComplaint(req):
	if exists(["cid"],req):
		eid = viewToken(req["token"])["id"]
		complaint = Complaint()
		cid = req["cid"]
		status,res = complaint.fetchone(eid,cid)
		if status==True:
			return success(res)
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	