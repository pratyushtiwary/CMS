from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.vendor import Vendor


def loadVendor(req):
	if exists(["id"],req):
		id = req["id"]
		vendor = Vendor("","")
		res = vendor.view(id)
		return res
	return Response(response=error("INVALID_REQUEST"),status=400)