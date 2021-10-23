from flask import Response
from utils.msg import error, success
from utils.validate import exists
from models.vendor import Vendor

def searchVendor(req):
	if exists(["term","offset"],req):
		term, offset = req["term"], req["offset"]
		vendor = Vendor("","")
		res = vendor.search(term,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)
