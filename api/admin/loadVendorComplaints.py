from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.vendor import Vendor


def loadVendorComplaints(req):
	if exists(["id","offset"],req):
		id = req["id"]
		offset = req["offset"]
		vendor = Vendor("","")
		res = vendor.viewComplaints(id,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)