from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.complaint import Complaint


def changeComplaintDepartment(req):
	if exists(["id","dept"],req):
		id = req["id"]
		dept = req["dept"]
		complaint = Complaint()
		res = complaint.changeDept(id,dept)
		if res==True:
			return success("Complaint Department Changed Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)