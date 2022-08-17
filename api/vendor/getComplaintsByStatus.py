from utils.msg import success
from models.complaint import Complaint
from utils.auth import viewToken

def getComplaintsByStatus(req):
	token = req["token"]
	complaint = Complaint()
	eid = viewToken(token)["id"]
	data = complaint.fetchNoOfStatus(eid)
	return success(data)