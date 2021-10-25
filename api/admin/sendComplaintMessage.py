from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.complaint import Complaint


def sendComplaintMessage(req):
	if exists(["id","msg"],req):
		id = req["id"]
		msg = req["msg"]
		complaint = Complaint()
		res = complaint.sendMessage(id,msg)
		if res==True:
			return success("Message Send Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)