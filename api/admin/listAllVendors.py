from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.vendor import Vendor


def listAllVendors(req):
	if exists(["offset"],req):
		offset = req["offset"]
		vendor = Vendor("","")
		return success(vendor.listAll(offset))
	return Response(response=error("INVALID_REQUEST"),status=400)