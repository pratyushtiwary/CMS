from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def assignVendor(req):
	if exists(["id","vid"],req):
		complaint = Complaint()
		id = req["id"]
		vid = req["vid"]
		res = complaint.allotVendor(id,vid)
		if res==True:
			return success("Vendor Assigned Successfully!");
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)