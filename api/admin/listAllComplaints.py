from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.complaint import Complaint


def listAllComplaints(req):
	if exists(["offset"],req):
		offset = req["offset"]
		complaint = Complaint()
		return success(complaint.listAll(offset))
	return Response(response=error("INVALID_REQUEST"),status=400)