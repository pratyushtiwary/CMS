from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.vendor import Vendor


def toggleVendorAccountActivation(req):
	if exists(["id","active"],req):
		id = req["id"]
		active = req["active"]
		vendor = Vendor("","")
		res = vendor.toggleActivation(id,active)
		if res == True:
			return success("Account "+("Activated" if active else "Deactivated")+" Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)