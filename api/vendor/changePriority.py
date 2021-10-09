from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def changePriority(req):
	if exists(["cid","newPriority"],req):
		vid = viewToken(req["token"])["id"]
		complaint = Complaint()
		cid = req["cid"]
		newPriority = req["newPriority"]
		res = complaint.changeVendorPriority(vid,cid,newPriority)
		if res==True:
			return success("Priority Changed Successfully!");
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)