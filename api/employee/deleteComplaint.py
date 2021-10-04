import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def deleteComplaint(req):
	if exists(["cid"],req):
		cid = req["cid"]
		complaint = Complaint()

		res = complaint.delete(cid)

		if res==True:
			return success("Complaint Delete Successfully!")
		else:
			return res

	return Response(response=error("INVALID_REQUEST"),status=400)	