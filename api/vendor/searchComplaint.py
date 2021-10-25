import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken
import time

def searchComplaint(req):
	if exists(["term","offset"],req):
		term = req["term"]
		vid = viewToken(req["token"])["id"]
		offset = req["offset"]
		complaint = Complaint()

		complaints = complaint.searchVendorComplaint(vid,term,offset)

		return success(complaints)
	return Response(response=error("INVALID_REQUEST"),status=400)	