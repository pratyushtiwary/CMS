from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def changeStatus(req):
	if exists(["cid","newStatus","desc"],req):
		vid = viewToken(req["token"])["id"]
		complaint = Complaint()
		cid = req["cid"]
		desc = req["desc"]
		newStatus = req["newStatus"]
		res = complaint.changeVendorStatus(vid,cid,newStatus,desc)
		if res==True:
			return success("Status Changed Successfully!");
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)