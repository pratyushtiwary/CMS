from flask import Response
from utils.msg import error, success
from utils.validate import exists
from models.complaint import Complaint

def searchComplaint(req):
	if exists(["term","offset"],req):
		term, offset = req["term"], req["offset"]
		complaint = Complaint()
		res = complaint.searchAll(term,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)
