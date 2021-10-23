from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.complaint import Complaint


def viewComplaint(req):
	if exists(["id"],req):
		id = req["id"]
		complaint = Complaint()
		res = complaint.view(id)
		return res
	return Response(response=error("INVALID_REQUEST"),status=400)